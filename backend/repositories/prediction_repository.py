from ..models.prediction import Prediction


def create_prediction(db, prediction):
    db.add(prediction)
    db.commit()
    db.refresh(prediction)
    return prediction