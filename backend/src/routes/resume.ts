import { Router, Request, Response, NextFunction } from 'express';
import { ResumeData } from '../types/types';
import { pdfGenerator } from '../services/pdfGenerator';

export const resumeRoutes = Router();

// Simple validation middleware
const validateResumeData = (req: Request, res: Response, next: NextFunction): void => {
  const { personalInfo } = req.body;

  if (!personalInfo || !personalInfo.fullName || !personalInfo.email) {
    res.status(400).json({
      success: false,
      message: 'Personal information with full name and email is required'
    });
    return;
  }

  next();
};

// POST /api/generate-resume - Generate PDF resume
resumeRoutes.post('/generate-resume', validateResumeData, async (req: Request, res: Response): Promise<void> => {
  try {
    const resumeData: ResumeData = req.body;
    
    console.log('📄 Generating resume for:', resumeData.personalInfo.fullName);
    
    // Generate PDF
    const pdfBuffer = await pdfGenerator.generatePDF(resumeData);
    
    // Set headers for PDF download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${resumeData.personalInfo.fullName.replace(/\s+/g, '_')}_Resume.pdf"`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    // Send PDF
    res.send(pdfBuffer);
    
    console.log('✅ PDF sent successfully');

  } catch (error) {
    console.error('Error generating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate resume',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/status - API status
resumeRoutes.get('/status', (req: Request, res: Response): void => {
  res.json({
    success: true,
    message: 'Resume Generator API is running',
    data: {
      version: '1.0.0',
      endpoints: [
        'POST /api/generate-resume',
        'GET /api/status'
      ]
    }
  });
});
