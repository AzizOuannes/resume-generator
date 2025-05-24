import { ResumeData } from '../types/types';

export function generateResumeHTML(data: ResumeData): string {
  const { personalInfo, education, experience, skills } = data;

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Resume - ${personalInfo.fullName}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 8.5in;
            margin: 0 auto;
            background: white;
        }
        
        .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #2563eb;
            padding-bottom: 20px;
        }
        
        .name {
            font-size: 32px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 10px;
        }
        
        .contact-info {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 20px;
            margin-bottom: 15px;
            font-size: 14px;
            color: #6b7280;
        }
        
        .contact-item {
            display: flex;
            align-items: center;
            gap: 5px;
        }
        
        .contact-item a {
            color: inherit;
            text-decoration: none;
        }
        
        .contact-item a:hover {
            text-decoration: underline;
        }
        
        .section {
            margin-bottom: 25px;
        }
        
        .section-title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            border-bottom: 1px solid #e5e7eb;
            padding-bottom: 5px;
            margin-bottom: 15px;
        }
        
        .summary {
            font-size: 14px;
            line-height: 1.6;
            color: #4b5563;
            text-align: justify;
        }
        
        .experience-item, .education-item {
            margin-bottom: 20px;
            page-break-inside: avoid;
        }
        
        .item-header {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            margin-bottom: 8px;
            flex-wrap: wrap;
        }
        
        .item-title {
            font-weight: bold;
            font-size: 16px;
            color: #1f2937;
        }
        
        .item-company {
            font-size: 14px;
            color: #2563eb;
            font-weight: 600;
        }
        
        .item-date {
            font-size: 12px;
            color: #6b7280;
            white-space: nowrap;
        }
        
        .item-location {
            font-size: 12px;
            color: #6b7280;
            font-style: italic;
        }
        
        .responsibilities {
            margin-top: 8px;
        }
        
        .responsibilities ul {
            padding-left: 20px;
        }
        
        .responsibilities li {
            margin-bottom: 4px;
            font-size: 13px;
            line-height: 1.4;
        }
        
        .skills-container {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }
        
        .skill-item {
            background: #f3f4f6;
            padding: 4px 12px;
            border-radius: 20px;
            font-size: 12px;
            color: #374151;
            border: 1px solid #e5e7eb;
        }
        
        @media print {
            body {
                print-color-adjust: exact;
                -webkit-print-color-adjust: exact;
            }
            
            .page-break {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div class="header">
        <h1 class="name">${personalInfo.fullName}</h1>
        <div class="contact-info">
            <div class="contact-item">📧 ${personalInfo.email}</div>
            <div class="contact-item">📱 ${personalInfo.phone}</div>
            <div class="contact-item">📍 ${personalInfo.location}</div>
            ${personalInfo.linkedin ? `<div class="contact-item">💼 <a href="${personalInfo.linkedin}" target="_blank">LinkedIn</a></div>` : ''}
            ${personalInfo.github ? `<div class="contact-item">🔗 <a href="${personalInfo.github}" target="_blank">GitHub</a></div>` : ''}
        </div>
    </div>

    ${personalInfo.summary ? `
    <div class="section">
        <h2 class="section-title">Professional Summary</h2>
        <div class="summary">${personalInfo.summary}</div>
    </div>
    ` : ''}

    ${experience.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Professional Experience</h2>
        ${experience.map(exp => `
            <div class="experience-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${exp.position}</div>
                        <div class="item-company">${exp.company}</div>
                        <div class="item-location">${exp.location}</div>
                    </div>
                    <div class="item-date">
                        ${formatDate(exp.startDate)} - ${exp.current ? 'Present' : formatDate(exp.endDate)}
                    </div>
                </div>
                ${exp.responsibilities.length > 0 && exp.responsibilities[0] ? `
                <div class="responsibilities">
                    <ul>
                        ${exp.responsibilities.filter(resp => resp.trim()).map(resp => `<li>${resp}</li>`).join('')}
                    </ul>
                </div>
                ` : ''}
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${education.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Education</h2>
        ${education.map(edu => `
            <div class="education-item">
                <div class="item-header">
                    <div>
                        <div class="item-title">${edu.degree} in ${edu.field}</div>
                        <div class="item-company">${edu.institution}</div>
                        ${edu.gpa ? `<div class="item-location">GPA: ${edu.gpa}</div>` : ''}
                    </div>
                    <div class="item-date">
                        ${formatDate(edu.startDate)} - ${formatDate(edu.endDate)}
                    </div>
                </div>
            </div>
        `).join('')}
    </div>
    ` : ''}

    ${skills.length > 0 && skills[0].skills.length > 0 ? `
    <div class="section">
        <h2 class="section-title">Skills</h2>
        <div class="skills-container">
            ${skills[0].skills.map(skill => `<span class="skill-item">${skill}</span>`).join('')}
        </div>
    </div>
    ` : ''}

</body>
</html>
  `;
}

function formatDate(dateString: string): string {
  if (!dateString) return '';
  const date = new Date(dateString + '-01');
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
}
