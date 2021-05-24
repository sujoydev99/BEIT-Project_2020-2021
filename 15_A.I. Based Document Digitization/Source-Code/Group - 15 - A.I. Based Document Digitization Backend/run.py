import spacy
import os 
import json
from google.cloud import vision
import io

# Setting Environment Variable for Vision API
os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "credentials.json"

modelDir = "models/AIDL_NER_DO-0.30_EP-20_80_PERC_DATA"

client = vision.ImageAnnotatorClient()

# Loading the saved Spacy model
nlp = spacy.load(modelDir)

def getLables():
  labels =nlp.entity.labels
  return labels

def getOutput(type, data):
  """
  Parameters: type: type of data, either img or txt
  Output: Prints the dictionary
  """
  # Setting Environment Variable for Vision API
  os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "credentials.json"

  modelDir = "models/AIDL_NER_DO-0.30_EP-20_80_PERC_DATA"

  client = vision.ImageAnnotatorClient()

  # Loading the saved Spacy model
  nlp = spacy.load(modelDir)
  textToPredict = ""
  # Checking if file type is img or not
  if (type == "img"):
    with io.open(data, 'rb') as image_file:
        # Reading file contente
        content = image_file.read()
        # Creating image format to match Vision API format
        image = vision.Image(content=content)
        # Getting results from Vision API
        text_response = client.text_detection(image=image)
        # print(text_response)
        # Getting the text from the response
        texts = [text.description for text in text_response.text_annotations]
        # Storing data in variable
        textToPredict = texts[0]
  else:
    # Opening txt file
    f = open(data, "r")
    # Storing data in variable
    textToPredict = f.read()
  # Sending textual data to Spacy model for NER
  doc = nlp(textToPredict)
  max_amt = 0
  i = 1
  data = {}
  items_list = []
  # Iterating over every entitiy to create a dictionary
  # print(doc)
  for ent in doc.ents:
    
    # Saving only one instance of Total Bill Amount
    if (ent.label_ == "Total bill amount"):
      try:
        amt = float(ent.text)
        if amt > max_amt:
          data["Total bill amount"] = amt
      except Exception as e:
        pass
    # Creating a list of Items
    elif (ent.label_ == "Items"):
      try:
        items_list.append(ent.text)
      except Exception as e:
        print(e)
    # Checking if the detected key is already present in the key,
    # If yes then we create a new key to store that value instead of overwriting the previous one
    else:
      if ent.label_ in data.keys():
        data[ent.label_+"-"+str(i)] = ent.text
        i +=1
      else:
        data[ent.label_] = ent.text
  # Staring the list of items using the Items key in the dictionary
  data["Items"]=items_list
  # Sorting all the elements of the dictionary
  data = dict(sorted(data.items()))
  # Printing final result
  return data

# getOutput("img", "1.jpg")


def getExtractedText(type,data):
  """
  Parameters: data: file name to extraxt text  """
  # Setting Environment Variable for Vision API
  # os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = "credentials.json"
  client = vision.ImageAnnotatorClient()
  type ="img"
  textToPredict = ""
  # Checking if file type is img or not
  if (type == "img"):
    with io.open(data, 'rb') as image_file:
        # Reading file contente
        content = image_file.read()
        # Creating image format to match Vision API format
        image = vision.Image(content=content)
        # Getting results from Vision API
        text_response = client.text_detection(image=image)
        # print(text_response)
        # Getting the text from the response
        texts = [text.description for text in text_response.text_annotations]
        # Storing data in variable
        textToPredict = texts[0]
  else:
    # Opening txt file
    f = open(data, "r")
    # Storing data in variable
    textToPredict = f.read()
  # Sending textual data bacl to for annotation
  return textToPredict
