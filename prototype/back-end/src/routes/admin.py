from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from repositories.user_repository import UserRepository

admin_bp = Blueprint('admin', __name__)

def require_admin():
    """Check if user is an admin"""
    user_id = get_jwt_identity()
    user = UserRepository.find_by_id(user_id)
    if not user or user.role != 'admin':
        return None
    return user


@admin_bp.route('/users', methods=['GET'])
@jwt_required()
def get_all_users():
    """Get all users (admin only)"""
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    from models import User
    users = User.query.all()
    return jsonify([user.to_dict() for user in users]), 200


@admin_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """Get a specific user (admin only)"""
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    user = UserRepository.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200


@admin_bp.route('/users/<int:user_id>/ban', methods=['POST'])
@jwt_required()
def ban_user(user_id):
    """Ban a user (admin only)"""
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    user = UserRepository.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Cannot ban yourself
    current_user_id = get_jwt_identity()
    if user_id == current_user_id:
        return jsonify({'error': 'Cannot ban yourself'}), 400
    
    # Cannot ban other admins
    if user.role == 'admin':
        return jsonify({'error': 'Cannot ban another admin'}), 400
    
    # Ban the user (set is_active to False)
    user.is_active = False
    from app import db
    db.session.commit()
    
    return jsonify({
        'message': 'User banned successfully',
        'user': user.to_dict()
    }), 200


@admin_bp.route('/users/<int:user_id>/unban', methods=['POST'])
@jwt_required()
def unban_user(user_id):
    """Unban a user (admin only)"""
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    user = UserRepository.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Unban the user (set is_active to True)
    user.is_active = True
    from app import db
    db.session.commit()
    
    return jsonify({
        'message': 'User unbanned successfully',
        'user': user.to_dict()
    }), 200


@admin_bp.route('/users/<int:user_id>/role', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    """Update user role (admin only)"""
    if not require_admin():
        return jsonify({'error': 'Admin access required'}), 403
    
    user = UserRepository.find_by_id(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    # Cannot change your own role
    current_user_id = get_jwt_identity()
    if user_id == current_user_id:
        return jsonify({'error': 'Cannot change your own role'}), 400
    
    data = request.get_json()
    new_role = data.get('role')
    
    if not new_role:
        return jsonify({'error': 'Role is required'}), 400
    
    # Validate role
    valid_roles = ['user', 'producer', 'admin']
    if new_role not in valid_roles:
        return jsonify({'error': f'Invalid role. Must be one of: {", ".join(valid_roles)}'}), 400
    
    # Update role
    user.role = new_role
    from app import db
    db.session.commit()
    
    return jsonify({
        'message': 'User role updated successfully',
        'user': user.to_dict()
    }), 200

