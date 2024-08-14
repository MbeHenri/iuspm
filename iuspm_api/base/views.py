from django.http import HttpResponse
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer

def test(request):
    return "Hello world"

def generate_transcript_pdf(request):
    # Créer une réponse HTTP avec un type de contenu PDF
    response = HttpResponse(content_type="application/pdf")
    response["Content-Disposition"] = 'attachment; filename="transcript.pdf"'

    # Créer le PDF
    doc = SimpleDocTemplate(response, pagesize=A4)
    elements = []

    # Styles
    styles = getSampleStyleSheet()

    # En-tête du document
    header = [
        Paragraph("REPUBLIQUE DU CAMEROUN", styles["Title"]),
        Paragraph(
            "INSTITUT UNIVERSITAIRE DES SCIENCES PÉTROLIÈRES ET DE MANAGEMENT",
            styles["Title"],
        ),
        Paragraph("RELEVE DE NOTES / TRANSCRIPT", styles["Title"]),
        Paragraph("Année Académique 2020 - 2021", styles["Title"]),
    ]
    elements.extend(header)
    elements.append(Spacer(1, 12))

    # Informations de l'étudiant
    student_info = [
        "Nom et Prénom: [Nom Etudiant]",
        "Matricule: [Matricule]",
        "Parcours: Commerce et Gestion",
        "Niveau: 4",
    ]
    for info in student_info:
        elements.append(Paragraph(info, styles["Normal"]))
    elements.append(Spacer(1, 12))

    # Tableau des notes
    data = [
        [
            "Code UE",
            "Code EC",
            "Intitulé de l'UE",
            "Note /20",
            "GRA",
            "Crédit",
            "Déc",
            "TRA",
            "SES",
            "Année",
        ],
        [
            "MDC111",
            "MARKETING 1",
            "Comportement du consommateur",
            "12.55",
            "C",
            "3",
            "AC",
            "O",
            "N",
            "2020/2021",
        ],
        # Ajoutez d'autres lignes ici...
    ]

    # Style du tableau
    table = Table(data)
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.grey),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.whitesmoke),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("BOTTOMPADDING", (0, 0), (-1, 0), 12),
                ("BACKGROUND", (0, 1), (-1, -1), colors.beige),
                ("GRID", (0, 0), (-1, -1), 1, colors.black),
            ]
        )
    )
    elements.append(table)
    elements.append(Spacer(1, 12))

    # Informations sur les crédits et la moyenne
    summary = [
        "Total Crédit: 53/60",
        "Moyenne annuelle: 10,42 / 20",
        "Mention: Passable",
        "Grade: C",
    ]
    for info in summary:
        elements.append(Paragraph(info, styles["Normal"]))
    elements.append(Spacer(1, 12))

    # Signatures
    signatures = [
        "Douala, le 03 AVR 2021",
        "Le Président-Rector de l'Institut: [Nom]",
        "Le Doyen de la Faculté: [Nom]",
    ]
    for sign in signatures:
        elements.append(Paragraph(sign, styles["Normal"]))

    # Générer le PDF
    doc.build(elements)

    return response
