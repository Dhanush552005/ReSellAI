from ..models.phone import Phone


def get_all_phones(db):
    return db.query(Phone).all()


def get_phone_by_id(db, phone_id):
    return db.query(Phone).filter(
        Phone.id == phone_id
    ).first()


def get_user_phones(db, user_id):
    return db.query(Phone).filter(
        Phone.seller_id == user_id
    ).all()


def save_phone(db, phone):
    db.add(phone)
    db.commit()
    db.refresh(phone)
    return phone


def update_phone(db):
    db.commit()

def create_phone(db, phone):
    db.add(phone)
    db.commit()
    db.refresh(phone)
    return phone