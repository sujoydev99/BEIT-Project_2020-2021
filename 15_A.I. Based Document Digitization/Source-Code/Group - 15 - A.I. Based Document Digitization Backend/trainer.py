import json
import random
import logging
from sklearn.metrics import classification_reportS
from sklearn.metrics import precision_recall_fscore_support
from spacy.gold import GoldParse
from spacy.scorer import Scorer
from sklearn.metrics import accuracy_score
import spacy

def convert_dataturks_to_spacy(dataturks_JSON_FilePath):
    training_data = []
    lines=[]
    with open(dataturks_JSON_FilePath, 'r') as f:
        lines = f.readlines()
        for line in lines:
            #line=lines[0]
            data = json.loads(line)
            text = data['content']
            entities = []                   
            annotations=[]
            if data['annotation'] == None:
                continue
            for annotation in data['annotation']:
                point = annotation['points'][0]
                label = annotation['label']  
                annotations.append((point['start'], point['end'] ,label,point['end']-point['start']))
                
            annotations=sorted(annotations, key=lambda student: student[3],reverse=True) 
            seen_tokens = set() 
            for annotation in annotations:
  
                start=annotation[0]
                end=annotation[1]
                labels=annotation[2]
                if start not in seen_tokens and end - 1 not in seen_tokens:
         
                    seen_tokens.update(range(start, end)) 
                    if not isinstance(labels, list):
                        labels = [labels]
    
                    for label in labels:
                        #dataturks indices are both inclusive [start, end] but spacy is not [start, end)
                        if len(labels)==1: 
                            entities.append((start, end+1  ,label))


            training_data.append((text, {"entities" : entities}))

    return training_data

def train_spacy():

    TRAIN_DATA = convert_dataturks_to_spacy("dataset_Annotated.json")
    nlp = spacy.blank('en')  # create blank Language class
    # create the built-in pipeline components and add them to the pipeline
    # nlp.create_pipe works for built-ins that are registered with spaCy
    if 'ner' not in nlp.pipe_names:
        ner = nlp.create_pipe('ner')
        nlp.add_pipe(ner, last=True)
       

    # add labels
    for _, annotations in TRAIN_DATA:
         for ent in annotations.get('entities'):
            ner.add_label(ent[2])
    print(nlp.pipe_names)
    # get names of other pipes to disable them during training
    other_pipes = [pipe for pipe in nlp.pipe_names if pipe != 'ner']
    with nlp.disable_pipes(*other_pipes):  # only train NER
        optimizer = nlp.begin_training()
        for itn in range(100):
            print("Statring iteration " + str(itn))
            random.shuffle(TRAIN_DATA)
            losses = {}
            for text, annotations in TRAIN_DATA:
              nlp.update([text], [annotations], drop=0.2,  sgd=optimizer,  losses=losses)
            print(losses)

train_spacy()
