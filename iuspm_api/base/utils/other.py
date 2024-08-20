from base.models import Speciality, Student, SchoolYear, UEProgramming, EC, Note
from base.utils.policy import get_grade
from base.utils.enums import Level, Semester


def get_student_speciality(student: Student, level: int | None = None):
    niv = student.current_level
    if level and level in [e.value for e in Level]:
        niv = level

    return Speciality.objects.get(sector=student.sector, level=niv)


def get_student_notes(
    student: Student,
    year_number: int,
    level: None | int = None,
    semester: None | int = None,
):
    # 1. Récupérer l'année scolaire en question
    school_year = SchoolYear.objects.get(number=year_number)

    # 2. Filtrer les UEs programmées pour l'année et pour la spécialité de l'étudiant
    niv = student.current_level
    if level and level in [e.value for e in Level]:
        niv = level

    if semester and semester in [e.value for e in Semester]:
        ues_programmed = UEProgramming.objects.filter(
            year=school_year,
            speciality__sector=student.sector,
            speciality__level=niv,
            semester=semester,
        )
    else:
        ues_programmed = UEProgramming.objects.filter(
            year=school_year,
            speciality__sector=student.sector,
            speciality__level=niv,
        )

    # 3. Filtrer les ECs associés aux UEs programmées
    ecs = EC.objects.filter(ue__in=ues_programmed.values_list("ue", flat=True))

    # 4. Récupérer les notes
    notes = Note.objects.filter(student=student, year=school_year, ec__in=ecs)

    # 5. Structurer les résultats
    can_grouping = True
    results = {}
    sum_credit = 0
    moyenne_t = 0
    cred_t = 0
    mgp_t = 0
    for ec in ecs:
        # Trouver le semestre associé à l'UE
        semester = ues_programmed.get(ue=ec.ue).semester

        ue = ec.ue.code
        if ue not in results:
            results[ue] = []

        # Ajouter la note au semestre correspondant
        sum_credit += ec.credit
        try:
            note = notes.get(ec=ec)
            result = {
                "ec_code": ec.code,
                "ec_label": ec.label,
                "note_20": note.value / 5,
                "note_100": note.value,
                "cred": ec.credit,
                "session": "N" if note.is_normal else "R",
                "dec": note.state,
                "grade": note.grade,
                "mgp": note.point,
                "trans": "N" if note.state != "E" else "O",
                "semester": semester,
                "cc": note.cc,
                "ef": note.ef,
            }
            moyenne_t += ec.credit * note.value
            cred_t += ec.credit if note.state != "E" else 0
            mgp_t += ec.credit * note.point
        except Exception:
            can_grouping = False
            result = {
                "ec_code": ec.code,
                "ec_label": ec.label,
                "note_20": "-",
                "note_100": "-",
                "trans": "-",
                "semester": semester,
                "cred": ec.credit,
                "session": "-",
                "dec": "-",
                "grade": "-",
                "mgp": "-",
                "cc": "-",
                "ef": "-",
            }

        if ec.code == ue:
            results[ue] = [result] + results[ue]
        else:
            results[ue].append(result)

    if can_grouping:
        moyenne_t = None if sum_credit == 0 else moyenne_t / sum_credit
        cred_t = None if sum_credit == 0 else cred_t / sum_credit

        mgp_t = None if sum_credit == 0 else mgp_t / sum_credit
        print("mgt ", mgp_t)
    else:
        moyenne_t = None
        cred_t = None
        mgp_t = None

    return {
        "ues": results,
        "can_group": can_grouping,
        "semester": (niv - 1) * 2 + semester if semester else None,
        "year": "{}".format(school_year),
        "level": niv,
        "credits": "-" if sum_credit == 0 else sum_credit,
        "credit_total": "-" if cred_t is None else cred_t,
        "moy_total_20": "-" if moyenne_t is None else moyenne_t / 5,
        "moy_total_100": "-" if moyenne_t is None else moyenne_t,
        "mgp": "-" if mgp_t is None else mgp_t,
        "grade": "-" if not moyenne_t else get_grade(moyenne_t / sum_credit),
    }