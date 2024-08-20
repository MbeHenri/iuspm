from enum import Enum


Levels = [
    (1, "Niveau 1"),
    (2, "Niveau 2"),
    (3, "Niveau 3"),
    (4, "Niveau 4"),
    (5, "Niveau 5"),
    (6, "Niveau 6"),
    (7, "Niveau 7"),
]

Semesters = [
    (1, "Semestre 1"),
    (2, "Semestre 2"),
]


class Level(Enum):
    NIV_1 = 1
    NIV_2 = 2
    NIV_3 = 3
    NIV_4 = 4
    NIV_5 = 5
    NIV_6 = 6
    NIV_7 = 7
    
class Semester(Enum):
    S_1 = 1
    S_2 = 2
