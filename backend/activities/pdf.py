from io import BytesIO
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas


def generate_activity_pdf(activity):
    buffer = BytesIO()

    pdf = canvas.Canvas(buffer, pagesize=A4)

    y = 800

    pdf.setFont("Helvetica-Bold", 18)
    pdf.drawString(50, y, activity.title)

    y -= 40
    pdf.setFont("Helvetica", 12)

    pdf.drawString(50, y, f"Level: {activity.level}")
    y -= 20
    pdf.drawString(50, y, f"Domain: {activity.domain}")
    y -= 20
    pdf.drawString(50, y, f"Duration: {activity.duration_minutes} minutes")

    y -= 40
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "Materials")

    y -= 20
    pdf.setFont("Helvetica", 12)

    materials = activity.materials
    if isinstance(materials, list):
        materials = ", ".join(materials)

    pdf.drawString(50, y, materials)

    y -= 40
    pdf.setFont("Helvetica-Bold", 14)
    pdf.drawString(50, y, "Description")

    y -= 20
    pdf.setFont("Helvetica", 12)

    text = pdf.beginText(50, y)
    text.textLines(activity.description)
    pdf.drawText(text)

    pdf.showPage()
    pdf.save()

    buffer.seek(0)

    return buffer