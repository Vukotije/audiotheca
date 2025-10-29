from models import db, User

class UserRepository:
    """Repository for user operations"""
    
    @staticmethod
    def create(username, email, password, role='user'):
        """Create a new user"""
        user = User(username=username, email=email, role=role)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user
    
    @staticmethod
    def find_by_id(user_id):
        """Find user by ID"""
        return User.query.get(user_id)
    
    @staticmethod
    def find_by_username(username):
        """Find user by username"""
        return User.query.filter_by(username=username).first()
    
    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        return User.query.filter_by(email=email).first()
    
    @staticmethod
    def authenticate(username, password):
        """Authenticate user"""
        user = User.query.filter_by(username=username).first()
        if user and user.check_password(password):
            return user
        return None
    
    @staticmethod
    def update_password(user_id, new_password):
        """Update user password"""
        user = User.query.get(user_id)
        if user:
            user.set_password(new_password)
            db.session.commit()
            return user
        return None
    
    @staticmethod
    def deactivate_user(user_id):
        """Deactivate a user"""
        user = User.query.get(user_id)
        if user:
            user.is_active = False
            db.session.commit()
            return user
        return None

