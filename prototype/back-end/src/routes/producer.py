from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from repositories.genre_repository import GenreRepository
from repositories.artist_repository import ArtistRepository
from repositories.musical_work_repository import MusicalWorkRepository
from repositories.user_repository import UserRepository
from models import Review

producer_bp = Blueprint('producer', __name__)

def require_producer():
    """Check if user is a producer or admin"""
    user_id = get_jwt_identity()
    user = UserRepository.find_by_id(user_id)
    if not user or user.role not in ['producer', 'admin']:
        return None
    return user


# ============ GENRE ROUTES ============

@producer_bp.route('/genres', methods=['GET'])
def get_genres():
    """Get all genres"""
    genres = GenreRepository.find_all()
    return jsonify([genre.to_dict() for genre in genres]), 200


@producer_bp.route('/genres/<int:genre_id>', methods=['GET'])
def get_genre(genre_id):
    """Get a specific genre"""
    genre = GenreRepository.find_by_id(genre_id)
    if not genre:
        return jsonify({'error': 'Genre not found'}), 404
    return jsonify(genre.to_dict()), 200


@producer_bp.route('/genres', methods=['POST'])
@jwt_required()
def create_genre():
    """Create a new genre (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    # Check if genre already exists
    if GenreRepository.find_by_name(data['name']):
        return jsonify({'error': 'Genre already exists'}), 400
    
    genre = GenreRepository.create(data['name'], data.get('description'))
    return jsonify(genre.to_dict()), 201


@producer_bp.route('/genres/<int:genre_id>', methods=['PUT'])
@jwt_required()
def update_genre(genre_id):
    """Update a genre (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    genre = GenreRepository.find_by_id(genre_id)
    if not genre:
        return jsonify({'error': 'Genre not found'}), 404
    
    data = request.get_json()
    updated_genre = GenreRepository.update(
        genre_id,
        name=data.get('name'),
        description=data.get('description')
    )
    
    return jsonify(updated_genre.to_dict()), 200


@producer_bp.route('/genres/<int:genre_id>', methods=['DELETE'])
@jwt_required()
def delete_genre(genre_id):
    """Delete a genre (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    if GenreRepository.delete(genre_id):
        return jsonify({'message': 'Genre deleted successfully'}), 200
    return jsonify({'error': 'Genre not found'}), 404


# ============ ARTIST ROUTES ============

@producer_bp.route('/artists', methods=['GET'])
def get_artists():
    """Get all artists"""
    artists = ArtistRepository.find_all()
    return jsonify([artist.to_dict() for artist in artists]), 200


@producer_bp.route('/artists/<int:artist_id>', methods=['GET'])
def get_artist(artist_id):
    """Get a specific artist"""
    artist = ArtistRepository.find_by_id(artist_id)
    if not artist:
        return jsonify({'error': 'Artist not found'}), 404
    return jsonify(artist.to_dict()), 200


@producer_bp.route('/artists', methods=['POST'])
@jwt_required()
def create_artist():
    """Create a new artist (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    data = request.get_json()
    if not data or not data.get('name'):
        return jsonify({'error': 'Name is required'}), 400
    
    artist = ArtistRepository.create(
        data['name'],
        data.get('biography'),
        data.get('multimedia')
    )
    return jsonify(artist.to_dict()), 201


@producer_bp.route('/artists/<int:artist_id>', methods=['PUT'])
@jwt_required()
def update_artist(artist_id):
    """Update an artist (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    artist = ArtistRepository.find_by_id(artist_id)
    if not artist:
        return jsonify({'error': 'Artist not found'}), 404
    
    data = request.get_json()
    updated_artist = ArtistRepository.update(
        artist_id,
        name=data.get('name'),
        biography=data.get('biography'),
        multimedia=data.get('multimedia')
    )
    
    return jsonify(updated_artist.to_dict()), 200


@producer_bp.route('/artists/<int:artist_id>', methods=['DELETE'])
@jwt_required()
def delete_artist(artist_id):
    """Delete an artist (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    if ArtistRepository.delete(artist_id):
        return jsonify({'message': 'Artist deleted successfully'}), 200
    return jsonify({'error': 'Artist not found'}), 404


# ============ MUSICAL WORK ROUTES ============

@producer_bp.route('/musical-works', methods=['GET'])
def get_musical_works():
    """Get all musical works"""
    works = MusicalWorkRepository.find_all()
    return jsonify([work.to_dict(include_artist=True, include_genre=True) for work in works]), 200


@producer_bp.route('/musical-works/<int:work_id>', methods=['GET'])
def get_musical_work(work_id):
    """Get a specific musical work"""
    work = MusicalWorkRepository.find_by_id(work_id)
    if not work:
        return jsonify({'error': 'Musical work not found'}), 404
    return jsonify(work.to_dict(include_artist=True, include_genre=True, include_reviews=True, approved_reviews_only=False)), 200


@producer_bp.route('/musical-works', methods=['POST'])
@jwt_required()
def create_musical_work():
    """Create a new musical work (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    data = request.get_json()
    if not data or not data.get('title') or not data.get('genre_id') or not data.get('artist_id'):
        return jsonify({'error': 'Title, genre_id, and artist_id are required'}), 400
    
    work = MusicalWorkRepository.create(
        data['title'],
        data['genre_id'],
        data['artist_id'],
        data.get('description')
    )
    return jsonify(work.to_dict(include_artist=True, include_genre=True)), 201


@producer_bp.route('/musical-works/<int:work_id>', methods=['PUT'])
@jwt_required()
def update_musical_work(work_id):
    """Update a musical work (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    work = MusicalWorkRepository.find_by_id(work_id)
    if not work:
        return jsonify({'error': 'Musical work not found'}), 404
    
    data = request.get_json()
    updated_work = MusicalWorkRepository.update(
        work_id,
        title=data.get('title'),
        genre_id=data.get('genre_id'),
        artist_id=data.get('artist_id'),
        description=data.get('description')
    )
    
    return jsonify(updated_work.to_dict(include_artist=True, include_genre=True)), 200


@producer_bp.route('/musical-works/<int:work_id>', methods=['DELETE'])
@jwt_required()
def delete_musical_work(work_id):
    """Delete a musical work (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    if MusicalWorkRepository.delete(work_id):
        return jsonify({'message': 'Musical work deleted successfully'}), 200
    return jsonify({'error': 'Musical work not found'}), 404


# ============ REVIEW APPROVAL ROUTES ============

@producer_bp.route('/reviews/pending', methods=['GET'])
@jwt_required()
def get_pending_reviews():
    """Get all pending reviews (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    from repositories.review_repository import ReviewRepository
    pending_reviews = Review.query.filter_by(is_approved=False).all()
    return jsonify([review.to_dict(include_user=True) for review in pending_reviews]), 200


@producer_bp.route('/reviews/<int:review_id>/approve', methods=['POST'])
@jwt_required()
def approve_review(review_id):
    """Approve a review (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    from repositories.review_repository import ReviewRepository
    review = ReviewRepository.approve(review_id)
    
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    
    return jsonify({
        'message': 'Review approved successfully',
        'review': review.to_dict(include_user=True)
    }), 200


@producer_bp.route('/reviews/<int:review_id>/reject', methods=['POST'])
@jwt_required()
def reject_review(review_id):
    """Reject a review (producer/admin only)"""
    if not require_producer():
        return jsonify({'error': 'Producer or admin access required'}), 403
    
    from repositories.review_repository import ReviewRepository
    
    if ReviewRepository.reject(review_id):
        return jsonify({'message': 'Review rejected and deleted successfully'}), 200
    return jsonify({'error': 'Review not found'}), 404

