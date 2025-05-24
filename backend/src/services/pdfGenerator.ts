import puppeteer, { Browser, Page } from 'puppeteer';
import { ResumeData } from '../types/types';
// Use require as fallback if import fails
const { generateResumeHTML } = require('./templateGenerator');

export class PDFGenerator {
  private static instance: PDFGenerator;
  private browser: Browser | null = null;

  private constructor() {}

  public static getInstance(): PDFGenerator {
    if (!PDFGenerator.instance) {
      PDFGenerator.instance = new PDFGenerator();
    }
    return PDFGenerator.instance;
  }

  public async initialize(): Promise<void> {
    if (!this.browser) {
      console.log('🚀 Initializing Puppeteer browser...');
      this.browser = await puppeteer.launch({
        headless: true,
        args: [
          '--no-sandbox',
          '--disable-setuid-sandbox',
          '--disable-dev-shm-usage',
          '--disable-accelerated-2d-canvas',
          '--no-first-run',
          '--no-zygote',
          '--disable-gpu'
        ]
      });
      console.log('✅ Puppeteer browser initialized');
    }
  }

  public async generatePDF(resumeData: ResumeData): Promise<Buffer> {
    try {
      await this.initialize();
      
      if (!this.browser) {
        throw new Error('Browser not initialized');
      }

      console.log('📄 Generating PDF for:', resumeData.personalInfo.fullName);

      const page: Page = await this.browser.newPage();
      
      // Generate HTML content
      const htmlContent = generateResumeHTML(resumeData);
      
      // Set content and wait for load
      await page.setContent(htmlContent, { 
        waitUntil: 'networkidle0',
        timeout: 30000 
      });

      // Generate PDF
      const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: {
          top: '0.5in',
          right: '0.5in',
          bottom: '0.5in',
          left: '0.5in'
        },
        preferCSSPageSize: true
      });

      await page.close();
      
      console.log('✅ PDF generated successfully');
      return pdfBuffer;

    } catch (error) {
      console.error('❌ Error generating PDF:', error);
      throw new Error(`PDF generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  public async cleanup(): Promise<void> {
    if (this.browser) {
      console.log('🧹 Closing Puppeteer browser...');
      await this.browser.close();
      this.browser = null;
    }
  }
}

export const pdfGenerator = PDFGenerator.getInstance();
