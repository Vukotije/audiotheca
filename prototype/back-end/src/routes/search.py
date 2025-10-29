from flask import Blueprint, request, jsonify
from repositories.artist_repository import ArtistRepository
from repositories.musical_work_repository import MusicalWorkRepository

search_bp = Blueprint('search', __name__)


@search_bp.route('/search', methods=['GET'])
def search():
    """Search for artists and musical works"""
    query = request.args.get('q', '')
    search_type = request.args.get('type', 'all')  # 'all', 'artists', 'works'
    
    if not query:
        return jsonify({'error': 'Search query is required'}), 400
    
    results = {
        'artists': [],
        'musical_works': []
    }
    
    if search_type in ['all', 'artists']:
        artists = ArtistRepository.search_by_name(query)
        results['artists'] = [artist.to_dict() for artist in artists]
    
    if search_type in ['all', 'works']:
        works = MusicalWorkRepository.search_by_title(query)
        results['musical_works'] = [
            work.to_dict(include_artist=True, include_genre=True) 
            for work in works
        ]
    
    return jsonify(results), 200


@search_bp.route('/search/artists', methods=['GET'])
def search_artists():
    """Search for artists only"""
    query = request.args.get('q', '')
    
    if not query:
        return jsonify({'error': 'Search query is required'}), 400
    
    artists = ArtistRepository.search_by_name(query)
    return jsonify([artist.to_dict() for artist in artists]), 200


@search_bp.route('/search/musical-works', methods=['GET'])
def search_musical_works():
    """Search for musical works only"""
    query = request.args.get('q', '')
    
    if not query:
        return jsonify({'error': 'Search query is required'}), 400
    
    works = MusicalWorkRepository.search_by_title(query)
    return jsonify([
        work.to_dict(include_artist=True, include_genre=True) 
        for work in works
    ]), 200

