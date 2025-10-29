from models import db, Artist

class ArtistRepository:
    """Repository for artist operations"""
    
    @staticmethod
    def create(name, biography=None, multimedia=None):
        """Create a new artist"""
        artist = Artist(name=name, biography=biography, multimedia=multimedia)
        db.session.add(artist)
        db.session.commit()
        return artist
    
    @staticmethod
    def find_all():
        """Get all artists"""
        return Artist.query.all()
    
    @staticmethod
    def find_by_id(artist_id):
        """Find artist by ID"""
        return Artist.query.get(artist_id)
    
    @staticmethod
    def search_by_name(name_query):
        """Search artists by name"""
        return Artist.query.filter(Artist.name.ilike(f'%{name_query}%')).all()
    
    @staticmethod
    def update(artist_id, name=None, biography=None, multimedia=None):
        """Update artist"""
        artist = Artist.query.get(artist_id)
        if not artist:
            return None
        
        if name is not None:
            artist.name = name
        if biography is not None:
            artist.biography = biography
        if multimedia is not None:
            artist.multimedia = multimedia
        
        db.session.commit()
        return artist
    
    @staticmethod
    def delete(artist_id):
        """Delete artist"""
        artist = Artist.query.get(artist_id)
        if artist:
            db.session.delete(artist)
            db.session.commit()
            return True
        return False

