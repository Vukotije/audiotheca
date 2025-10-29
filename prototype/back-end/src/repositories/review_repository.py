from models import db, Review

class ReviewRepository:
    """Repository for review operations"""
    
    @staticmethod
    def create(user_id, musical_work_id, rating, comment=None):
        """Create a new review"""
        review = Review(
            user_id=user_id,
            musical_work_id=musical_work_id,
            rating=rating,
            comment=comment
        )
        db.session.add(review)
        db.session.commit()
        return review
    
    @staticmethod
    def find_all(approved_only=False):
        """Get all reviews, optionally filter by approval status"""
        query = Review.query
        if approved_only:
            query = query.filter_by(is_approved=True)
        return query.all()
    
    @staticmethod
    def find_by_id(review_id):
        """Find review by ID"""
        return Review.query.get(review_id)
    
    @staticmethod
    def find_by_user(user_id):
        """Find reviews by user (all reviews for the user)"""
        return Review.query.filter_by(user_id=user_id).all()
    
    @staticmethod
    def find_by_musical_work(musical_work_id, approved_only=False):
        """Find reviews for a musical work, optionally filter by approval status"""
        query = Review.query.filter_by(musical_work_id=musical_work_id)
        if approved_only:
            query = query.filter_by(is_approved=True)
        return query.all()
    
    @staticmethod
    def find_user_review_for_work(user_id, musical_work_id):
        """Find a specific user's review for a work"""
        return Review.query.filter_by(
            user_id=user_id,
            musical_work_id=musical_work_id
        ).first()
    
    @staticmethod
    def update(review_id, rating=None, comment=None):
        """Update review"""
        review = Review.query.get(review_id)
        if not review:
            return None
        
        if rating is not None:
            review.rating = rating
        if comment is not None:
            review.comment = comment
        
        db.session.commit()
        return review
    
    @staticmethod
    def approve(review_id):
        """Approve a review"""
        review = Review.query.get(review_id)
        if not review:
            return None
        review.is_approved = True
        db.session.commit()
        return review
    
    @staticmethod
    def reject(review_id):
        """Reject a review (delete it)"""
        review = Review.query.get(review_id)
        if not review:
            return None
        db.session.delete(review)
        db.session.commit()
        return True
    
    @staticmethod
    def delete(review_id):
        """Delete review"""
        review = Review.query.get(review_id)
        if review:
            db.session.delete(review)
            db.session.commit()
            return True
        return False

