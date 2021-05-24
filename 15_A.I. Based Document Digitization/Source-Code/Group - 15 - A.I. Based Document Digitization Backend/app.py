import os
from flask import Flask, flash, request, redirect, url_for, jsonify, send_file
from werkzeug.utils import secure_filename
import json
import uuid
from flask_cors import CORS
from PyPDF2 import PdfFileReader
from pdf2image import convert_from_path
import pymongo
import flask_cors
import bcrypt 
import jwt
from run import *
from datetime import datetime
from bson.objectid import ObjectId
from flask_pymongo import PyMongo
from bson.json_util import dumps,loads

# constants
UPLOAD_FOLDER = './uploads'
RETRAIN_UPLOAD_FOLDER = './retrains'
PDF_UPLOAD_FOLDER = './pdfUploads'
ALLOWED_EXTENSIONS = { 'pdf', 'png', 'jpg', 'jpeg'}

app = Flask(__name__)
CORS(app)
app.debug=True
app.config['UPLOAD_FOLDER'] =  UPLOAD_FOLDER
app.config['RETRAIN_UPLOAD_FOLDER'] =  RETRAIN_UPLOAD_FOLDER
app.config['PDF_UPLOAD_FOLDER'] =  PDF_UPLOAD_FOLDER
# enabled cors fo accessing through react
#CORS(app)
myclient = PyMongo(app, uri="mongodb://localhost:27017/docs?readPreference=primary&appname=MongoDB%20Compass&ssl=false")
db = myclient   .db

secret = 'qwert3456*&*&^32'

@app.route('/upload', methods=['POST'])
def upload_file():
    try:
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500
        # check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({
                    "error":"please send a file in the request"
                }), 400
        file = request.files['file']
        # # if user does not select file, browser also
        # # submit an empty part without filename
        if file.filename == '':
            return jsonify({
                    "error":"please send a file"
                }), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(str(uuid.uuid4())+"."+file.filename.split('.')[1])
            if file.filename.split('.')[1] == 'pdf':
                file.save(os.path.join(app.config['PDF_UPLOAD_FOLDER'], filename))
                pdfObj = open(app.config['PDF_UPLOAD_FOLDER']+'/'+filename, 'rb')
                pdf = PdfFileReader(pdfObj)
                print(pdf.getNumPages())
                if pdf.getNumPages() > 1 or pdf.getNumPages() < 1:
                    return jsonify({
                        "error":"pdf should contain exactly 1 page"
                    }), 400
                images = convert_from_path(app.config['PDF_UPLOAD_FOLDER']+'/'+filename)
                images[0].save(os.path.join(app.config['UPLOAD_FOLDER']+'/'+ filename.split('.')[0]+'.jpg'),'JPEG')
                pdfObj.close() 
                os.remove(app.config['PDF_UPLOAD_FOLDER']+'/'+filename)
                filename = secure_filename(filename.split('.')[0]+'.jpg')
            else:
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

            # text extract 
            extract = getOutput("img",os.path.join(app.config['UPLOAD_FOLDER']+'/'+filename))
            # save to mongo
            db.uploads.insert_one({"userId":ObjectId(bearer["_id"]), "metaData":extract, "fileName":filename, "timestamp": datetime.now() })
            return jsonify({
                "filename":filename,
                "extract":extract,
            }), 200 
    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500
                         
@app.route('/submit-retrain-request/<_id>', methods=['POST'])
def submit_retrain(_id):
    try:
        val = request.json
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500
        content = val["content"]
        annotations = val["annotation"]
        for annotation in annotations:
            print (annotation)
        val = request.json
        with open('./new_train_data.json', 'a') as out_file:
            out_file.write(json.dumps(val))
            out_file.write("\n")
        db.retrainRequest.update_one({"userId":ObjectId(bearer["_id"]), "_id":ObjectId(_id)},{"$set":{
            "retrainObject": val
        }})
        return jsonify({
                "message":"data added for retrain request"
            }), 200
        return jsonify({
                "message":"data added for retrain request"
            }), 200
    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500
      
@app.route('/login', methods=['POST'])
def login():
    try:
        val = request.json
        errors= {}
        # validation
        if "email" not in val:
            errors["email"] = "Email is required"
        if "password" not in val:
            errors["password"] = "Password is required"
        if errors != {}:
            return jsonify({
                "message":"validation error",
                "errors":json.loads(json.dumps(errors, default=str))
            }), 400
        user = db.users.find_one({"email":val["email"]})
        if user!=None:
            if bcrypt.checkpw(val["password"].encode('utf8'), user['password'].encode('utf8')):
                user = json.loads(json.dumps(user, default=str))
                del user["password"]
                jwttoken = jwt.encode(user, secret, algorithm="HS256")
                return jsonify({
                    "message": "user logged in",
                    "data": "Bearer "+jwttoken
                }), 200
            return jsonify({
                "message": "Invalid credentials", 
                "data":json.loads(json.dumps(user, default=str))
            }), 400
        else:
            return jsonify({
            "message":"user does not exist"
        }), 400
    except Exception as e:
        print(e)
        return jsonify({
            "error": e
        }), 400

@app.route('/register', methods=['POST'])
def register():
    try:
        val = request.json
        errors= {}
        # validation
        if "email" not in val:
            errors["email"] = "Email is required"
        if "password" not in val:
            errors["password"] = "Password is required"
        if "confirmPassword" not in val:
            errors["confirmPassword"] = "confirmPassword is required"
        if "password" in val and "confirmPassword" in val:            
            if val["password"] !=val["confirmPassword"]:
                errors["confirmPassword"] = "Passwords Don't match "
        if errors != {}:
            return jsonify({
                "message":"validation error",
                "errors":json.loads(json.dumps(errors, default=str))
            }), 400
        if db.users.find_one({"email":val["email"]}):
              return jsonify({
                "message":"user already exists"
            }), 400
        passwd = bcrypt.hashpw(val['password'].encode('utf8'), bcrypt.gensalt())
        print(passwd)
        user = db.users.insert_one({"email":val["email"], "password":passwd.decode('utf8'), "isAdmin":False})

        return jsonify({
            "message":"user created. please login"
        }), 200
    except Exception as e:
        print(e)
        return jsonify({
            "error": e
        }), 400


@app.route('/get-docs', methods=['GET'])
def getDocs():
    try:
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500

        docs = db.uploads.find({"userId":ObjectId(bearer['_id'])})
        return ({
            "message": "Documents list", 
            "data":json.loads(dumps(docs))
        }), 200
    except Exception as e:
        print(e)
        return jsonify({
            "error": e
        }), 400

@app.route('/get-doc/<_id>', methods=['GET'])
def getDoc(_id):
    try:
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500

        docs = db.uploads.find_one({"_id":ObjectId(_id)})
        return ({
            "message": "Document fetched", 
            "data":json.loads(dumps(docs))
        }), 200
    except Exception as e:
        print(e)
        return jsonify({
            "error": e
        }), 400

@app.route('/update/<_id>', methods=['PUT'])
def updateDoc(_id):
    try:
        val = request.json
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500
        db.uploads.update_one({"userId":ObjectId(bearer["_id"]), "_id":ObjectId(_id)},{"$set":{ "metaData":val, "timestamp": datetime.now() }})
        return jsonify({
            "message":"invoice data updated"
        }), 200 
    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/get-labels', methods=['GET'])
def getNerLables():
    try:
        k = getLables()
        print(k)
        return jsonify({
            "message":"existing label list",
            "labels":k
        }), 200 
    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/get-text-extract', methods=['POST'])
def getExtract():
    try:
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500
        # check if the post request has the file part
        if 'file' not in request.files:
            return jsonify({
                    "error":"please send a file in the request"
                }), 400
        file = request.files['file']
        # # if user does not select file, browser also
        # # submit an empty part without filename
        if file.filename == '':
            return jsonify({
                    "error":"please send a file"
                }), 400

        if file and allowed_file(file.filename):
            filename = secure_filename(str(uuid.uuid4())+"."+file.filename.split('.')[1])
            if file.filename.split('.')[1] == 'pdf':
                file.save(os.path.join(app.config['PDF_UPLOAD_FOLDER'], filename))
                pdfObj = open(app.config['PDF_UPLOAD_FOLDER']+'/'+filename, 'rb')
                pdf = PdfFileReader(pdfObj)
                print(pdf.getNumPages())
                if pdf.getNumPages() > 1 or pdf.getNumPages() < 1:
                    return jsonify({
                        "error":"pdf should contain exactly 1 page"
                    }), 400
                images = convert_from_path(app.config['PDF_UPLOAD_FOLDER']+'/'+filename)
                images[0].save(os.path.join(app.config['RETRAIN_UPLOAD_FOLDER']+'/'+ filename.split('.')[0]+'.jpg'),'JPEG')
                pdfObj.close() 
                os.remove(app.config['PDF_UPLOAD_FOLDER']+'/'+filename)
                filename = secure_filename(filename.split('.')[0]+'.jpg')
            else:
                file.save(os.path.join(app.config['RETRAIN_UPLOAD_FOLDER'], filename))

            # text extract 
            content = getExtractedText('img',os.path.join(app.config['RETRAIN_UPLOAD_FOLDER']+'/'+filename))
            # save to mongo
            retrainRequest =db.retrainRequest.insert_one({"userId":ObjectId(bearer["_id"]), "content":content, "fileName":filename, "timestamp": datetime.now(), "annotations":[], "isApproved":False })
            print(retrainRequest.inserted_id)
            return jsonify({
                "filename":filename,
                "content":content,
                "_id": json.loads(dumps(retrainRequest.inserted_id))
            }), 200 
    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500
   
@app.route('/get-overview', methods=['GET'])
def getOverView():
    try:
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500
        k = getLables()
        contributionCount = db.retrainRequest.find({"userId":ObjectId(bearer["_id"])}).count()
        contributionApproved = db.retrainRequest.find({"userId":ObjectId(bearer["_id"]), "isApproved":True}).count()
        contributionUnapproved = contributionCount - contributionApproved
        totalUploadExtractions = db.uploads.find({"userId":ObjectId(bearer["_id"])}).count()
        return jsonify({
            "message":"Account Over view",
            "labels":k,
            "contributionCount":contributionCount,
            "contributionApproved":contributionApproved,
            "contributionUnapproved":contributionUnapproved,
            "totalUploadExtractions":totalUploadExtractions,
        }), 200 
    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/get-contributions', methods=['GET'])
def getContributions():
    try:
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500

        docs = db.retrainRequest.find({"userId":ObjectId(bearer['_id'])})
        return ({
            "message": "Contributions", 
            "data":json.loads(dumps(docs))
        }), 200
    except Exception as e:
        print(e)
        return jsonify({
            "error": e
        }), 400


    try:
        val = request.json
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500
        db.uploads.update_one({"userId":ObjectId(bearer["_id"]), "_id":ObjectId(_id)},{"$set":{ "metaData":val, "timestamp": datetime.now() }})
        return jsonify({
            "message":"invoice data updated"
        }), 200 
    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/get-contribution/<_id>', methods=['GET'])
def getContribution(_id):
    try:
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500
        docs = db.retrainRequest.find_one({ "_id":ObjectId(_id)})
        return ({
            "message": "Contributions", 
            "data":json.loads(dumps(docs))
        }), 200
    except Exception as e:
        print(e)
        return jsonify({
            "error": e
        }), 400


@app.route('/admin/updateContribution/<_id>/<isApproved>', methods=['PUT'])
def updateContribution(_id, isApproved):
    try:
        val = request.json
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500
        var = ''
        if isApproved==ok:
            var = True
        else:
            var = False
        db.retrainRequest.update_one({"_id":ObjectId(_id)},{"$set":{ "isApproved":var}})
        return jsonify({
            "message":"approve status updated"
        }), 200 
    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500

@app.route('/admin/get-overview', methods=['GET'])
def getAdminOverView():
    try:
        bearer = request.headers["Authorization"]
        try:
            if bearer==None:
                return jsonify({
                        "message":" Unauthorized Acess. Please Login to continue"
                    }), 401
            bearer = bearer.split(' ')[1]
            bearer = jwt.decode(bearer, secret, algorithms=["HS256"])
        except Exception as e:
            print(e)
            return jsonify({
                "message": "Invalid access token"
            }), 500
        k = getLables()
        contributionCount = db.retrainRequest.find().count()
        contributionApproved = db.retrainRequest.find({"isApproved":True}).count()
        contributionUnapproved = contributionCount - contributionApproved
        totalUploadExtractions = db.uploads.find().count()
        return jsonify({
            "message":"Admin Overview",
            "labels":k,
            "contributionCount":contributionCount,
            "contributionApproved":contributionApproved,
            "contributionUnapproved":contributionUnapproved,
            "totalUploadExtractions":totalUploadExtractions,
        }), 200 
    except Exception as e:
        print(e)
        return jsonify({
            "error": str(e)
        }), 500


def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS
