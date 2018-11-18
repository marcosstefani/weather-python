import os
from flask import Flask, render_template, send_from_directory

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("home.html")

@app.errorhandler(404)
def not_found(error):
    return render_template('error.html', error=error, number=404), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('error.html', error=error, number=500), 500

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'),
                               'favicon.ico', mimetype='image/vnd.microsoft.icon')