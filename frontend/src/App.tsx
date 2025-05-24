import React, { useState } from 'react';
import './App.css';

// TypeScript interfaces for resume data
interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  github?: string;
  website?: string;
  summary: string;
}

interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
  achievements?: string;
}

interface Experience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  responsibilities: string[];
  technologies?: string[];
}

interface Skill {
  category: string;
  skills: string[];
}

interface ResumeData {
  personalInfo: PersonalInfo;
  education: Education[];
  experience: Experience[];
  skills: Skill[];
  certifications?: string[];
}

function App() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: '',
      summary: ''
    },
    education: [
      {
        id: '1',
        institution: '',
        degree: '',
        field: '',
        startDate: '',
        endDate: '',
        gpa: '',
        achievements: ''
      }
    ],
    experience: [
      {
        id: '1',
        company: '',
        position: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        responsibilities: [''],
        technologies: []
      }
    ],
    skills: [
      { category: 'Skills', skills: [] }
    ],
    certifications: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [skillsInput, setSkillsInput] = useState(''); // Add separate state for skills input

  // Add new education entry
  const addEducation = () => {
    const newEducation: Education = {
      id: Date.now().toString(),
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  // Add new experience entry
  const addExperience = () => {
    const newExperience: Experience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      responsibilities: [''],
      technologies: []
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  // Generate PDF resume
  const generateResume = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:3001/api/generate-resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData)
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
      } else {
        // Get the error message from the backend
        const errorData = await response.json();
        console.error('Backend error:', errorData);
        throw new Error(errorData.message || 'Failed to generate resume');
      }
    } catch (error) {
      console.error('Error generating resume:', error);
      alert(`Failed to generate resume: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsGenerating(false);
    }
  };

  // Remove education entry
  const removeEducation = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  };

  // Update education entry
  const updateEducation = (id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  };

  // Remove experience entry
  const removeExperience = (id: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.filter(exp => exp.id !== id)
    }));
  };

  // Update experience entry
  const updateExperience = (id: string, field: keyof Experience, value: any) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === id ? { ...exp, [field]: value } : exp
      )
    }));
  };

  // Add responsibility to experience
  const addResponsibility = (expId: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === expId 
          ? { ...exp, responsibilities: [...exp.responsibilities, ''] }
          : exp
      )
    }));
  };

  // Update responsibility
  const updateResponsibility = (expId: string, index: number, value: string) => {
    setResumeData(prev => ({
      ...prev,
      experience: prev.experience.map(exp => 
        exp.id === expId 
          ? { 
              ...exp, 
              responsibilities: exp.responsibilities.map((resp, i) => 
                i === index ? value : resp
              )
            }
          : exp
      )
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8" style={{ fontFamily: 'system-ui, sans-serif' }}>
      <div className="max-w-4xl mx-auto px-4">
        <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)', padding: '32px' }}>
          <h1 style={{ fontSize: '30px', fontWeight: 'bold', color: '#1f2937', marginBottom: '32px', textAlign: 'center' }}>
            Resume Generator
          </h1>

          {/* Personal Information Section */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#374151', marginBottom: '16px', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>
              Personal Information
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
              <input
                type="text"
                placeholder="Full Name"
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
                value={resumeData.personalInfo.fullName}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, fullName: e.target.value }
                }))}
              />
              <input
                type="email"
                placeholder="Email"
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
                value={resumeData.personalInfo.email}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, email: e.target.value }
                }))}
              />
              <input
                type="tel"
                placeholder="Phone"
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
                value={resumeData.personalInfo.phone}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, phone: e.target.value }
                }))}
              />
              <input
                type="text"
                placeholder="Location"
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
                value={resumeData.personalInfo.location}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, location: e.target.value }
                }))}
              />
              <input
                type="url"
                placeholder="LinkedIn Profile"
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
                value={resumeData.personalInfo.linkedin}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, linkedin: e.target.value }
                }))}
              />
              <input
                type="url"
                placeholder="GitHub Profile"
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px' }}
                value={resumeData.personalInfo.github}
                onChange={(e) => setResumeData(prev => ({
                  ...prev,
                  personalInfo: { ...prev.personalInfo, github: e.target.value }
                }))}
              />
            </div>
            <textarea
              placeholder="Professional Summary"
              rows={4}
              style={{ width: '100%', marginTop: '16px', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px', resize: 'vertical' }}
              value={resumeData.personalInfo.summary}
              onChange={(e) => setResumeData(prev => ({
                ...prev,
                personalInfo: { ...prev.personalInfo, summary: e.target.value }
              }))}
            />
          </section>

          {/* Education Section */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#374151', marginBottom: '16px', borderBottom: '2px solid #10b981', paddingBottom: '8px' }}>
              Education
            </h2>
            {resumeData.education.map((edu, index) => (
              <div key={edu.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: '#f9fafb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>Education {index + 1}</h3>
                  <button
                    onClick={() => removeEducation(edu.id)}
                    style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px' }}>
                  <input
                    type="text"
                    placeholder="Institution"
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    value={edu.institution}
                    onChange={(e) => updateEducation(edu.id, 'institution', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Degree"
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    value={edu.degree}
                    onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Field of Study"
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    value={edu.field}
                    onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                  />
                  <input
                    type="month"
                    placeholder="Start Date"
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    value={edu.startDate}
                    onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                  />
                  <input
                    type="month"
                    placeholder="End Date"
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    value={edu.endDate}
                    onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="GPA (optional)"
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    value={edu.gpa || ''}
                    onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </section>

          {/* Experience Section */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#374151', marginBottom: '16px', borderBottom: '2px solid #3b82f6', paddingBottom: '8px' }}>
              Experience
            </h2>
            {resumeData.experience.map((exp, index) => (
              <div key={exp.id} style={{ border: '1px solid #e5e7eb', borderRadius: '8px', padding: '16px', marginBottom: '16px', backgroundColor: '#f9fafb' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#374151' }}>Experience {index + 1}</h3>
                  <button
                    onClick={() => removeExperience(exp.id)}
                    style={{ padding: '4px 8px', backgroundColor: '#ef4444', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Remove
                  </button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                  <input
                    type="text"
                    placeholder="Company"
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    value={exp.company}
                    onChange={(e) => updateExperience(exp.id, 'company', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Position"
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    value={exp.position}
                    onChange={(e) => updateExperience(exp.id, 'position', e.target.value)}
                  />
                  <input
                    type="text"
                    placeholder="Location"
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    value={exp.location}
                    onChange={(e) => updateExperience(exp.id, 'location', e.target.value)}
                  />
                  <input
                    type="month"
                    placeholder="Start Date"
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px' }}
                    value={exp.startDate}
                    onChange={(e) => updateExperience(exp.id, 'startDate', e.target.value)}
                  />
                  <input
                    type="month"
                    placeholder="End Date"
                    disabled={exp.current}
                    style={{ padding: '10px', border: '1px solid #d1d5db', borderRadius: '4px', backgroundColor: exp.current ? '#f3f4f6' : 'white' }}
                    value={exp.current ? '' : exp.endDate}
                    onChange={(e) => updateExperience(exp.id, 'endDate', e.target.value)}
                  />
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px' }}>
                    <input
                      type="checkbox"
                      checked={exp.current}
                      onChange={(e) => updateExperience(exp.id, 'current', e.target.checked)}
                    />
                    Currently working here
                  </label>
                </div>
                <div style={{ marginBottom: '12px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                    Responsibilities:
                  </label>
                  {exp.responsibilities.map((resp, respIndex) => (
                    <input
                      key={respIndex}
                      type="text"
                      placeholder={`Responsibility ${respIndex + 1}`}
                      style={{ width: '100%', padding: '8px', border: '1px solid #d1d5db', borderRadius: '4px', marginBottom: '8px' }}
                      value={resp}
                      onChange={(e) => updateResponsibility(exp.id, respIndex, e.target.value)}
                    />
                  ))}
                  <button
                    onClick={() => addResponsibility(exp.id)}
                    style={{ padding: '6px 12px', backgroundColor: '#059669', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '14px' }}
                  >
                    Add Responsibility
                  </button>
                </div>
              </div>
            ))}
          </section>

          {/* Skills Section */}
          <section style={{ marginBottom: '32px' }}>
            <h2 style={{ fontSize: '24px', fontWeight: '600', color: '#374151', marginBottom: '16px', borderBottom: '2px solid #8b5cf6', paddingBottom: '8px' }}>
              Skills
            </h2>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
                Skills (comma-separated):
              </label>
              <textarea
                placeholder="Enter your skills separated by commas (e.g., Docker, Kubernetes, AWS, Python, CI/CD)"
                rows={3}
                style={{ width: '100%', padding: '12px', border: '1px solid #d1d5db', borderRadius: '6px', fontSize: '16px', resize: 'vertical' }}
                value={skillsInput}
                onChange={(e) => {
                  const value = e.target.value;
                  setSkillsInput(value);
                  // Only update skills data when user finishes typing (on blur or when comma is complete)
                }}
                onBlur={() => {
                  // Update skills when user finishes typing
                  const skillsArray = skillsInput.split(',').map(skill => skill.trim()).filter(skill => skill);
                  setResumeData(prev => ({
                    ...prev,
                    skills: [{ category: 'Skills', skills: skillsArray }]
                  }));
                }}
              />
            </div>
          </section>

          {/* Action Buttons */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'center', marginTop: '32px' }}>
            <button
              onClick={addEducation}
              style={{ padding: '12px 24px', backgroundColor: '#10b981', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}
            >
              Add Education
            </button>
            <button
              onClick={addExperience}
              style={{ padding: '12px 24px', backgroundColor: '#3b82f6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '16px', fontWeight: '600' }}
            >
              Add Experience
            </button>
            <button
              onClick={generateResume}
              disabled={isGenerating || !resumeData.personalInfo.fullName}
              style={{ 
                padding: '12px 32px', 
                backgroundColor: isGenerating || !resumeData.personalInfo.fullName ? '#9ca3af' : '#8b5cf6', 
                color: 'white', 
                border: 'none', 
                borderRadius: '6px', 
                cursor: isGenerating || !resumeData.personalInfo.fullName ? 'not-allowed' : 'pointer', 
                fontSize: '16px', 
                fontWeight: '700' 
              }}
            >
              {isGenerating ? 'Generating...' : 'Generate PDF Resume'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
