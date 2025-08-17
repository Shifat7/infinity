from transformers import DistilBertTokenizerFast, DistilBertForSequenceClassification
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, f1_score
import torch
from torch.utils.data import Dataset
import os

labels = ['backward counting', 'subatisation', 'skip counting',
          'subtraction facts', 'addition facts', 'graph analysis']
num_labels = len(labels)

# -----------------------------
# Device
# -----------------------------
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# --- Model Loading Logic ---
# Get the absolute path to the model directory
model_path = os.path.join(os.path.dirname(__file__), "model/model_therapist_notes_classifier")

# Reload trained model and tokenizer from the local path
loaded_tokenizer = DistilBertTokenizerFast.from_pretrained(model_path, local_files_only=True)
loaded_model = DistilBertForSequenceClassification.from_pretrained(model_path, local_files_only=True)

# Move to device if needed
loaded_model.to(device)

def predict_weaknesses_binary(text, model=loaded_model, tokenizer=loaded_tokenizer, threshold=0.35):
    encoding = tokenizer(text, return_tensors='pt', truncation=True, padding=True, max_length=128).to(device)
    with torch.no_grad():
        outputs = model(**encoding)
        probs = torch.sigmoid(outputs.logits).cpu().numpy()[0]
    return {labels[i]: int(probs[i] > threshold) for i in range(num_labels)}


print(predict_weaknesses_binary(
    "Shifat demonstrated difficulty during today’s subitising task and continues to exhibit inconsistent accuracy with basic addition facts (e.g., 7 + 6, 8 + 5). It is recommended that he engage in regular at-home practice using subitising drill cards to build automaticity. Additionally, incorporating concrete manipulatives such as counting blocks may support his conceptual understanding and help reduce computational errors. We will work on correcting addition facts."
))
