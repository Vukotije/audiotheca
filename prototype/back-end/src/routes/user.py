from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from repositories.review_repository import ReviewRepository
from repositories.musical_work_repository import MusicalWorkRepository
from repositories.user_repository import UserRepository

user_bp = Blueprint('user', __name__)

def require_authenticated():
    """Check if user is authenticated"""
    user_id = get_jwt_identity()
    user = UserRepository.find_by_id(user_id)
    if not user:
        return None
    return user


# ============ REVIEW ROUTES ============

@user_bp.route('/reviews', methods=['GET'])
@jwt_required()
def get_reviews():
    """Get all reviews for the authenticated user"""
    user = require_authenticated()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    reviews = ReviewRepository.find_by_user(user.id)
    return jsonify([review.to_dict(include_user=True) for review in reviews]), 200


@user_bp.route('/reviews', methods=['POST'])
@jwt_required()
def create_review():
    """Create a new review (authenticated users only)"""
    user = require_authenticated()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    data = request.get_json()
    if not data or not data.get('musical_work_id') or not data.get('rating'):
        return jsonify({'error': 'musical_work_id and rating are required'}), 400
    
    # Validate rating
    rating = data['rating']
    if not isinstance(rating, int) or rating < 1 or rating > 5:
        return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    
    musical_work_id = data['musical_work_id']
    
    # Check if work exists
    work = MusicalWorkRepository.find_by_id(musical_work_id)
    if not work:
        return jsonify({'error': 'Musical work not found'}), 404
    
    # Check if user already reviewed this work
    existing_review = ReviewRepository.find_user_review_for_work(user.id, musical_work_id)
    if existing_review:
        return jsonify({'error': 'You have already reviewed this work'}), 400
    
    review = ReviewRepository.create(
        user.id,
        musical_work_id,
        rating,
        data.get('comment')
    )
    
    return jsonify(review.to_dict(include_user=True)), 201


@user_bp.route('/reviews/<int:review_id>', methods=['GET'])
@jwt_required()
def get_review(review_id):
    """Get a specific review"""
    review = ReviewRepository.find_by_id(review_id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    
    user = require_authenticated()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    # Users can only view their own reviews
    if review.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    return jsonify(review.to_dict(include_user=True)), 200


@user_bp.route('/reviews/<int:review_id>', methods=['PUT'])
@jwt_required()
def update_review(review_id):
    """Update a review (only the owner)"""
    user = require_authenticated()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    review = ReviewRepository.find_by_id(review_id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    
    # Users can only update their own reviews
    if review.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    # Validate rating if provided
    if 'rating' in data:
        rating = data['rating']
        if not isinstance(rating, int) or rating < 1 or rating > 5:
            return jsonify({'error': 'Rating must be between 1 and 5'}), 400
    
    updated_review = ReviewRepository.update(
        review_id,
        rating=data.get('rating'),
        comment=data.get('comment')
    )
    
    return jsonify(updated_review.to_dict(include_user=True)), 200


@user_bp.route('/reviews/<int:review_id>', methods=['DELETE'])
@jwt_required()
def delete_review(review_id):
    """Delete a review (only the owner)"""
    user = require_authenticated()
    if not user:
        return jsonify({'error': 'Authentication required'}), 401
    
    review = ReviewRepository.find_by_id(review_id)
    if not review:
        return jsonify({'error': 'Review not found'}), 404
    
    # Users can only delete their own reviews
    if review.user_id != user.id:
        return jsonify({'error': 'Unauthorized'}), 403
    
    if ReviewRepository.delete(review_id):
        return jsonify({'message': 'Review deleted successfully'}), 200
    return jsonify({'error': 'Failed to delete review'}), 400


# ============ WORK DETAILS ROUTE ============

@user_bp.route('/musical-works/<int:work_id>/reviews', methods=['GET'])
def get_work_reviews(work_id):
    """Get all approved reviews for a musical work (public)"""
    reviews = ReviewRepository.find_by_musical_work(work_id, approved_only=True)
    return jsonify([review.to_dict(include_user=True) for review in reviews]), 200

