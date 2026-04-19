from ..models.payment import Payment


def create_payment(db, payment):
    db.add(payment)
    db.commit()
    db.refresh(payment)
    return payment