def get_grade(value: float):
    if value < 35:
        return "E"
    elif value < 40:
        return "D"
    elif value < 45:
        return "D+"
    elif value < 50:
        return "C-"
    elif value < 55:
        return "C"
    elif value < 60:
        return "C+"
    elif value < 65:
        return "B-"
    elif value < 70:
        return "B"
    elif value < 75:
        return "B+"
    elif value < 80:
        return "A-"
    else:
        return "A"


def get_state(value: float):
    if value <= 37.5:
        return "E"  # Echec
    elif value < 50:
        return "CANT"  # capitalisé non transférable
    else:
        return "CA"  # capitalisé


def get_point(value: float):
    if value < 35:
        return 0
    elif value < 40:
        return 1
    elif value < 45:
        return 1.3
    elif value < 50:
        return 1.7
    elif value < 55:
        return 2
    elif value < 60:
        return 2.3
    elif value < 65:
        return 2.7
    elif value < 70:
        return 3
    elif value < 75:
        return 3.3
    elif value < 80:
        return 3.7
    else:
        return 4


def get_cycle(level: int):
    if level >= 1 and level <= 3:
        return "Licence"
    elif level >= 4 and level <= 5:
        return "Master"
    elif level > 5:
        return "Doctorat"
    return "Inconnu"
