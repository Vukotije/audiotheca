# Routes module
from .auth import auth_bp
from .user import user_bp
from .producer import producer_bp
from .search import search_bp
from .admin import admin_bp

__all__ = ['auth_bp', 'user_bp', 'producer_bp', 'search_bp', 'admin_bp']

