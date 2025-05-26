# Resume Generator

A full-stack web application that allows users to create professional resumes by filling out a form and generating downloadable PDF files.

## Features

- **Interactive Form**: Clean, responsive form for entering personal information, education, experience, and skills
- **Real-time Validation**: Form validation with TypeScript type safety
- **PDF Generation**: High-quality PDF resumes generated using Puppeteer
- **Professional Templates**: Clean, modern resume layout optimized for ATS systems
- **Responsive Design**: Works on desktop and mobile devices
- **Error Handling**: Comprehensive error handling and user feedback

##Tech Stack

### Frontend
- **React 18** with TypeScript
- **Custom CSS** (responsive design)
- **Form Management** with controlled components
- **Fetch API** for backend communication

### Backend
- **Node.js** with Express and TypeScript
- **Puppeteer** for PDF generation
- **CORS** enabled for cross-origin requests
- **Helmet** for security headers
- **Compression** for response optimization

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd resume-generator
```

2. **Install backend dependencies**
```bash
cd backend
npm install
```

3. **Install frontend dependencies**
```bash
cd ../frontend
npm install
```

### Running the Application

1. **Start the backend server**
```bash
cd backend
npm run dev
```
Backend will run on `http://localhost:3001`

2. **Start the frontend (in a new terminal)**
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000`

3. **Access the application**
Open your browser and navigate to `http://localhost:3000`

## Usage

1. Fill out the form with your personal information
2. Add education entries using the "Add Education" button
3. Add work experience using the "Add Experience" button
4. Enter your skills (comma-separated)
5. Click "Generate PDF Resume" to download your resume

## API Endpoints

- `GET /health` - Health check
- `GET /api/status` - API status and available endpoints
- `POST /api/generate-resume` - Generate PDF resume from form data



