from flask import Flask, request, render_template, redirect, url_for
import os
from werkzeug.utils import secure_filename
from PIL import Image
import pytesseract

# Configuration de l'application Flask
app = Flask(__name__)
UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

# Configuration de Tesseract
pytesseract.pytesseract.tesseract_cmd = r'C:\Program Files\Tesseract-OCR\tesseract.exe'
os.environ['TESSDATA_PREFIX'] = r'C:\Program Files\Tesseract-OCR'  # Assurez-vous que ce chemin est correct

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return "Aucun fichier téléchargé", 400
    
    file = request.files['file']
    if file.filename == '':
        return "Fichier non valide", 400

    if file and file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        try:
            # Extraire le texte de l'image
            text = extract_text(file_path)
            return render_template('result.html', text=text)  # Envoie du texte extrait vers result.html
        except Exception as e:
            return f"Erreur lors de l'extraction du texte : {str(e)}", 500
    else:
        return "Format de fichier non supporté", 400

def extract_text(image_path):
    try:
        image = Image.open(image_path)
    except Exception as e:
        raise ValueError("Le fichier fourni n'est pas une image valide ou est corrompu.")
    
    # Extraction du texte avec Tesseract
    text = pytesseract.image_to_string(image, lang='fra')
    return text

if __name__ == '__main__':
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    app.run(debug=True)
