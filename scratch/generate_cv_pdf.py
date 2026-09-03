import os
from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.units import inch
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_RIGHT, TA_JUSTIFY

def build_pdf(filename):
    doc = SimpleDocTemplate(
        filename,
        pagesize=letter,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=36
    )

    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'DocTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=20,
        leading=24,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#000000')
    )

    subtitle_style = ParagraphStyle(
        'DocSubTitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13,
        alignment=TA_CENTER,
        textColor=colors.HexColor('#111111')
    )

    sec_heading_style = ParagraphStyle(
        'SecHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=11,
        leading=14,
        textColor=colors.HexColor('#000000'),
        spaceBefore=8,
        spaceAfter=3
    )

    body_style = ParagraphStyle(
        'BodyTextCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        alignment=TA_JUSTIFY,
        textColor=colors.HexColor('#111111')
    )

    bold_label_style = ParagraphStyle(
        'BoldLabel',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#000000')
    )

    bullet_style = ParagraphStyle(
        'BulletCustom',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        leftIndent=15,
        firstLineIndent=-10,
        textColor=colors.HexColor('#111111')
    )

    job_title_style = ParagraphStyle(
        'JobTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        leading=13.5,
        textColor=colors.HexColor('#000000')
    )

    job_meta_style = ParagraphStyle(
        'JobMeta',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9.5,
        leading=13.5,
        alignment=TA_RIGHT,
        textColor=colors.HexColor('#111111')
    )

    job_sub_style = ParagraphStyle(
        'JobSub',
        parent=styles['Normal'],
        fontName='Helvetica-Oblique',
        fontSize=9.5,
        leading=13.5,
        textColor=colors.HexColor('#222222')
    )

    story = []

    def section_divider():
        return [
            Spacer(1, 4),
            HRFlowable(width="100%", thickness=1, color=colors.HexColor('#333333'), spaceBefore=2, spaceAfter=6)
        ]

    # --- HEADER ---
    story.append(Paragraph("<b>ABHAY GUPTA</b>", title_style))
    story.append(Spacer(1, 4))
    story.append(Paragraph("Hyderabad, India | +91-9390712838 | Abbaabhayyy@gmail.com", subtitle_style))
    story.append(Paragraph("GitHub: Abhay-Gupta-07 | LinkedIn: Abhay Gupta", subtitle_style))
    story.append(Spacer(1, 4))

    # --- CAREER OBJECTIVE ---
    story.append(Paragraph("CAREER OBJECTIVE", sec_heading_style))
    story.extend(section_divider())
    story.append(Paragraph(
        "Final-year B.Tech student specializing in Computer Science Engineering (AI & ML) with strong skills in AI/ML, "
        "Generative AI, web development, real-time applications, and software development. Completed a 3-month AI "
        "Engineer internship at Arah Infotech, where I developed Hire IQ, an AI-powered interview platform, and worked on "
        "AI calling, testing, debugging, monitoring, and workflow integration. Passionate about building scalable, user-friendly, "
        "and AI-driven applications. Seeking an entry-level AI Engineer, AI/ML Engineer, or Software Engineer role "
        "where I can apply my technical skills, solve real-world problems, and continue growing professionally.",
        body_style
    ))
    story.append(Spacer(1, 8))

    # --- TECHNICAL SKILLS ---
    story.append(Paragraph("TECHNICAL SKILLS", sec_heading_style))
    story.extend(section_divider())

    skills_data = [
        [Paragraph("<b>Programming Languages:</b>", bold_label_style), Paragraph("Python, TypeScript, JavaScript, Java", body_style)],
        [Paragraph("<b>Web Technologies:</b>", bold_label_style), Paragraph("HTML5, CSS3, Next.js, Node.js, FastAPI, Firebase, WebSockets", body_style)],
        [Paragraph("<b>AI/ML Concepts:</b>", bold_label_style), Paragraph("Data Preprocessing, Predictive Modeling, Generative AI Basics, Computer Vision, NLP", body_style)],
        [Paragraph("<b>Tools & Platforms:</b>", bold_label_style), Paragraph("GitHub, Git, VS Code, Vercel, Netlify, PythonAnywhere", body_style)],
        [Paragraph("<b>Soft Skills:</b>", bold_label_style), Paragraph("Teamwork, Communication, Problem-Solving", body_style)],
    ]
    skills_table = Table(skills_data, colWidths=[130, 410])
    skills_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('TOPPADDING', (0,0), (-1,-1), 1),
        ('BOTTOMPADDING', (0,0), (-1,-1), 2),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(skills_table)
    story.append(Spacer(1, 8))

    # --- EXPERIENCE ---
    story.append(Paragraph("EXPERIENCE", sec_heading_style))
    story.extend(section_divider())

    exp_header = [
        [Paragraph("<b>Arah Infotech</b>", job_title_style), Paragraph("May 20, 2026 – August 26, 2026", job_meta_style)]
    ]
    t_exp = Table(exp_header, colWidths=[340, 200])
    t_exp.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('LEFTPADDING', (0,0), (-1,-1), 0),
        ('RIGHTPADDING', (0,0), (-1,-1), 0),
        ('BOTTOMPADDING', (0,0), (-1,-1), 1),
    ]))
    story.append(t_exp)
    story.append(Paragraph("<i>AI Engineer Intern</i>", job_sub_style))
    story.append(Spacer(1, 3))
    story.append(Paragraph("• Developed <b>Hire IQ</b>, an AI-powered interview platform, and worked on AI calling agent integration, interview workflows, webcam and screen recording, live monitoring, approval workflows, OmniDimension synchronization, testing, debugging, and performance optimization.", bullet_style))
    story.append(Spacer(1, 2))
    story.append(Paragraph("• Successfully completed the internship on 26 August 2026 and received an internship certificate.", bullet_style))
    story.append(Spacer(1, 8))

    # --- PROJECTS ---
    story.append(Paragraph("PROJECTS", sec_heading_style))
    story.extend(section_divider())

    # Project 1: Hire IQ
    story.append(Paragraph("<b>Hire IQ</b>", job_title_style))
    story.append(Paragraph("• Developed an AI-powered mock interview platform utilizing webcam lip-tracking, anti-cheating monitoring, and dynamic question generation.", bullet_style))
    story.append(Paragraph("• <b>Tech Stack:</b> TypeScript, Next.js, FastAPI, MediaPipe, Vercel", bullet_style))
    story.append(Spacer(1, 6))

    # Project 2: Automated Exam Evaluation System
    story.append(Paragraph("<b>Automated Exam Evaluation System</b>", job_title_style))
    story.append(Paragraph("• Engineered an AI-based system to automate the evaluation of descriptive exam answers using Natural Language Processing (NLP).", bullet_style))
    story.append(Paragraph("• <b>Tech Stack:</b> Python, NLP, Machine Learning", bullet_style))
    story.append(Spacer(1, 6))

    # Project 3: QR Based Attendance Management System
    story.append(Paragraph("<b>QR Based Attendance Management System</b>", job_title_style))
    story.append(Paragraph("• Built a secure management system for tracking student/employee attendance via dynamic QR code generation and decoding.", bullet_style))
    story.append(Paragraph("• <b>Tech Stack:</b> HTML, CSS, JavaScript, Python, Firebase", bullet_style))
    story.append(Paragraph("• <b>Project Link:</b> https://4bhaygupta.pythonanywhere.com", bullet_style))
    story.append(Spacer(1, 6))

    # Project 4: Jewellery Website
    story.append(Paragraph("<b>Jewellery Website</b>", job_title_style))
    story.append(Paragraph("• Developed an e-commerce storefront for displaying jewelry collections with an intuitive user interface and product galleries.", bullet_style))
    story.append(Paragraph("• <b>Tech Stack:</b> TypeScript, Next.js, Tailwind CSS", bullet_style))
    story.append(Spacer(1, 6))

    # Project 5: Aura Draw
    story.append(Paragraph("<b>Aura Draw</b>", job_title_style))
    story.append(Paragraph("• Created an interactive, web-based digital drawing application featuring a customizable canvas and real-time rendering.", bullet_style))
    story.append(Paragraph("• <b>Tech Stack:</b> TypeScript, React, HTML Canvas", bullet_style))
    story.append(Spacer(1, 6))

    # Project 6: Portfolio Website
    story.append(Paragraph("<b>Portfolio Website</b>", job_title_style))
    story.append(Paragraph("• Designed and deployed a responsive personal portfolio to showcase software projects, skills, and resume.", bullet_style))
    story.append(Paragraph("• <b>Tech Stack:</b> TypeScript, Next.js, React, CSS", bullet_style))
    story.append(Paragraph("• <b>Project Link:</b> https://abhayqr.site", bullet_style))
    story.append(Spacer(1, 6))

    # Project 7: Birthday Surprise Website
    story.append(Paragraph("<b>Birthday Surprise Website</b>", job_title_style))
    story.append(Paragraph("• Created a responsive digital greeting card featuring interactive animations and modern UI effects to celebrate special events.", bullet_style))
    story.append(Paragraph("• <b>Tech Stack:</b> TypeScript, HTML, CSS, GSAP", bullet_style))
    story.append(Spacer(1, 10))

    # --- EDUCATION ---
    story.append(Paragraph("EDUCATION", sec_heading_style))
    story.extend(section_divider())

    edu_1 = [
        [Paragraph("<b>Mahaveer Institute of Science and Technology, Hyderabad</b>", job_title_style), Paragraph("2023 - 2027 (Expected)", job_meta_style)]
    ]
    t_edu1 = Table(edu_1, colWidths=[370, 170])
    t_edu1.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0)]))
    story.append(t_edu1)
    story.append(Paragraph("<i>B.Tech in Computer Science & Engineering (AI & ML)</i>", job_sub_style))
    story.append(Spacer(1, 5))

    edu_2 = [
        [Paragraph("<b>Sri Vaishnavi Junior College, Hyderabad</b>", job_title_style), Paragraph("Completed: 2023", job_meta_style)]
    ]
    t_edu2 = Table(edu_2, colWidths=[370, 170])
    t_edu2.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0)]))
    story.append(t_edu2)
    story.append(Paragraph("<i>Intermediate Education (MPC) | CGPA: 7.5</i>", job_sub_style))
    story.append(Spacer(1, 5))

    edu_3 = [
        [Paragraph("<b>SR Digi School</b>", job_title_style), Paragraph("Completed: 2021", job_meta_style)]
    ]
    t_edu3 = Table(edu_3, colWidths=[370, 170])
    t_edu3.setStyle(TableStyle([('VALIGN', (0,0), (-1,-1), 'TOP'), ('LEFTPADDING', (0,0), (-1,-1), 0), ('RIGHTPADDING', (0,0), (-1,-1), 0)]))
    story.append(t_edu3)
    story.append(Paragraph("<i>SSC | CGPA: 9.3</i>", job_sub_style))
    story.append(Spacer(1, 10))

    # --- CERTIFICATIONS & ACHIEVEMENTS ---
    story.append(Paragraph("CERTIFICATIONS & ACHIEVEMENTS", sec_heading_style))
    story.extend(section_divider())

    certs = [
        "Arah Infotech AI/ML Engineer Internship Completion Certificate (May–Aug 2026)",
        "1st Prize Winner - Design Freaks, Technomist 2K25",
        "Artificial Intelligence Fundamentals - IBM SkillsBuild (Mar 2025)",
        "Craft Precise Prompts for AI Models - IBM SkillsBuild (Aug 2026)",
        "AI Literacy - IBM SkillsBuild (Aug 2026)",
        "Project Management Fundamentals - IBM SkillsBuild (Aug 2026)",
        "Communication Skills - TCS iON (Aug 2026)",
        "Career Management Essentials - IBM SkillsBuild (Aug 2026)",
        "Participated in Generative AI Workshop and AI Model Building Workshop by NxtWave",
        "Participated in Cyber Security & Ethical Hacking Workshop (2024)",
        "Participated in National Start Up Day 2024"
    ]

    for cert in certs:
        story.append(Paragraph(f"• {cert}", bullet_style))
        story.append(Spacer(1, 2))

    story.append(Spacer(1, 8))

    # --- LANGUAGES ---
    story.append(Paragraph("LANGUAGES", sec_heading_style))
    story.extend(section_divider())
    story.append(Paragraph("English | Hindi | Telugu | Bengali", body_style))

    doc.build(story)
    print(f"Successfully generated updated PDF at {filename}")

if __name__ == '__main__':
    target_path = os.path.join(r"c:\Users\ABHAY\OneDrive\Desktop\Portfolio !", "public", "assets", "Abhay_Gupta_CV.pdf")
    build_pdf(target_path)
