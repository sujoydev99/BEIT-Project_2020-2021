# A.I. Based Document Digitization

## Members

- Sujoy Dev - 17104036
- Priya Naik - 17104021
- Rashmi Shetty - 17104070

## Description
\
Document maintenance is a difficult and cumbersome task. Everyday huge chunks of data
are misplaced due to improper handling of documents during and after their need. This
must be very disruptive since there may be loss of confidential or important data which my
potentially be harmful to any organization.
In this research paper we propose to create automated system for secure digitization and
maintenance of documents. Institutions/users must be able to upload documents(expense
bills/ invoices etc.) and the important data from these documents must be extracted and
stored for later use. If the data is not extracted from the documents the users must be
able to select the data themselves. Send the users insights about their document/invoices
,i.e., expiration, validity, etc. The application will store the data extraction model in a
centralized repository. This centralized model will retrain at regular intervals to keep the
models updated. This will increase the model accuracy over time as well as the number the
entities that can be recognized. A web based user interface will be provided to upload the
invoices(single or bulk) and view the extracted information in unstructured format.
In order to extract data from invoices the application will make use of Named entity
Recognition(NER) which is a subset of natural language processing and openCV image
processing. With the help of openCV we will perform optical character recognition on the
document/invoice, furthermore we will extract tabular data using custom algorithms. The
OCR data will be passed to the NER service for extraction of important Invoice metadata,
which may be used later for analysis.

## How to run
## Python backend server setup 
#### requiremets
- `python3` 
- `pip3` 
- `flask`
#### run
`pip/pip3 install requirements.txt`

`python -m flask run`

app runs on `http://localhost:5000/`

#### NOTE
app currently user colab for training/retraining the model since local system cannot handle the load

## React.js frontend setup 
#### requiremets
- `node.js` > 12 
- `npm` > 6 
- facebooks `create-react-app`
#### run
`npm install`

`npm run start-dev`

to build the app run `npm run build`

app runs on `http://localhost:3001/`

#### dataset used
`https://drive.google.com/file/d/1aur7IDtYuo7X_kUOTOE9KAw9fGy5EHhd/view?usp=sharing`

#### DB setup
setup custom mongo connection string at `/Group - 15 - A.I. Based Document Digitization Backend/app.py` line 33, since the app only requires a pretained model db can be altered/updated as and when needed
