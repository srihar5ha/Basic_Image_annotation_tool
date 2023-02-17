import os
import json
from flask import Flask, request, render_template, redirect, url_for, jsonify
from werkzeug.utils import secure_filename

app = Flask(__name__)

UPLOAD_FOLDER = 'static/uploads'
print(UPLOAD_FOLDER)
ALLOWED_EXTENSIONS = {'jpg', 'jpeg', 'png'}
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
print(app.config['UPLOAD_FOLDER'])
print(os.path.join(app.config['UPLOAD_FOLDER']))
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024

# function to check if file extension is valid
def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# main route to upload images and display on web page
@app.route('/', methods=['GET', 'POST'])
def index():
    print(UPLOAD_FOLDER)
    print("hello inside")
    if request.method == 'POST':
        images = request.files.getlist('file')
        print(images)
        image_names = []
        for image in images:
            if image and allowed_file(image.filename):
                print("yes inside")
                filename = secure_filename(image.filename)
                image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
                image_names.append(filename)
        return redirect(url_for('display_images', image_names=image_names))
    return render_template('index.html')

# route to display uploaded images on web page
@app.route('/display_images')
def display_images():
    image_names = request.args.getlist("image_names")
    print("these are image names ",image_names)
    return render_template('display.html', image_names=image_names)

    
@app.route('/annotate', methods=['GET', 'POST'])
def annotate():
    print("url is ",request.url)
    print("req args : ",request.args)
    if request.method == 'POST':
        # Process annotations and save to JSON file
        return redirect(url_for('index'))
    image_names = request.args.getlist("image_names[]")
    print("in annotation route image names are ",image_names)
    return render_template('annotate.html', image_names=image_names)

if __name__ == '__main__':
    app.run(debug=True)
