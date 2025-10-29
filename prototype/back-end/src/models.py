from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime

# Import db from app module to avoid circular import
from app import db

class User(db.Model):
    """User model with role-based access"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), nullable=False, default='user')  # guest, user, producer, admin
    is_active = db.Column(db.Boolean, default=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    reviews = db.relationship('Review', backref='user', lazy=True, cascade='all, delete-orphan')
    
    def set_password(self, password):
        """Hash and set password"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check password"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active
        }


class Genre(db.Model):
    """Genre model"""
    __tablename__ = 'genres'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=True, nullable=False, index=True)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    musical_works = db.relationship('MusicalWork', backref='genre', lazy=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class Artist(db.Model):
    """Artist model"""
    __tablename__ = 'artists'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(200), nullable=False, index=True)
    biography = db.Column(db.Text)
    multimedia = db.Column(db.Text)  # JSON string or URL
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    musical_works = db.relationship('MusicalWork', backref='artist', lazy=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'name': self.name,
            'biography': self.biography,
            'multimedia': self.multimedia,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }


class MusicalWork(db.Model):
    """Musical work model"""
    __tablename__ = 'musical_works'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False, index=True)
    description = db.Column(db.Text)
    genre_id = db.Column(db.Integer, db.ForeignKey('genres.id'), nullable=False)
    artist_id = db.Column(db.Integer, db.ForeignKey('artists.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationships
    reviews = db.relationship('Review', backref='musical_work', lazy=True, cascade='all, delete-orphan')
    
    def to_dict(self, include_artist=False, include_genre=False, include_reviews=False, approved_reviews_only=False):
        """Convert to dictionary"""
        data = {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'genre_id': self.genre_id,
            'artist_id': self.artist_id,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }
        
        if include_artist and self.artist:
            data['artist'] = self.artist.to_dict()
        
        if include_genre and self.genre:
            data['genre'] = self.genre.to_dict()
        
        if include_reviews:
            reviews = self.reviews
            if approved_reviews_only:
                reviews = [review for review in reviews if review.is_approved]
            data['reviews'] = [review.to_dict() for review in reviews]
        
        return data


class Review(db.Model):
    """Review model for musical works"""
    __tablename__ = 'reviews'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    musical_work_id = db.Column(db.Integer, db.ForeignKey('musical_works.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)  # 1-5 rating
    comment = db.Column(db.Text)
    is_approved = db.Column(db.Boolean, default=False, nullable=False)  # Pending approval by producer
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    def to_dict(self, include_user=False):
        """Convert to dictionary"""
        data = {
            'id': self.id,
            'user_id': self.user_id,
            'musical_work_id': self.musical_work_id,
            'rating': self.rating,
            'comment': self.comment,
            'is_approved': self.is_approved,
            'created_at': self.created_at.isoformat() if self.created_at else None,
            'updated_at': self.updated_at.isoformat() if self.updated_at else None
        }
        
        if include_user and self.user:
            data['user'] = self.user.to_dict()
        
        return data

