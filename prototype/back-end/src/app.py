from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import config

db = SQLAlchemy()
jwt = JWTManager()

def create_app(config_name='default'):
    """Application factory"""
    app = Flask(__name__)
    app.config.from_object(config[config_name])
    
    # Initialize extensions
    db.init_app(app)
    jwt.init_app(app)
    CORS(app, supports_credentials=True)
    
    # Import models after db is initialized
    # Models need db to be initialized first
    from models import User, Genre, Artist, MusicalWork, Review
    
    # Register blueprints
    from routes import auth_bp, user_bp, producer_bp, search_bp, admin_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(user_bp)
    app.register_blueprint(producer_bp)
    app.register_blueprint(search_bp)
    app.register_blueprint(admin_bp)
    
    # Create tables
    with app.app_context():
        db.create_all()
    
    return app

