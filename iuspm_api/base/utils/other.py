from base.models import Speciality, Student, SchoolYear, UEProgramming, EC, Note
from base.utils.policy import get_grade
from base.utils.enums import Level, Semester


def get_student_speciality(student: Student, level: int | None = None):
    niv = student.current_level
    if level and level in [e.value for e in Level]:
        niv = level

    return Speciality.objects.get(sector=student.sector, level=niv)


def truncate(number):
    return int(number * 100) / 100.0


def get_student_base_notes(
    student: Student,
    year_number: int | None = None,
    level: None | int = None,
    semester: None | int = None,
):
    # 1. Récupérer l'année scolaire en question
    if year_number is not None:
        school_year = SchoolYear.objects.get(number=year_number)
    else:
        school_year = SchoolYear.objects.order_by("-number").first()

    # 2. Filtrer les UEs programmées pour l'année et pour la spécialité de l'étudiant
    niv = student.current_level
    if level and level in [e.value for e in Level]:
        niv = level
    
    # 1 pour semestre 1 et 2 pour semestre 2
    if semester:
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
    notes = Note.objects.filter(student=student, ec__in=ecs)
    return school_year, niv, ues_programmed, ecs, notes


def get_student_notes(
    student: Student,
    year_number: int,
    level: None | int = None,
    semester: None | int = None,
):
    # 1. recupération des notes
    school_year, niv, ues_programmed, ecs, notes = get_student_base_notes(
        student, year_number, level, semester
    )

    # 2. Structurer les résultats
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
                "note_20": truncate(note.value / 5),
                "note_100": truncate(note.value),
                "cred": ec.credit,
                "session": "N" if note.is_normal else "R",
                "dec": note.state,
                "grade": note.grade,
                "mgp": note.point,
                "trans": "O" if note.state != "E" else "N",
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
    else:
        moyenne_t = None
        cred_t = None
        mgp_t = None

    return {
        "ues": results,
        "can_group": can_grouping,
        "s":semester,
        "semester": (niv - 1) * 2 + semester if semester else None,
        "year": "{}".format(school_year),
        "level": niv,
        "credits": "-" if sum_credit == 0 else sum_credit,
        "credit_total": "-" if cred_t is None else cred_t,
        "moy_total_20": "-" if moyenne_t is None else truncate(moyenne_t / 5),
        "moy_total_100": "-" if moyenne_t is None else truncate(moyenne_t),
        "mgp": "-" if mgp_t is None else truncate(mgp_t),
        "grade": "-" if not moyenne_t else get_grade(moyenne_t),
    }



def get_student_notes_s2(
    student: Student,
    year_number: int,
    level: None | int = None,
):
    # 1. recupération des notes
    school_year, niv, ues_programmed, ecs, notes = get_student_base_notes(
        student, year_number, level
    )

    # 2. Structurer les résultats
    can_grouping_s2 = True
    can_grouping_s1 = True
    results = {}
    
    ## généralité des notes du semestre 2
    sum_credit_s2 = 0
    moyenne_t_s2 = 0
    cred_t_s2 = 0
    mgp_t_s2 = 0
    
    ## généralité des notes du semestre 1
    sum_credit_s1 = 0
    moyenne_t_s1 = 0
    cred_t_s1 = 0
    mgp_t_s1 = 0
    
    for ec in ecs:
        # Trouver le semestre associé à l'UE
        semester = ues_programmed.get(ue=ec.ue).semester

        ue = ec.ue.code
        if ue not in results:
            results[ue] = []

        # Ajouter la note au semestre correspondant
        if semester == 1:
            sum_credit_s1 += ec.credit
            try:
                note = notes.get(ec=ec)
                moyenne_t_s1 += ec.credit * note.value
                cred_t_s1 += ec.credit if note.state != "E" else 0
                mgp_t_s1 += ec.credit * note.point
            except Exception:
                can_grouping_s1 = False
        else:
            sum_credit_s2 += ec.credit
            
            try:
                note = notes.get(ec=ec)
                result = {
                    "ec_code": ec.code,
                    "ec_label": ec.label,
                    "note_20": truncate(note.value / 5),
                    "note_100": truncate(note.value),
                    "cred": ec.credit,
                    "session": "N" if note.is_normal else "R",
                    "dec": note.state,
                    "grade": note.grade,
                    "mgp": note.point,
                    "trans": "O" if note.state != "E" else "N",
                    "semester": semester,
                    "cc": note.cc,
                    "ef": note.ef,
                }
                moyenne_t_s2 += ec.credit * note.value
                cred_t_s2 += ec.credit if note.state != "E" else 0
                mgp_t_s2 += ec.credit * note.point
            except Exception:
                can_grouping_s2 = False
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
                
    if can_grouping_s1:
        moyenne_t_s1 = None if sum_credit_s1 == 0 else moyenne_t_s1 / sum_credit_s1
        cred_t_s1 = None if sum_credit_s1 == 0 else cred_t_s1 / sum_credit_s1
        mgp_t_s1 = None if sum_credit_s1 == 0 else mgp_t_s1 / sum_credit_s1
    else:
        moyenne_t_s1 = None
        cred_t_s1 = None
        mgp_t_s1 = None
        
    if can_grouping_s2:
        moyenne_t_s2 = None if sum_credit_s2 == 0 else moyenne_t_s2 / sum_credit_s2
        cred_t_s2 = None if sum_credit_s2 == 0 else cred_t_s2 / sum_credit_s2
        mgp_t_s2 = None if sum_credit_s2 == 0 else mgp_t_s2 / sum_credit_s2
    else:
        moyenne_t_s2 = None
        cred_t_s2 = None
        mgp_t_s2 = None
    
    ## généralité des notes du semestre 1 et du semestre 2
    moyenne_t_all = None
    cred_t_all = None
    mgp_t_all = None
    
    if can_grouping_s1 and can_grouping_s2:
        sum_credit_all = sum_credit_s1 + sum_credit_s2
        try:
            moyenne_t_all = None if sum_credit_all == 0 else ( moyenne_t_s1*sum_credit_s1+ moyenne_t_s2*sum_credit_s2) / sum_credit_all
            cred_t_all = None if sum_credit_all == 0  else (cred_t_s1*sum_credit_s1 + cred_t_s2*sum_credit_s2) / sum_credit_all
            mgp_t_all = None if sum_credit_all == 0 else (mgp_t_s1*sum_credit_s1 + mgp_t_s2*sum_credit_s2) / sum_credit_all 
        except Exception as e:
            moyenne_t_all = None
            cred_t_all = None
            mgp_t_all = None
    
    semester1 = (niv - 1) * 2 + 1 # 1 pour semestre 1
    semester2 = (niv - 1) * 2 + 2 # 2 pour semestre 2
    return {
        "ues": results,
        "can_group": can_grouping_s2,
        "year": "{}".format(school_year),
        "level": niv,
        "s": 2,
        
        "semester": semester2,
        "semester_s2": f"semestre {semester2}",
        "credits": "-" if sum_credit_s2 == 0 else sum_credit_s2,
        "credit_total": "-" if cred_t_s2 is None else cred_t_s2,
        "moy_total_20": "-" if moyenne_t_s2 is None else truncate(moyenne_t_s2 / 5),
        "moy_total_100": "-" if moyenne_t_s2 is None else truncate(moyenne_t_s2),
        "mgp": "-" if mgp_t_s2 is None else truncate(mgp_t_s2),
        "grade": "-" if not moyenne_t_s2 else get_grade(moyenne_t_s2),
        
        "semester_s1": f"semestre {semester1}",
        "credit_total_s1": "-" if cred_t_s1 is None else cred_t_s1,
        "moy_total_20_s1": "-" if moyenne_t_s1 is None else truncate(moyenne_t_s1 / 5),
        "moy_total_100_s1": "-" if moyenne_t_s1 is None else truncate(moyenne_t_s1),
        "mgp_s1": "-" if mgp_t_s1 is None else truncate(mgp_t_s1),
        "grade_s1": "-" if not moyenne_t_s1 else get_grade(moyenne_t_s1),
        
        "semester_all": f"semestre {semester1} & {semester2}",
        "credit_total_all": "-" if cred_t_all is None else cred_t_all,
        "moy_total_20_all": "-" if moyenne_t_all is None else truncate(moyenne_t_all / 5),
        "moy_total_100_all": "-" if moyenne_t_all is None else truncate(moyenne_t_all),
        "mgp_all": "-" if mgp_t_all is None else truncate(mgp_t_all),
        "grade_all": "-" if not moyenne_t_all else get_grade(moyenne_t_all),
    }



def get_student_notes_2(
    student: Student,
    level: None | int = None,
    semester: None | int = None,
):
    # 1. recupération des notes
    _, _, ues_programmed, ecs, notes = get_student_base_notes(
        student, None, level, semester
    )

    # 2. Structurer les résultats
    results = []
    for ec in ecs:
        # Trouver le semestre associé à l'UE
        semester = ues_programmed.get(ue=ec.ue).semester

        # Ajouter la note avec le semestre correspondant
        ue = ec.ue
        try:
            note = notes.get(ec=ec)
            result = {
                "id": note.id,
                "cc": note.cc,
                "ef": note.ef,
                "updated_at": note.updated_at,
                "is_normal": note.is_normal,
                "ec": {
                    "id": ec.id,
                    "code": ec.code,
                    "label": ec.label,
                    "ue": {"code": ue.code, "label": ue.label},
                },
                "semester": semester,
            }
        except Exception:
            result = {
                "id": None,
                "cc": None,
                "ef": None,
                "updated_at": None,
                "is_normal": None,
                "ec": {
                    "id": ec.id,
                    "code": ec.code,
                    "label": ec.label,
                    "ue": {"code": ue.code, "label": ue.label},
                },
                "semester": semester,
            }

        results.append(result)

    return results
