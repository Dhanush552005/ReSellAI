from ..models.user import User


def get_user_by_email(db, email):
    return db.query(User).filter(
        User.email == email
    ).first()


def get_user_by_username(db, username):
    return db.query(User).filter(
        User.username == username
    ).first()


def get_user_by_id(db, user_id):
    return db.query(User).filter(
        User.id == user_id
    ).first()


def create_user(db, user):
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

def update_user(db):
    db.commit()

def save_user(db):
    db.commit()