from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from repositories.user_repository import UserRepository
from models import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """Register a new user"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    username = data['username']
    email = data['email']
    password = data['password']
    role = data.get('role', 'user')  # Default to 'user'
    
    # Check if username or email already exists
    if UserRepository.find_by_username(username):
        return jsonify({'error': 'Username already exists'}), 400
    
    if UserRepository.find_by_email(email):
        return jsonify({'error': 'Email already exists'}), 400
    
    # Create user
    user = UserRepository.create(username, email, password, role)
    
    # Create access token
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'User registered successfully',
        'access_token': access_token,
        'user': user.to_dict()
    }), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    """Login user"""
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Username and password required'}), 400
    
    username = data['username']
    password = data['password']
    
    # Authenticate user
    user = UserRepository.authenticate(username, password)
    
    if not user:
        return jsonify({'error': 'Invalid credentials'}), 401
    
    if not user.is_active:
        return jsonify({'error': 'Account is deactivated'}), 403
    
    # Create access token
    access_token = create_access_token(identity=str(user.id))
    
    return jsonify({
        'message': 'Login successful',
        'access_token': access_token,
        'user': user.to_dict()
    }), 200


@auth_bp.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user"""
    # In a full implementation, you might want to blacklist the token
    return jsonify({'message': 'Logout successful'}), 200


@auth_bp.route('/change-password', methods=['POST'])
@jwt_required()
def change_password():
    """Change user password"""
    data = request.get_json()
    
    if not data or not data.get('old_password') or not data.get('new_password'):
        return jsonify({'error': 'Old password and new password required'}), 400
    
    user_id = get_jwt_identity()
    user = UserRepository.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    if not user.check_password(data['old_password']):
        return jsonify({'error': 'Invalid old password'}), 400
    
    UserRepository.update_password(user_id, data['new_password'])
    
    return jsonify({'message': 'Password changed successfully'}), 200


@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_current_user():
    """Get current user information"""
    user_id = int(get_jwt_identity())
    user = UserRepository.find_by_id(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

