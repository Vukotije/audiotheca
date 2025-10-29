from models import db, Genre

class GenreRepository:
    """Repository for genre operations"""
    
    @staticmethod
    def create(name, description=None):
        """Create a new genre"""
        genre = Genre(name=name, description=description)
        db.session.add(genre)
        db.session.commit()
        return genre
    
    @staticmethod
    def find_all():
        """Get all genres"""
        return Genre.query.all()
    
    @staticmethod
    def find_by_id(genre_id):
        """Find genre by ID"""
        return Genre.query.get(genre_id)
    
    @staticmethod
    def find_by_name(name):
        """Find genre by name"""
        return Genre.query.filter_by(name=name).first()
    
    @staticmethod
    def update(genre_id, name=None, description=None):
        """Update genre"""
        genre = Genre.query.get(genre_id)
        if not genre:
            return None
        
        if name is not None:
            genre.name = name
        if description is not None:
            genre.description = description
        
        db.session.commit()
        return genre
    
    @staticmethod
    def delete(genre_id):
        """Delete genre"""
        genre = Genre.query.get(genre_id)
        if genre:
            db.session.delete(genre)
            db.session.commit()
            return True
        return False

