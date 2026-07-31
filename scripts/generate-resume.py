#!/usr/bin/env python3
"""
Generate the Studio Errant / Amay Deep resume PDF.
ATS-safe, single-column, single page.
"""
import sys, os

PDF_SKILL_DIR = "/home/z/my-project/skills/pdf"
sys.path.insert(0, os.path.join(PDF_SKILL_DIR, "scripts"))

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import cm
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.enums import TA_LEFT, TA_CENTER
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, HRFlowable,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.pdfbase.pdfmetrics import registerFontFamily

# ── Font Registration ──
pdfmetrics.registerFont(TTFont('FreeSerif', '/usr/share/fonts/truetype/freefont/FreeSerif.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Bold', '/usr/share/fonts/truetype/freefont/FreeSerifBold.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-Italic', '/usr/share/fonts/truetype/freefont/FreeSerifItalic.ttf'))
pdfmetrics.registerFont(TTFont('FreeSerif-BoldItalic', '/usr/share/fonts/truetype/freefont/FreeSerifBoldItalic.ttf'))
registerFontFamily('FreeSerif', normal='FreeSerif', bold='FreeSerif-Bold', italic='FreeSerif-Italic', boldItalic='FreeSerif-BoldItalic')

# ── Palette (minimal, restrained) ──
TEXT = colors.HexColor('#1a1a1a')
MUTED = colors.HexColor('#5a5a5a')
ACCENT = colors.HexColor('#2b2722')

# ── Styles ──
name_style = ParagraphStyle(
    'ResumeName', fontName='FreeSerif-Bold', fontSize=24,
    leading=28, alignment=TA_CENTER, spaceAfter=2, textColor=TEXT
)
contact_style = ParagraphStyle(
    'ResumeContact', fontName='FreeSerif', fontSize=10,
    leading=14, alignment=TA_CENTER, textColor=MUTED, spaceAfter=8
)
section_title_style = ParagraphStyle(
    'ResumeSectionTitle', fontName='FreeSerif-Bold', fontSize=12,
    leading=15, spaceBefore=12, spaceAfter=2,
    textColor=ACCENT
)
job_title_style = ParagraphStyle(
    'ResumeJobTitle', fontName='FreeSerif-Bold', fontSize=10.5,
    leading=14, spaceAfter=1, textColor=TEXT
)
job_meta_style = ParagraphStyle(
    'ResumeJobMeta', fontName='FreeSerif-Italic', fontSize=10,
    leading=13, textColor=MUTED, spaceAfter=4
)
bullet_style = ParagraphStyle(
    'ResumeBullet', fontName='FreeSerif', fontSize=10,
    leading=14, leftIndent=14, bulletIndent=0,
    spaceBefore=1, spaceAfter=1, textColor=TEXT
)
body_style = ParagraphStyle(
    'ResumeBody', fontName='FreeSerif', fontSize=10,
    leading=14, spaceAfter=2, textColor=TEXT
)

def section_header(title):
    return [
        Paragraph(f'<b>{title}</b>', section_title_style),
        HRFlowable(width='100%', thickness=0.8, color=ACCENT,
                    spaceBefore=0, spaceAfter=6),
    ]

def experience_entry(title, company, dates, location, bullets):
    elements = [
        Paragraph(f'<b>{title}</b>', job_title_style),
        Paragraph(f'{company}  |  {dates}  |  {location}', job_meta_style),
    ]
    for b in bullets:
        elements.append(Paragraph(f'• {b}', bullet_style))
    elements.append(Spacer(1, 4))
    return elements

def education_entry(degree, school, dates, details=None):
    elements = [
        Paragraph(f'<b>{degree}</b>', job_title_style),
        Paragraph(f'{school}  |  {dates}', job_meta_style),
    ]
    if details:
        elements.append(Paragraph(details, body_style))
    elements.append(Spacer(1, 4))
    return elements

def skills_row(categories):
    elements = []
    for cat, vals in categories:
        elements.append(Paragraph(f'<b>{cat}:</b>  {vals}', body_style))
    return elements

# ── Build Document ──
output_path = '/home/z/my-project/public/amay-deep-resume.pdf'
doc = SimpleDocTemplate(
    output_path, pagesize=A4,
    leftMargin=1.5*cm, rightMargin=1.5*cm,
    topMargin=1.5*cm, bottomMargin=1.5*cm,
    title='Resume - Amay Deep',
    author='Amay Deep', creator='Studio Errant',
    subject='Amay Deep — Designer, Writer, Developer'
)

story = []

# Header
story.append(Paragraph('AMAY DEEP', name_style))
story.append(Paragraph(
    'amay@studioerrant.com  |  thebandar.co.in  |  github.com/XiaoPongo  |  Instagram: @chillbandar',
    contact_style
))

# Summary
story.extend(section_header('PROFILE'))
story.append(Paragraph(
    'Designer, writer, and developer working independently under the name Studio Errant. '
    'B.Com. graduate who came to design and code sideways — through curiosity rather than '
    'a plan. I build digital products, write about the process, and run small experiments '
    'in interface, atmosphere, and attention. Previously operated as The Bandar Co.',
    body_style
))

# Experience
story.extend(section_header('SELECTED WORK'))
story.extend(experience_entry(
    'Studio Errant (Independent Practice)', 'Founder', '2024 — Present', 'Remote',
    [
        'Design, build, and write about digital products that prioritise atmosphere and attention over engagement.',
        'Disciplines: artificial intelligence, design, writing, research, experiments, visual media.',
        'Ship essays, case studies, and tools that document curiosity as a practice rather than a trait.',
    ]
))
story.extend(experience_entry(
    'The Bandar Co.', 'Designer & Developer', '2022 — 2024', 'Remote',
    [
        'Built and shipped personal portfolio, experiments, and small client web projects.',
        'Explored Vanta.js topology backgrounds, typed-text interactions, and responsive dark-mode design.',
        'Iterated on identity until the work found its quieter, more deliberate direction (now Studio Errant).',
    ]
))

# Education
story.extend(section_header('EDUCATION'))
story.extend(education_entry(
    'Bachelor of Commerce (B.Com.)', 'University', '2019 — 2022',
    'Studied commerce; kept sketching, designing, and coding on the side.'
))

# Skills
story.extend(section_header('SKILLS'))
story.extend(skills_row([
    ('Design', 'Interface design, typography, design systems, atmospheric/mood-driven UI, brand identity'),
    ('Development', 'JavaScript, TypeScript, React, Next.js, Tailwind CSS, Canvas/WebGL, Node.js'),
    ('Writing', 'Essays, case studies, documentation, reflective/first-person narrative'),
    ('Tools', 'Git, Figma, VS Code, Vercel, Playwright, ReportLab'),
]))

# Links
story.extend(section_header('LINKS'))
story.extend(skills_row([
    ('Website', 'studioerrant.example  /  thebandar.co.in'),
    ('GitHub', 'github.com/XiaoPongo'),
    ('Instagram', 'instagram.com/chillbandar'),
    ('LinkedIn', 'linkedin.com/in/amay-deep-34158b229'),
    ('Email', 'amay@studioerrant.com'),
]))

doc.build(story)
print(f"Resume generated: {output_path}")
