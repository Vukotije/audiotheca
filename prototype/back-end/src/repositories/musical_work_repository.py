from models import db, MusicalWork, Artist

class MusicalWorkRepository:
    """Repository for musical work operations"""
    
    @staticmethod
    def create(title, genre_id, artist_id, description=None):
        """Create a new musical work"""
        musical_work = MusicalWork(
            title=title,
            genre_id=genre_id,
            artist_id=artist_id,
            description=description
        )
        db.session.add(musical_work)
        db.session.commit()
        return musical_work
    
    @staticmethod
    def find_all():
        """Get all musical works"""
        return MusicalWork.query.all()
    
    @staticmethod
    def find_by_id(musical_work_id):
        """Find musical work by ID"""
        return MusicalWork.query.get(musical_work_id)
    
    @staticmethod
    def search_by_title(title_query):
        """Search musical works by title"""
        return MusicalWork.query.filter(MusicalWork.title.ilike(f'%{title_query}%')).all()
    
    @staticmethod
    def search_by_artist(artist_name):
        """Search musical works by artist name"""
        return MusicalWork.query.join(MusicalWork.artist).filter(
            db.func.lower(Artist.name).contains(artist_name.lower())
        ).all()
    
    @staticmethod
    def find_by_genre(genre_id):
        """Find musical works by genre"""
        return MusicalWork.query.filter_by(genre_id=genre_id).all()
    
    @staticmethod
    def find_by_artist(artist_id):
        """Find musical works by artist"""
        return MusicalWork.query.filter_by(artist_id=artist_id).all()
    
    @staticmethod
    def update(musical_work_id, title=None, genre_id=None, artist_id=None, description=None):
        """Update musical work"""
        musical_work = MusicalWork.query.get(musical_work_id)
        if not musical_work:
            return None
        
        if title is not None:
            musical_work.title = title
        if genre_id is not None:
            musical_work.genre_id = genre_id
        if artist_id is not None:
            musical_work.artist_id = artist_id
        if description is not None:
            musical_work.description = description
        
        db.session.commit()
        return musical_work
    
    @staticmethod
    def delete(musical_work_id):
        """Delete musical work"""
        musical_work = MusicalWork.query.get(musical_work_id)
        if musical_work:
            db.session.delete(musical_work)
            db.session.commit()
            return True
        return False

