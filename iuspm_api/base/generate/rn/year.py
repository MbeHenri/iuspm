from reportlab.lib.pagesizes import A4
from reportlab.lib import colors, units, enums  # , pdfencrypt
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
    Image,
)

# enc = pdfencrypt.StandardEncryption("rptlab", canModify=0)

from base.models import Student
from base.utils.other import get_student_speciality


def RN(student: Student, notesData: dict, output):
    # Créer le PDF
    doc = SimpleDocTemplate(
        output,
        pagesize=A4,
        leftMargin=units.inch / 2,
        rightMargin=units.inch / 2,
        topMargin=units.inch / 2,
        bottomMargin=units.inch / 2,
        title="RN_{}_niv{}_{}".format(
            student.register_number, notesData["level"], notesData["year"]
        ),
        author="MBE-IUSPM",
        # encrypt=enc,
    )
    elements = []

    # Styles
    styles = getSampleStyleSheet()

    # En-tête du document

    HeaderTableData = [
        [
            Paragraph(
                "REPUBLIQUE DU CAMEROUN",
                ParagraphStyle(
                    name="",
                    alignment=enums.TA_CENTER,
                    fontSize=6,
                ),
            ),
            "",
            Paragraph(
                "REPUBLIC OF CAMEROON",
                ParagraphStyle(
                    name="",
                    alignment=enums.TA_CENTER,
                    fontSize=6,
                ),
            ),
        ],
        [
            Paragraph(
                "MINISTERE DE L'ENSEIGNEMENT SUPERIEUR",
                ParagraphStyle(
                    name="",
                    alignment=enums.TA_CENTER,
                    fontSize=6,
                ),
            ),
            "",
            Paragraph(
                "MINISTRY OF HIGHER EDUCATION",
                ParagraphStyle(
                    name="",
                    alignment=enums.TA_CENTER,
                    fontSize=6,
                ),
            ),
        ],
        [
            Paragraph(
                "UNIVERSITE UNIVERSITAIRE DES SCIENCES PETROLIERS ET DE MANAGEMENT",
                ParagraphStyle(
                    name="",
                    parent=styles["h5"],
                    alignment=enums.TA_CENTER,
                    fontSize=8,
                ),
            ),
            "",
            Paragraph(
                "UNIVERSITE DE DOUALA TUTELLE ACADEMIQUE",
                ParagraphStyle(
                    name="",
                    parent=styles["h5"],
                    alignment=enums.TA_CENTER,
                    fontSize=8,
                ),
            ),
        ],
        [
            Image("static/assets/images/iuspm.png", 70, 70),
            "",
            Image("static/assets/images/douala.png", 70, 70),
        ],
    ]

    headerTable = Table(HeaderTableData)
    headerTable.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        ),
    )
    elements.append(headerTable)

    header = [
        Paragraph(
            "ECOLE INTERNATIONALE D'INGENIEURIE PETROLIERE",
            ParagraphStyle(
                name="",
                parent=styles["h5"],
                alignment=enums.TA_CENTER,
            ),
        ),
        Paragraph(
            "BP: 11 428 Yaoundé - Cameroun, Email: eispip.univ@yahoo.fr",
            ParagraphStyle(
                name="",
                alignment=enums.TA_CENTER,
                fontSize=6,
            ),
        ),
        Paragraph("RELEVE DE NOTES / TRANSCRIPT", styles["Title"]),
        Paragraph(
            "NIVEAU {}".format(notesData["level"]),
            ParagraphStyle(
                name="",
                parent=styles["h2"],
                alignment=enums.TA_CENTER,
            ),
        ),
        Paragraph(
            "ANEEE ACADEMIQUE {}".format(notesData["year"]),
            ParagraphStyle(
                name="",
                alignment=enums.TA_CENTER,
            ),
        ),
    ]
    elements.extend(header)
    elements.append(Spacer(1, 12))

    # Informations de l'étudiant
    studentInfoTableData = [
        [
            Paragraph("NOM ET PRENOM / Name & Surname :"),
            Paragraph("MATRICULE :"),
            Paragraph("NE LE :"),
            Paragraph("A :"),
        ],
        [
            Paragraph(
                student.name.upper(),
                ParagraphStyle(name="", parent=styles["h5"]),
            ),
            Paragraph(
                student.register_number,
                ParagraphStyle(name="", parent=styles["h5"]),
            ),
            Paragraph(
                student.birth_at.strftime("%d/%m/%Y"),
                ParagraphStyle(name="", parent=styles["h5"]),
            ),
            Paragraph(
                student.birth_place,
                ParagraphStyle(name="", parent=styles["h5"]),
            ),
        ],
    ]
    studentInfoTable = Table(
        studentInfoTableData,
        colWidths=[8 * units.cm, 3 * units.cm, 4 * units.cm, 3 * units.cm],
    )
    elements.append(studentInfoTable)

    speciality = get_student_speciality(student)
    studentInfoParTableData = [
        [
            Paragraph("SPECIALITE : {}".format(speciality.label)),
            Paragraph("PARCOURS : {}".format(student.sector.label)),
            Paragraph("CYCLE : {}".format(student.cycle)),
        ],
        [
            Paragraph("Speciality"),
            Paragraph("Course"),
        ],
    ]
    studentInfoParTable = Table(
        studentInfoParTableData, colWidths=[8 * units.cm, 7 * units.cm, 3 * units.cm]
    )
    elements.append(studentInfoParTable)

    elements.append(Spacer(1, 12))

    # Tableau des notes
    data = [
        [
            Paragraph("Code UE"),
            Paragraph("Code EC"),
            Paragraph("Intitulé de l'UE ou de l'EC"),
            Paragraph("NOTE/20"),
            Paragraph("NOTE/100"),
            Paragraph("GRA"),
            Paragraph("CRED"),
            Paragraph("DEC"),
            Paragraph("TRA"),
            Paragraph("SES"),
        ],
    ]

    stylesTable = [
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        # block global
        ("BOX", (0, 0), (-1, -1), 1, colors.black),
        # ligne de l'entete
        ("LINEABOVE", (0, 1), (-1, 1), 1, colors.black),
        # lignes des colonnes
        ("LINEBEFORE", (0, 0), (-1, -1), 1, colors.black),
        # lignes des metriques
        ("LINEABOVE", (3, 2), (-1, -1), 1, colors.black),
        # footer
        ("BACKGROUND", (0, -1), (-1, -1), colors.black),
        ("SPAN", (0, -1), (5, -1)),
    ]
    current_l = 0

    for ue, ecs in notesData["ues"].items():
        current_l += 1
        data.append(
            [
                Paragraph(ue),
                Paragraph(">>>>>>"),
                Paragraph(ecs[0]["ec_label"]),
                Paragraph("{}".format(ecs[0]["note_20"])),
                Paragraph("{}".format(ecs[0]["note_100"])),
                Paragraph("{}".format(ecs[0]["grade"])),
                Paragraph("{}".format(ecs[0]["cred"])),
                Paragraph(ecs[0]["dec"]),
                Paragraph("{}".format(ecs[0]["trans"])),
                Paragraph("{}".format(ecs[0]["session"])),
            ],
        )
        try:
            i = 1
            while True:
                data.append(
                    [
                        Paragraph(""),
                        Paragraph(ecs[i]["ec_code"]),
                        Paragraph(ecs[i]["ec_label"]),
                        Paragraph("{}".format(ecs[i]["note_20"])),
                        Paragraph("{}".format(ecs[i]["note_100"])),
                        Paragraph("{}".format(ecs[i]["grade"])),
                        Paragraph("{}".format(ecs[i]["cred"])),
                        Paragraph(ecs[i]["dec"]),
                        Paragraph("{}".format(ecs[i]["trans"])),
                        Paragraph("{}".format(ecs[i]["session"])),
                    ],
                )
                current_l += 1
                i += 1
        except Exception:
            pass

        stylesTable.append(
            ("LINEABOVE", (0, current_l), (3, current_l), 1, colors.black),
        )

    data.append(
        [
            Paragraph(
                "Credit",
                ParagraphStyle(name="", textColor="white"),
            ),
            Paragraph(""),
            Paragraph(""),
            Paragraph(""),
            Paragraph(""),
            Paragraph(""),
            Paragraph(
                "{}/{}".format(notesData["credit_total"], notesData["credits"]),
                ParagraphStyle(name="", textColor="white"),
            ),
            Paragraph(""),
            Paragraph(""),
            Paragraph(""),
        ],
    )

    # Style du tableau
    table = Table(
        data,
        colWidths=[
            1.9 * units.cm,
            1.95 * units.cm,
            6 * units.cm,
            1.6 * units.cm,
            1.6 * units.cm,
            1.2 * units.cm,
            1.5 * units.cm,
            1.2 * units.cm,
            1.2 * units.cm,
            1.2 * units.cm,
        ],
    )

    # ( id colonne, numero ligne)
    table.setStyle(TableStyle(stylesTable))
    elements.append(table)
    elements.append(Spacer(1, 12))

    # Informations sur les crédits et la moyenne
    summaryData = [
        [
            Paragraph("RESULTATS EXPRIMES"),
            "",
            "",
            Paragraph("MGP"),
            Paragraph("GRADE"),
        ],
        [
            Paragraph("Total"),
            Paragraph("{} /20".format(notesData["moy_total_20"])),
            Paragraph("{} /100".format(notesData["moy_total_100"])),
            Paragraph("{}".format(notesData["mgp"])),
            Paragraph("{}".format(notesData["grade"])),
        ],
    ]
    summary = Table(summaryData)
    summary.setStyle(
        TableStyle(
            [
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
                ("SPAN", (0, 0), (2, 0)),
            ]
        )
    )
    elements.append(summary)

    space_h = 250 - current_l * 10
    space_h = 0 if space_h < 0 else space_h
    print(space_h)
    elements.append(Spacer(1, space_h))

    # footer
    footerData = [
        [
            Paragraph(
                "Le president du jury",
                ParagraphStyle(
                    name="",
                    alignment=enums.TA_CENTER,
                ),
            ),
            "",
            Paragraph(
                "Le Directeur",
                ParagraphStyle(
                    name="",
                    alignment=enums.TA_CENTER,
                ),
            ),
        ],
        [
            Paragraph(
                "The jury President",
                ParagraphStyle(
                    name="",
                    alignment=enums.TA_CENTER,
                ),
            ),
            "",
            Paragraph(
                "The Director",
                ParagraphStyle(
                    name="",
                    alignment=enums.TA_CENTER,
                ),
            ),
        ],
        [
            Spacer(1, 40),
            "Yaounde le _______________",
            Spacer(1, 40),
        ],
    ]
    footer = Table(footerData)
    footer.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        ),
    )
    elements.append(footer)

    # Générer le PDF
    doc.build(elements)
