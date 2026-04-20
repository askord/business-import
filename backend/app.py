import os
import sqlite3
import datetime
import jwt
import requests
from flask import Flask, request, jsonify, make_response
from flask_cors import CORS
from functools import wraps
from dotenv import load_dotenv

load_dotenv(dotenv_path=os.path.join(os.getcwd(), '..', '.env'))

app = Flask(__name__)
CORS(app, supports_credentials=True)

app.config['SECRET_KEY'] = os.getenv('JWT_SECRET', 'supersecret')
DB_PATH = os.path.abspath(os.path.join(os.getcwd(), '..', 'database.sqlite'))

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

@app.route('/api/search', methods=['GET'])
def search():
    language = request.args.get('language', 'en')
    framePosition = request.args.get('framePosition', '0')
    frameSize = request.args.get('frameSize', '50')
    ItemTitle = request.args.get('ItemTitle')
    MinPrice = request.args.get('MinPrice')
    MaxPrice = request.args.get('MaxPrice')
    MinVolume = request.args.get('MinVolume')

    rate_cny = 13.5
    rate_usd = 95.0

    try:
        conn = get_db_connection()
        conn.execute(
            "INSERT INTO search_logs (timestamp, query, min_price, max_price, language) VALUES (?, ?, ?, ?, ?)",
            (datetime.datetime.now().isoformat(), ItemTitle, MinPrice, MaxPrice, language)
        )
        conn.commit()
        conn.close()
    except Exception as e:
        app.logger.warning(f"Failed to log search query: {e}")

    finalMinPrice = ""
    finalMaxPrice = ""

    def safe_float(val):
        try:
            if not val or val == "undefined":
                return None
            return float(val)
        except (ValueError, TypeError):
            return None

    numMinPrice = safe_float(MinPrice)
    numMaxPrice = safe_float(MaxPrice)

    if rate_cny > 0:
        if numMinPrice is not None: finalMinPrice = f"{numMinPrice / rate_cny:.2f}"
        if numMaxPrice is not None: finalMaxPrice = f"{numMaxPrice / rate_cny:.2f}"

    EXTERNAL_API_URL = "https://otapi-1688.p.rapidapi.com/BatchSearchItemsFrame"
    RAPIDAPI_KEY = os.getenv('RAPIDAPI_KEY')
    API_HEADERS = {
        "x-rapidapi-key": RAPIDAPI_KEY or "",
        "x-rapidapi-host": "otapi-1688.p.rapidapi.com"
    }

    try:
        resp = requests.get(EXTERNAL_API_URL, headers=API_HEADERS, params={
            'language': language,
            'framePosition': framePosition,
            'frameSize': frameSize,
            'ItemTitle': ItemTitle,
            'MinPrice': finalMinPrice,
            'MaxPrice': finalMaxPrice,
            'MinVolume': MinVolume,
            'OrderBy': 'Popularity:Desc'
        })
        resp.raise_for_status()
        data = resp.json()

        items = data.get('Result', {}).get('Items', {}).get('Items', {}).get('Content', [])
        formatted_items = []
        for item in items:
            physical = item.get('PhysicalParameters', {})
            dimensions = {
                'weight': physical.get('Weight', "-"),
                'length': physical.get('Length', "-"),
                'width': physical.get('Width', "-"),
                'height': physical.get('Height', "-")
            }

            quantity_ranges = item.get('QuantityRanges', [])
            quantity_prices = []
            for qr in quantity_ranges:
                original_price = qr.get('Price', {}).get('OriginalPrice')
                quantity_prices.append({
                    'min_quantity': qr.get('MinQuantity'),
                    'original_price_cny': original_price,
                    'price_rub': f"{original_price * rate_cny:.2f}" if original_price else "-",
                    'price_usd': f"{original_price * rate_cny / rate_usd:.2f}" if original_price and rate_usd else "-"
                })

            price_cny = item.get('Price', {}).get('OriginalPrice', 0)
            price_rub = f"{price_cny * rate_cny:.2f}"
            price_usd = f"{price_cny * rate_cny / rate_usd:.2f}"
            approx_price_rub = f"{float(price_rub) * 1.5:.0f}"

            formatted_items.append({
                'id': item.get('Id'),
                'title': item.get('Title'),
                'original_title': item.get('OriginalTitle'),
                'url': item.get('ExternalItemUrl') or item.get('TaobaoItemUrl') or "-",
                'price_cny': str(price_cny),
                'price_rub': price_rub,
                'price_usd': price_usd,
                'approx_price_rub': approx_price_rub,
                'image': item.get('MainPictureUrl') or (item.get('Pictures', [{}])[0].get('Url')) or "/assets/main/main-5.png",
                'min_order_quantity': item.get('MinOrderQuantity', "1"),
                'vendor': item.get('VendorDisplayName', "-"),
                'location': item.get('Location', {}).get('City', "-"),
                'dimensions': dimensions,
                'quantity_prices': quantity_prices
            })

        return jsonify({'total': len(formatted_items), 'items': formatted_items})
    except Exception as e:
        return jsonify({'error': 'Failed to fetch data', 'message': str(e)}), 500

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

@app.route('/api/send-email', methods=['POST'])
def send_email():
    # Mocking email sending as per original requirement
    return jsonify({'success': True, 'message': 'Email/Telegram sent (mocked)'})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
