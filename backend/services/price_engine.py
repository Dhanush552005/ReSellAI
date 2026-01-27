def calculate_resale_price(
    mrp: float,
    damage_class: str,
    cnn_confidence: float,
    ml_score: float
):
    base_factor = 0.8

    damage_weight = {
        "no_broken": 1.0,
        "light_broken": 0.85,
        "moderately_broken": 0.65,
        "severe_broken": 0.45
    }.get(damage_class, 0.4)

   
    confidence_factor = 0.5 + (0.5* cnn_confidence)
    
    ml_factor = 0.7 + (0.3 * ml_score)

    resale_price = (
        mrp
        * base_factor
        * damage_weight
        * confidence_factor
        * ml_factor
    )

    return round(resale_price, 2)
