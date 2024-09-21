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
        title="RN_{}_s{}_{} ".format(
            student.register_number, notesData["semester"], notesData["year"]
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
            "SEMESTRE {}".format(notesData["semester"]),
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
    styleinfos = ParagraphStyle(
        name="",
        fontSize=8,
    )

    studentInfoTableData = [
        [
            Paragraph("NOM ET PRENOM / Name & Surname :", styleinfos),
            Paragraph("MATRICULE :", styleinfos),
            Paragraph("NE LE :", styleinfos),
            Paragraph("A :", styleinfos),
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
            Paragraph("SPECIALITE : {}".format(speciality.label), styleinfos),
            Paragraph("PARCOURS : {}".format(student.sector.label), styleinfos),
            Paragraph("CYCLE : {}".format(student.cycle), styleinfos),
        ],
        [
            Paragraph("Speciality", styleinfos),
            Paragraph("Course", styleinfos),
        ],
    ]
    studentInfoParTable = Table(
        studentInfoParTableData, colWidths=[8 * units.cm, 7 * units.cm, 3 * units.cm]
    )
    studentInfoParTable.setStyle(
        TableStyle(
            [
                ("TOPPADDING", (0, -1), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        )
    )
    elements.append(studentInfoParTable)

    # space
    elements.append(Spacer(1, 12))

    # Tableau des notes
    data = [
        [
            Paragraph("CODE UE"),
            Paragraph("ELEMENTS CONSTITUTIFS"),
            "",
            "",
            "",
            "",
            "",
            "",
            Paragraph("APPRECIATION"),
            "",
        ],
        [
            "",
            Paragraph("CODE"),
            Paragraph("INTITULE"),
            Paragraph("Crédit"),
            Paragraph("CC"),
            Paragraph("EF"),
            Paragraph("TOTAL"),
            Paragraph("TOTAL"),
            "",
            "",
        ],
        [
            "",
            "",
            "",
            "",
            Paragraph("Sur 20"),
            Paragraph("Sur 20"),
            Paragraph(
                "30% CC 70% EF",
                ParagraphStyle(
                    name="",
                    alignment=enums.TA_CENTER,
                    fontSize=6,
                ),
            ),
            Paragraph(
                "Sur 100",
                ParagraphStyle(
                    name="",
                    fontSize=8,
                ),
            ),
            Paragraph("COTE"),
            Paragraph("POINT"),
        ],
    ]

    stylesTable = [
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        # block global
        ("BOX", (0, 0), (-1, -1), 1, colors.black),
        # ligne de l'entete
        ("LINEABOVE", (0, 1), (-1, 1), 1, colors.black),
        ("SPAN", (0, 0), (0, 2)),
        ("SPAN", (1, 0), (7, 0)),
        ("SPAN", (8, 0), (9, 1)),
        ("SPAN", (1, 1), (1, 2)),
        ("SPAN", (2, 1), (2, 2)),
        ("SPAN", (3, 1), (3, 2)),
        ("LINEABOVE", (0, 0), (-1, 2), 1, colors.black),
        ("LINEBEFORE", (0, 0), (-1, 2), 1, colors.black),
        # ("LINEBEFORE", (0, 0), (0, 2), 1, colors.black),
        # lignes des colonnes
        ("LINEBEFORE", (0, 3), (-1, -1), 1, colors.black),
        # lignes des metriques
        ("LINEABOVE", (3, 3), (-1, -1), 1, colors.black),
        # footer
        ("BACKGROUND", (0, -1), (-1, -1), colors.black),
        ("SPAN", (0, -1), (2, -1)),
        ("LINEABOVE", (0, 3), (3, 3), 1, colors.black),
    ]

    current_l = 3
    for ue, ecs in notesData["ues"].items():
        first = True
        for ec in ecs:
            data.append(
                [
                    Paragraph(
                        ue if first else "",
                        ParagraphStyle(
                            name="",
                            fontSize=8,
                        ),
                    ),
                    Paragraph(
                        ec["ec_code"],
                        ParagraphStyle(
                            name="",
                            fontSize=8,
                        ),
                    ),
                    Paragraph(ec["ec_label"]),
                    Paragraph("{}".format(ec["cred"])),
                    Paragraph("{}".format(ec["cc"])),
                    Paragraph("{}".format(ec["ef"])),
                    Paragraph("{}".format(ec["note_20"])),
                    Paragraph("{}".format(ec["note_100"])),
                    Paragraph(ec["grade"]),
                    Paragraph("{}".format(ec["mgp"])),
                ],
            )
            current_l += 1
            first = False

        stylesTable.append(
            ("LINEABOVE", (0, current_l), (3, current_l), 1, colors.black),
        )

    data.append(
        [
            Paragraph(
                "Total",
                ParagraphStyle(name="", textColor="white"),
            ),
            Paragraph(""),
            Paragraph(""),
            Paragraph(
                "{}".format(notesData["credits"]),
                ParagraphStyle(name="", textColor="white"),
            ),
            Paragraph(""),
            Paragraph(""),
            Paragraph(""),
            Paragraph(""),
            Paragraph(""),
        ],
    )

    # Style du tableau
    table = Table(
        data,
        colWidths=[
            1.6 * units.cm,
            1.6 * units.cm,
            5.7 * units.cm,
            1.6 * units.cm,
            1.5 * units.cm,
            1.5 * units.cm,
            1.6 * units.cm,
            1.6 * units.cm,
            1.5 * units.cm,
            1.6 * units.cm,
        ],
    )

    # ( id colonne, numero ligne)
    table.setStyle(TableStyle(stylesTable))
    elements.append(table)
    elements.append(Spacer(1, 12))

    # Informations sur les crédits et la moyenne
    if notesData["s"] == 1 :
        summaryData = [
            [
                Paragraph("RESULTATS EXPRIMES"),
                "",
                "",
                Paragraph("MGP"),
                Paragraph("GRADE"),
            ],
            [
                Paragraph("semestre {}".format(notesData['semester'])),
                Paragraph("{} /20".format(notesData["moy_total_20"])),
                Paragraph("{} /100".format(notesData["moy_total_100"])),
                Paragraph("{}".format(notesData["mgp"])),
                Paragraph("{}".format(notesData["grade"])),
            ],
        ]
    else:
        summaryData = [
            [
                Paragraph("RESULTATS EXPRIMES"),
                "",
                "",
                Paragraph("MGP"),
                Paragraph("GRADE"),
            ],
            [
                Paragraph("{}".format(notesData['semester_s2'])),
                Paragraph("{} /20".format(notesData["moy_total_20"])),
                Paragraph("{} /100".format(notesData["moy_total_100"])),
                Paragraph("{}".format(notesData["mgp"])),
                Paragraph("{}".format(notesData["grade"])),
            ],
            [
                Paragraph("{}".format(notesData['semester_s1'])),
                Paragraph("{} /20".format(notesData["moy_total_20_s1"])),
                Paragraph("{} /100".format(notesData["moy_total_100_s1"])),
                Paragraph("{}".format(notesData["mgp_s1"])),
                Paragraph("{}".format(notesData["grade_s1"])),
            ],
            [
                Paragraph("{}".format(notesData['semester_all'])),
                Paragraph("{} /20".format(notesData["moy_total_20_all"])),
                Paragraph("{} /100".format(notesData["moy_total_100_all"])),
                Paragraph("{}".format(notesData["mgp_all"])),
                Paragraph("{}".format(notesData["grade_all"])),
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
    space_h = 210 - current_l * 22
    space_h = 0 if space_h < 0 else space_h

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
    
    elements.append(Spacer(1, 10))
    
    subFooterData = [
        [
            Paragraph(
                "NB: Il n'est délivré q'un seul exemplaire de relevé de notes. Le titulaire peut établir et faire certifier des copies conformes",
                ParagraphStyle(
                    name="",
                    parent = styles["Italic"],
                    alignment=enums.TA_CENTER,
                    fontSize=4,
                ),
            ),
        ],
        [
            Paragraph(
                "Only one transcript should be delivered. It is in the owner's interest to make certified true copie",
                ParagraphStyle(
                    name="",
                    parent = styles["Italic"],
                    alignment=enums.TA_CENTER,
                    fontSize=4,
                ),
            ),
        ],
    ]
    
    subFooter = Table(subFooterData)
    
    subFooter.setStyle(
        TableStyle(
            [
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("TOPPADDING", (0, 0), (-1, -1), 0),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 0),
            ]
        ),
    )
    elements.append(subFooter)

    # Générer le PDF
    doc.build(elements)
