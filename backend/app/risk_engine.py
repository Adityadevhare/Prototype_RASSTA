def calculate_risk_score(vehicle_count, accidents, congestion):
    """
    Calculate traffic risk score from 0 to 100.

    Factors:
    - Vehicle count: 30%
    - Accidents: 40%
    - Congestion: 30%
    """

    # Normalize vehicle count
    vehicle_score = min(vehicle_count / 1000, 1) * 100

    # Normalize accidents
    accident_score = min(accidents / 5, 1) * 100

    # Congestion is already on a 0-10 scale
    congestion_score = (congestion / 10) * 100

    # Weighted risk score
    risk_score = (
        vehicle_score * 0.30
        + accident_score * 0.40
        + congestion_score * 0.30
    )

    return round(risk_score, 2)


def get_risk_level(risk_score):
    """
    Convert numerical risk score into the RAASTA risk level.

    70+       -> CRITICAL
    55-69.99  -> HIGH
    40-54.99  -> MODERATE
    Below 40  -> NORMAL
    """

    if risk_score >= 70:
        return "CRITICAL"
    elif risk_score >= 55:
        return "HIGH"
    elif risk_score >= 40:
        return "MODERATE"
    else:
        return "NORMAL"


def get_deployment_recommendation(risk_score):
    """
    Recommend police deployment based on traffic risk score.
    """

    if risk_score >= 70:
        return {
            "priority": "CRITICAL",
            "police_units": 4,
            "recommendation": (
                "Deploy maximum police presence and prioritize "
                "traffic monitoring."
            ),
        }

    elif risk_score >= 55:
        return {
            "priority": "HIGH",
            "police_units": 2,
            "recommendation": (
                "Deploy additional police units and increase "
                "traffic monitoring."
            ),
        }

    elif risk_score >= 40:
        return {
            "priority": "MEDIUM",
            "police_units": 2,
            "recommendation": (
                "Maintain increased monitoring and deploy "
                "additional units during peak traffic periods."
            ),
        }

    else:
        return {
            "priority": "LOW",
            "police_units": 1,
            "recommendation": (
                "Maintain normal police presence and routine monitoring."
            ),
        }