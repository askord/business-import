import os
import sqlite3
import datetime
import uuid
import jwt
import requests
from flask import Flask, request, jsonify, make_response, send_from_directory
from flask_cors import CORS
from functools import wraps
from dotenv import load_dotenv
from werkzeug.utils import secure_filename

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(dotenv_path=os.path.abspath(os.path.join(BASE_DIR, '..', '.env')))

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'supersecret')
DB_PATH = os.path.abspath(os.path.join(BASE_DIR, '..', 'database.sqlite'))
UPLOAD_FOLDER = os.path.abspath(os.path.join(BASE_DIR, '..', 'public', 'uploads'))
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'webp', 'gif'}
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.cookies.get('admin_token')
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        try:
            jwt.decode(token, app.config['SECRET_KEY'], algorithms=["HS256"])
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
        return f(*args, **kwargs)
    return decorated

@app.route('/api/login', methods=['POST', 'OPTIONS'])
def login():
    if request.method == 'OPTIONS':
        return make_response()
    auth = request.json
    if not auth or not auth.get('username') or not auth.get('password'):
        return jsonify({'message': 'Could not verify'}), 401

    if auth.get('username') == os.getenv('ADMIN_USER') and auth.get('password') == os.getenv('ADMIN_PASS'):
        token = jwt.encode({
            'user': auth.get('username'),
            'exp': datetime.datetime.utcnow() + datetime.timedelta(hours=24)
        }, app.config['SECRET_KEY'], algorithm="HS256")

        response = make_response(jsonify({'success': True}))
        response.set_cookie('admin_token', token, httponly=True, samesite='Lax', max_age=86400, path='/')
        return response

    return jsonify({'message': 'Invalid credentials'}), 401


@app.route('/api/articles', methods=['GET'])
def get_articles():
    conn = get_db_connection()
    articles = conn.execute('SELECT * FROM articles ORDER BY id DESC').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in articles])

@app.route('/api/articles/<int:id>', methods=['GET'])
def get_article(id):
    conn = get_db_connection()
    article = conn.execute('SELECT * FROM articles WHERE id = ?', (id,)).fetchone()
    conn.close()
    if article:
        return jsonify(dict(article))
    return jsonify({'error': 'Article not found'}), 404

@app.route('/api/articles', methods=['POST'])
@token_required
def create_article():
    data = request.json
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO articles (title, slug, preview, content, image, created_at) VALUES (?, ?, ?, ?, ?, ?)',
        (data['title'], data['slug'], data['preview'], data['content'], data['image'], datetime.datetime.now().isoformat())
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True}), 201

@app.route('/api/articles/<int:id>', methods=['PUT'])
@token_required
def update_article(id):
    data = request.json
    conn = get_db_connection()
    conn.execute(
        'UPDATE articles SET title = ?, slug = ?, preview = ?, content = ?, image = ? WHERE id = ?',
        (data['title'], data['slug'], data['preview'], data['content'], data['image'], id)
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/articles/<int:id>', methods=['DELETE'])
@token_required
def delete_article(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM articles WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/services', methods=['GET'])
def get_services():
    conn = get_db_connection()
    services = conn.execute('SELECT * FROM services').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in services])

@app.route('/api/services', methods=['POST'])
@token_required
def create_service():
    data = request.json
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO services (title, description, steps, price) VALUES (?, ?, ?, ?)',
        (data['title'], data['description'], data['steps'], data['price'])
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True}), 201

@app.route('/api/services/<int:id>', methods=['PUT'])
@token_required
def update_service(id):
    data = request.json
    conn = get_db_connection()
    conn.execute(
        'UPDATE services SET title = ?, description = ?, steps = ?, price = ? WHERE id = ?',
        (data['title'], data['description'], data['steps'], data['price'], id)
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/services/<int:id>', methods=['DELETE'])
@token_required
def delete_service(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM services WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/banners', methods=['GET'])
def get_banners():
    conn = get_db_connection()
    banners = conn.execute('SELECT * FROM banners ORDER BY id ASC').fetchall()
    conn.close()
    return jsonify([dict(ix) for ix in banners])

@app.route('/api/upload', methods=['POST'])
@token_required
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part in request'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file and allowed_file(file.filename):
        ext = file.filename.rsplit('.', 1)[1].lower()
        unique_filename = f"{uuid.uuid4().hex}.{ext}"
        filepath = os.path.join(app.config['UPLOAD_FOLDER'], unique_filename)
        file.save(filepath)
        url_path = f"/uploads/{unique_filename}"
        return jsonify({'url': url_path, 'filename': unique_filename}), 201
    return jsonify({'error': 'File type not allowed'}), 400

@app.route('/uploads/<filename>', methods=['GET'])
def uploaded_file(filename):
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/banners', methods=['POST'])
@token_required
def create_banner():
    data = request.json
    if not data or not data.get('image_url'):
        return jsonify({'error': 'image_url is required'}), 400
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO banners (image_url, title) VALUES (?, ?)',
        (data['image_url'], data.get('title', ''))
    )
    conn.commit()
    conn.close()
    return jsonify({'success': True}), 201

@app.route('/api/banners/<int:id>', methods=['DELETE'])
@token_required
def delete_banner(id):
    conn = get_db_connection()
    conn.execute('DELETE FROM banners WHERE id = ?', (id,))
    conn.commit()
    conn.close()
    return jsonify({'success': True})

@app.route('/api/send-email', methods=['POST'])
def send_email():
    # Mocking email sending as per original requirement
    return jsonify({'success': True, 'message': 'Email/Telegram sent (mocked)'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
