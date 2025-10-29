#!/usr/bin/env python3
"""Main entry point for the Audiotheca backend application"""

from app import create_app
import os

app = create_app(os.getenv('FLASK_ENV', 'default'))

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=8080)

