import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createRoot } from 'react-dom/client';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Stepper from '../components/Stepper';
import { ModernProfessional } from '../components/cv-templates/ModernProfessional';
import { CreativeBold } from '../components/cv-templates/CreativeBold';
import { MinimalistClean } from '../components/cv-templates/MinimalistClean';
import { ExecutiveElite } from '../components/cv-templates/ExecutiveElite';
import templateImage1 from '../assets/CV-template-01.jpg';
import templateImage2 from '../assets/CV-template-02.jpg';
import templateImage3 from '../assets/CV-template-03.jpg';
import templateImage4 from '../assets/CV-template-04.jpg';
import API_BASE_URL from '../utils/apiConfig';

// SVG Icons
function DownloadIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function SendIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
    </svg>
  );
}

function FileTextIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 20 20">
      <path
        fillRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const steps = [
  { id: 1, title: 'Select Template', description: 'Choose a design' },
  { id: 2, title: 'Personal Details', description: 'Add your information' },
  { id: 3, title: 'CV Content', description: 'Edit CV details' },
  { id: 4, title: 'Preview & Download', description: 'Review and download' },
];

const templates = [
  { id: 1, name: 'Modern Professional', component: ModernProfessional, description: 'Clean design with blue accents', image: templateImage1 },
  { id: 2, name: 'Creative Bold', component: CreativeBold, description: 'Vibrant purple sidebar layout', image: templateImage2 },
  { id: 3, name: 'Minimalist Clean', component: MinimalistClean, description: 'Ultra-minimal centered design', image: templateImage3 },
  { id: 4, name: 'Executive Elite', component: ExecutiveElite, description: 'Premium dark theme with gold', image: templateImage4 },
];

function CreateCVPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [personalDetails, setPersonalDetails] = useState({
    fullName: '',
    title: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    country: '',
    postalCode: '',
    linkedIn: '',
    website: '',
    summary: '',
  });
  const [jobDetails, setJobDetails] = useState({
    position: '',
    company: '',
    requiredSkills: '',
    experience: '',
    jobLink: '',
  });
  const [cvContent, setCvContent] = useState({
    professionalSummary: '',
    experience: [],
    education: [],
    skills: [],
  });
  const [createdCVsCount, setCreatedCVsCount] = useState(0);
  const [createdLimitReached, setCreatedLimitReached] = useState(false);
  const [loadingCreatedLimit, setLoadingCreatedLimit] = useState(true);

  // Load created CVs count from backend (limit 3)
  useEffect(() => {
    const loadCreatedCVsCount = async () => {
      try {
        const userStr = localStorage.getItem('user');
        if (!userStr) {
          setCreatedCVsCount(0);
          setCreatedLimitReached(false);
          setLoadingCreatedLimit(false);
          return;
        }

        const user = JSON.parse(userStr);
        const res = await fetch(`${API_BASE_URL}/api/cv/user/${user.id}`);
        const data = await res.json();

        if (data.success && Array.isArray(data.cvs)) {
          const createdCount = data.cvs.filter(cv => cv.isCreated).length;
          setCreatedCVsCount(createdCount);
          setCreatedLimitReached(createdCount >= 3);
        } else {
          setCreatedCVsCount(0);
          setCreatedLimitReached(false);
        }
      } catch (error) {
        console.error('Error loading created CVs count:', error);
        setCreatedCVsCount(0);
        setCreatedLimitReached(false);
      } finally {
        setLoadingCreatedLimit(false);
      }
    };

    loadCreatedCVsCount();
  }, []);

  // Load CV data from backend
  const loadCVData = async () => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) return;

      const user = JSON.parse(userStr);
      const res = await fetch(`${API_BASE_URL}/api/cv-data/${user.id}`);
      const data = await res.json();

      if (data.success && data.cvData) {
        if (data.cvData.personalDetails) {
          setPersonalDetails(data.cvData.personalDetails);
        }
        if (data.cvData.cvContent) {
          // Only load if there's actual data, otherwise keep empty arrays
          if (data.cvData.cvContent.experience && data.cvData.cvContent.experience.length > 0) {
            setCvContent(prev => ({
              ...prev,
              experience: data.cvData.cvContent.experience,
            }));
          }
          if (data.cvData.cvContent.education && data.cvData.cvContent.education.length > 0) {
            setCvContent(prev => ({
              ...prev,
              education: data.cvData.cvContent.education,
            }));
          }
          if (data.cvData.cvContent.skills && data.cvData.cvContent.skills.length > 0) {
            setCvContent(prev => ({
              ...prev,
              skills: data.cvData.cvContent.skills,
            }));
          }
          if (data.cvData.cvContent.professionalSummary) {
            setCvContent(prev => ({
              ...prev,
              professionalSummary: data.cvData.cvContent.professionalSummary,
            }));
          }
        }
      }
    } catch (error) {
      console.error('Error loading CV data:', error);
    }
  };

  // Save CV data to backend (personal details and/or CV content)
  const saveCVData = async (dataToSave) => {
    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('Please log in to save your data.');
        return false;
      }

      const user = JSON.parse(userStr);
      const res = await fetch(`${API_BASE_URL}/api/cv-data`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          ...dataToSave,
        }),
      });

      const data = await res.json();
      return data.success;
    } catch (error) {
      console.error('Error saving CV data:', error);
      return false;
    }
  };

  const handleNext = async () => {
    if (currentStep === 2) {
      // Validate required fields
      if (!personalDetails.fullName.trim()) {
        alert('Please enter your full name.');
        return;
      }
      if (!personalDetails.email.trim()) {
        alert('Please enter your email.');
        return;
      }
      if (!personalDetails.summary.trim()) {
        alert('Please enter your About Me section.');
        return;
      }

      // Save personal details before moving to next step
      const saved = await saveCVData({ personalDetails });
      if (!saved) {
        alert('Failed to save personal details. Please try again.');
        return;
      }
    } else if (currentStep === 3) {
      // Save CV content before moving to next step
      const saved = await saveCVData({ cvContent });
      if (!saved) {
        alert('Failed to save CV content. Please try again.');
        return;
      }
    }

    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  // Load CV data when component mounts or step changes
  useEffect(() => {
    if (currentStep === 2 || currentStep === 3) {
      loadCVData();
    }
  }, [currentStep]);

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSaveCV = async () => {
    // Check if user already has 3 created CVs
    if (createdLimitReached) {
      alert('Maximum CV creation limit reached. You can only create 3 CVs. Created CVs cannot be deleted.');
      return;
    }

    try {
      const userStr = localStorage.getItem('user');
      if (!userStr) {
        alert('Please log in to save your CV.');
        return;
      }

      const user = JSON.parse(userStr);
      const template = templates.find(t => t.id === selectedTemplate);
      
      if (!template) {
        alert('Template not found');
        return;
      }

      // Get template component
      const templatesMap = {
        1: ModernProfessional,
        2: CreativeBold,
        3: MinimalistClean,
        4: ExecutiveElite,
      };
      const TemplateComponent = templatesMap[selectedTemplate];

      if (!TemplateComponent) {
        alert('Template component not found');
        return;
      }

      // Prepare template data
      const templateData = {
        name: personalDetails.fullName || 'Your Name',
        title: personalDetails.title || jobDetails.position || 'Your Title',
        email: personalDetails.email || 'your.email@example.com',
        phone: personalDetails.phone || '',
        location: personalDetails.city && personalDetails.country 
          ? `${personalDetails.city}, ${personalDetails.country}` 
          : personalDetails.city || personalDetails.country || '',
        linkedin: personalDetails.linkedIn || '',
        website: personalDetails.website || '',
        summary: cvContent.professionalSummary || personalDetails.summary || '',
        experience: (cvContent.experience || []).map(exp => ({
          position: exp.title,
          company: exp.company,
          period: exp.period,
          achievements: exp.responsibilities || [],
        })),
        education: (cvContent.education || []).map(edu => ({
          degree: edu.degree,
          institution: edu.institution,
          year: edu.year,
        })),
        skills: cvContent.skills || [],
      };

      // Create a temporary container for the CV
      const tempDiv = document.createElement('div');
      tempDiv.id = 'cv-save-container';
      tempDiv.style.position = 'fixed';
      tempDiv.style.top = '0';
      tempDiv.style.left = '0';
      tempDiv.style.width = '794px';
      tempDiv.style.height = 'auto';
      tempDiv.style.minHeight = '1123px';
      tempDiv.style.overflow = 'hidden';
      tempDiv.style.backgroundColor = 'white';
      tempDiv.style.zIndex = '99999';
      tempDiv.style.opacity = '0';
      tempDiv.style.pointerEvents = 'none';
      document.body.appendChild(tempDiv);

      // Render the template
      const root = createRoot(tempDiv);
      root.render(React.createElement(TemplateComponent, { data: templateData }));

      // Wait for React to render - multiple frames to ensure DOM is ready
      await new Promise(resolve => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              setTimeout(resolve, 1000);
            });
          });
        });
      });

      // Verify content is rendered
      const hasRenderedContent = tempDiv.querySelector('*');
      if (!hasRenderedContent) {
        throw new Error('CV content failed to render');
      }

      // Wait for all images to load
      const images = tempDiv.querySelectorAll('img');
      if (images.length > 0) {
        await Promise.all(
          Array.from(images).map(img => {
            if (img.complete) return Promise.resolve();
            return new Promise((resolve) => {
              img.onload = resolve;
              img.onerror = resolve;
              setTimeout(resolve, 3000);
            });
          })
        );
      }

      // Additional wait for fonts, styles, and layout
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Force layout recalculation
      tempDiv.getBoundingClientRect();

      // Make element temporarily visible for html2canvas (but still off-screen)
      tempDiv.style.opacity = '1';
      tempDiv.style.visibility = 'visible';
      
      // Wait a bit more for visibility to take effect
      await new Promise(resolve => setTimeout(resolve, 200));

      // Use html2canvas to capture the content
      const canvas = await html2canvas(tempDiv, {
        scale: 2,
        useCORS: true,
        logging: true, // Enable logging for debugging
        letterRendering: true,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794,
        height: tempDiv.scrollHeight || 1123
      });

      console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
      console.log('Element dimensions:', tempDiv.offsetWidth, 'x', tempDiv.offsetHeight);
      console.log('Element scrollHeight:', tempDiv.scrollHeight);

      // Check if canvas has content (check if there are non-white pixels)
      const ctx = canvas.getContext('2d');
      const imageData = ctx.getImageData(0, 0, Math.min(canvas.width, 100), Math.min(canvas.height, 100));
      let nonWhitePixels = 0;
      for (let i = 0; i < imageData.data.length; i += 4) {
        const r = imageData.data[i];
        const g = imageData.data[i + 1];
        const b = imageData.data[i + 2];
        const a = imageData.data[i + 3];
        // Check if pixel is not white/transparent
        if (a > 0 && (r < 250 || g < 250 || b < 250)) {
          nonWhitePixels++;
        }
      }

      if (nonWhitePixels === 0) {
        console.error('Canvas appears to be empty - no content detected');
        throw new Error('Failed to capture CV content - canvas is empty. Please check browser console for details.');
      }

      console.log('Non-white pixels found:', nonWhitePixels);

      // Convert canvas to image
      const imgData = canvas.toDataURL('image/png', 1.0);

      // A4 dimensions in pixels (at 96 DPI)
      const pdfWidth = 794;
      const pdfHeight = 1123;
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;

      // Calculate how many pages we need
      const imgAspectRatio = imgWidth / imgHeight;
      const pdfAspectRatio = pdfWidth / pdfHeight;
      
      // Scale to fit width
      const scale = pdfWidth / imgWidth;
      const scaledHeight = imgHeight * scale;
      const pagesNeeded = Math.ceil(scaledHeight / pdfHeight);

      // Create PDF
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [pdfWidth, pdfHeight],
        compress: true
      });

      // Add image to PDF, splitting across pages if needed
      let yPosition = 0;
      for (let page = 0; page < pagesNeeded; page++) {
        if (page > 0) {
          pdf.addPage();
        }
        
        const sourceY = (page * pdfHeight) / scale;
        const sourceHeight = Math.min(pdfHeight / scale, imgHeight - sourceY);
        const destHeight = sourceHeight * scale;
        
        // Create a temporary canvas for this page
        const pageCanvas = document.createElement('canvas');
        pageCanvas.width = imgWidth;
        pageCanvas.height = sourceHeight;
        const pageCtx = pageCanvas.getContext('2d');
        pageCtx.drawImage(canvas, 0, sourceY, imgWidth, sourceHeight, 0, 0, imgWidth, sourceHeight);
        
        const pageImgData = pageCanvas.toDataURL('image/png', 1.0);
        pdf.addImage(pageImgData, 'PNG', 0, 0, pdfWidth, destHeight);
      }

      // Generate PDF blob
      const pdfBlob = pdf.output('blob');
      const pdfFile = new File([pdfBlob], `${template.name || 'CV'}.pdf`, { type: 'application/pdf' });

      // Cleanup React render
      root.unmount();
      document.body.removeChild(tempDiv);

      // Create FormData to send PDF to backend
      const formData = new FormData();
      formData.append('cvFile', pdfFile);
      formData.append('userId', user.id);
      formData.append('cvName', template.name || 'Created CV');
      formData.append('isCreated', 'true'); // Mark as created CV

      // Upload PDF to backend
      const res = await fetch(`${API_BASE_URL}/api/cv/upload`, {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        alert('CV saved successfully!');
        navigate('/my-cvs');
      } else {
        alert(data.error || 'Failed to save CV. Please try again.');
      }
    } catch (error) {
      console.error('Error saving CV:', error);
      alert(`Failed to save CV: ${error.message || 'Unknown error'}`);
      // Cleanup on error
      const tempDiv = document.getElementById('cv-save-container');
      if (tempDiv && document.body.contains(tempDiv)) {
        document.body.removeChild(tempDiv);
      }
    }
  };

  const handleDownloadCV = () => {
    // Handle download CV logic here
    alert('Downloading CV...');
  };

  const handleSendApplication = () => {
    // Handle send application logic here
    alert('Application sent successfully!');
  };

  if (loadingCreatedLimit) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] p-6 text-center">
          <p className="text-sm sm:text-base dark:text-gray-300 text-gray-600">Checking your CV limit...</p>
        </div>
      </div>
    );
  }

  if (createdLimitReached) {
    return (
      <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)] p-6 text-center space-y-4">
          <h2 className="text-xl sm:text-2xl font-semibold dark:text-gray-200 text-gray-900">
            CV Creation Limit Reached
          </h2>
          <p className="text-sm sm:text-base dark:text-gray-300 text-gray-600">
            You have already created the maximum of 3 CVs. Please manage or use your existing CVs in the My CVs page before creating a new one.
          </p>
          <button
            onClick={() => navigate('/my-cvs')}
            className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors"
            style={{ backgroundColor: '#6CA6CD' }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = '#6CA6CD';
            }}
          >
            Go to My CVs
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 dark:text-gray-200 text-gray-900">
          Create Your CV
        </h1>
        <p className="text-sm sm:text-base dark:text-gray-400 text-gray-500">
          Follow the steps to create a tailored CV for your job application
        </p>
      </div>

      <Stepper steps={steps} currentStep={currentStep} />

      {/* Step 1: Select Template */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div 
            className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
                Choose a Template
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-3">
                {templates.map((template) => {
                  const TemplateComponent = template.component;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`group relative overflow-hidden rounded-lg border-2 transition-all ${
                        selectedTemplate === template.id
                          ? 'border-[#6CA6CD] shadow-md scale-105 dark:border-[#6CA6CD]'
                          : 'dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)] hover:border-[#6CA6CD]/50 dark:hover:border-[#6CA6CD]/50'
                      }`}
                    >
                      <div className="aspect-[794/1123] bg-white overflow-hidden w-full relative">
                        <img 
                          src={template.image} 
                          alt={template.name}
                          className="w-full h-full object-cover object-top"
                        />
                      </div>
                      <div className="p-1.5 sm:p-2 dark:bg-[#1A1F2E] bg-white border-t dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)]">
                        <p className="font-medium text-[10px] sm:text-xs mb-0.5 dark:text-gray-200 text-gray-900 truncate">{template.name}</p>
                        <p className="text-[9px] sm:text-[10px] dark:text-gray-400 text-gray-500 line-clamp-1">{template.description}</p>
                      </div>
                      {selectedTemplate === template.id && (
                        <div 
                          className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full text-white shadow-md z-10"
                          style={{ backgroundColor: '#6CA6CD' }}
                        >
                          <CheckIcon className="h-2.5 w-2.5" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Personal Details */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div 
            className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
                Personal Details
              </h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      placeholder="e.g., John Doe"
                      value={personalDetails.fullName}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, fullName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="title" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                      Professional Title
                    </label>
                    <input
                      id="title"
                      type="text"
                      placeholder="e.g., Senior Frontend Developer"
                      value={personalDetails.title}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                      Email <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="e.g., john.doe@example.com"
                      value={personalDetails.email}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="phone" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                      Phone Number
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      placeholder="e.g., +1 234 567 8900"
                      value={personalDetails.phone}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="city" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                      City
                    </label>
                    <input
                      id="city"
                      type="text"
                      placeholder="e.g., New York"
                      value={personalDetails.city}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, city: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="address" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Address
                  </label>
                  <input
                    id="address"
                    type="text"
                    placeholder="e.g., 123 Main Street"
                    value={personalDetails.address}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, address: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="country" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                      Country
                    </label>
                    <input
                      id="country"
                      type="text"
                      placeholder="e.g., United States"
                      value={personalDetails.country}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, country: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="postalCode" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                      Postal Code
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      placeholder="e.g., 10001"
                      value={personalDetails.postalCode}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, postalCode: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-2">
                    <label htmlFor="linkedIn" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                      LinkedIn Profile
                    </label>
                    <input
                      id="linkedIn"
                      type="url"
                      placeholder="e.g., https://linkedin.com/in/johndoe"
                      value={personalDetails.linkedIn}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, linkedIn: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="website" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                      Website/Portfolio
                    </label>
                    <input
                      id="website"
                      type="url"
                      placeholder="e.g., https://johndoe.com"
                      value={personalDetails.website}
                      onChange={(e) => setPersonalDetails({ ...personalDetails, website: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="summary" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    About Me <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="summary"
                    rows={4}
                    placeholder="Write a brief summary about yourself..."
                    value={personalDetails.summary}
                    onChange={(e) => setPersonalDetails({ ...personalDetails, summary: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 resize-none"
                    required
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Step 3: CV Content */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div 
            className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
                CV Content & Suggestions
              </h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="professionalSummary" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Professional Summary
                  </label>
                  <textarea
                    id="professionalSummary"
                    rows="4"
                    value={cvContent.professionalSummary}
                    onChange={(e) => setCvContent({ ...cvContent, professionalSummary: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 resize-none"
                    placeholder="Describe your professional background and key achievements..."
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium dark:text-gray-200 text-gray-900">
                      Work Experience
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setCvContent({
                          ...cvContent,
                          experience: [
                            ...cvContent.experience,
                            {
                              title: '',
                              company: '',
                              period: '',
                              responsibilities: [],
                            },
                          ],
                        });
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors flex items-center gap-1.5"
                      style={{ backgroundColor: '#6CA6CD' }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#6CA6CD';
                      }}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Experience
                    </button>
                  </div>
                  {cvContent.experience.map((exp, index) => (
                    <div key={index} className="p-4 rounded-xl border dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] space-y-3 relative">
                      {cvContent.experience.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newExp = cvContent.experience.filter((_, i) => i !== index);
                            setCvContent({ ...cvContent, experience: newExp });
                          }}
                          className="absolute top-3 right-3 p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Remove this experience"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-xs font-medium dark:text-gray-300 text-gray-700">Job Title</label>
                          <input
                            type="text"
                            value={exp.title}
                            onChange={(e) => {
                              const newExp = [...cvContent.experience];
                              newExp[index].title = e.target.value;
                              setCvContent({ ...cvContent, experience: newExp });
                            }}
                            className="w-full px-3 py-2 rounded-lg border transition-colors dark:bg-[#1A1F2E] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium dark:text-gray-300 text-gray-700">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              const newExp = [...cvContent.experience];
                              newExp[index].company = e.target.value;
                              setCvContent({ ...cvContent, experience: newExp });
                            }}
                            className="w-full px-3 py-2 rounded-lg border transition-colors dark:bg-[#1A1F2E] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 text-sm"
                          />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className="text-xs font-medium dark:text-gray-300 text-gray-700">Period</label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => {
                              const newExp = [...cvContent.experience];
                              newExp[index].period = e.target.value;
                              setCvContent({ ...cvContent, experience: newExp });
                            }}
                            placeholder="e.g., 2020 - Present"
                            className="w-full px-3 py-2 rounded-lg border transition-colors dark:bg-[#1A1F2E] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 text-sm"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-medium dark:text-gray-300 text-gray-700">Responsibilities (one per line)</label>
                        <textarea
                          rows="3"
                          value={exp.responsibilities.join('\n')}
                          onChange={(e) => {
                            const newExp = [...cvContent.experience];
                            newExp[index].responsibilities = e.target.value.split('\n').filter(line => line.trim());
                            setCvContent({ ...cvContent, experience: newExp });
                          }}
                          className="w-full px-3 py-2 rounded-lg border transition-colors dark:bg-[#1A1F2E] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 resize-none text-sm"
                          placeholder="Enter each responsibility on a new line"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium dark:text-gray-200 text-gray-900">
                      Education
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        setCvContent({
                          ...cvContent,
                          education: [
                            ...cvContent.education,
                            {
                              degree: '',
                              institution: '',
                              year: '',
                            },
                          ],
                        });
                      }}
                      className="px-3 py-1.5 text-xs font-medium rounded-lg text-white transition-colors flex items-center gap-1.5"
                      style={{ backgroundColor: '#6CA6CD' }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = '#6CA6CD';
                      }}
                    >
                      <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      Add Education
                    </button>
                  </div>
                  {cvContent.education.map((edu, index) => (
                    <div key={index} className="p-4 rounded-xl border dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] space-y-3 relative">
                      {cvContent.education.length > 1 && (
                        <button
                          type="button"
                          onClick={() => {
                            const newEdu = cvContent.education.filter((_, i) => i !== index);
                            setCvContent({ ...cvContent, education: newEdu });
                          }}
                          className="absolute top-3 right-3 p-1.5 rounded-lg text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                          title="Remove this education"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1H9a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        <div className="space-y-2">
                          <label className="text-xs font-medium dark:text-gray-300 text-gray-700">Education Level</label>
                          <input
                            type="text"
                            placeholder="e.g., Bachelor's, Master's, High School"
                            value={edu.degree}
                            onChange={(e) => {
                              const newEdu = [...cvContent.education];
                              newEdu[index].degree = e.target.value;
                              setCvContent({ ...cvContent, education: newEdu });
                            }}
                            className="w-full px-3 py-2 rounded-lg border transition-colors dark:bg-[#1A1F2E] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium dark:text-gray-300 text-gray-700">Institution</label>
                          <input
                            type="text"
                            value={edu.institution}
                            onChange={(e) => {
                              const newEdu = [...cvContent.education];
                              newEdu[index].institution = e.target.value;
                              setCvContent({ ...cvContent, education: newEdu });
                            }}
                            className="w-full px-3 py-2 rounded-lg border transition-colors dark:bg-[#1A1F2E] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 text-sm"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-xs font-medium dark:text-gray-300 text-gray-700">Year</label>
                          <input
                            type="text"
                            value={edu.year}
                            onChange={(e) => {
                              const newEdu = [...cvContent.education];
                              newEdu[index].year = e.target.value;
                              setCvContent({ ...cvContent, education: newEdu });
                            }}
                            className="w-full px-3 py-2 rounded-lg border transition-colors dark:bg-[#1A1F2E] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50 text-sm"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-2">
                  <label htmlFor="skills" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Skills (comma-separated)
                  </label>
                  <input
                    id="skills"
                    type="text"
                    value={cvContent.skills.join(', ')}
                    onChange={(e) => setCvContent({ ...cvContent, skills: e.target.value.split(',').map(s => s.trim()).filter(s => s) })}
                    placeholder="React, TypeScript, Node.js, CSS, Git"
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

        {/* Step 4: Preview & Download */}
        {currentStep === 4 && selectedTemplate && (
          <div className="space-y-4 sm:space-y-6">
          {/* CV Preview */}
          <div 
            className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold dark:text-gray-200 text-gray-900">CV Preview</h3>
                <FileTextIcon className="h-5 w-5 dark:text-gray-400 text-gray-500" />
              </div>
              <div className="rounded-xl border overflow-y-auto dark:bg-white bg-white dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] p-4 sm:p-6">
                <style>{`
                  @media print {
                    .cv-page, .cv-page-a4 {
                      page-break-after: always;
                      page-break-inside: avoid;
                      break-after: page;
                      break-inside: avoid;
                    }
                    .cv-page:last-child, .cv-page-a4:last-child {
                      page-break-after: auto;
                      break-after: auto;
                    }
                    @page {
                      size: A4;
                      margin: 0;
                    }
                  }
                  .cv-page {
                    width: 794px;
                    height: 1123px;
                    min-height: 1123px;
                    margin: 0 auto 20px;
                    box-shadow: 0 0 10px rgba(0,0,0,0.1);
                    background: white;
                    position: relative;
                    page-break-after: always;
                    page-break-inside: avoid;
                  }
                  .cv-page::after {
                    content: '';
                    position: absolute;
                    bottom: -10px;
                    left: 0;
                    right: 0;
                    height: 1px;
                    background: #e5e7eb;
                  }
                  .cv-page-a4 {
                    page-break-after: always;
                    page-break-inside: avoid;
                  }
                `}</style>
                <div className="flex justify-center">
                  <div className="cv-preview-container" style={{ transform: 'scale(0.8)', transformOrigin: 'top center', maxWidth: '100%' }}>
                    {(() => {
                      const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
                      const TemplateComponent = selectedTemplateData?.component;
                      if (!TemplateComponent) return null;
                      
                      // Load personal details and CV content
                      const userStr = localStorage.getItem('user');
                      let personalData = {};
                      if (userStr) {
                        try {
                          const user = JSON.parse(userStr);
                          // Try to get personal details from state or load from backend
                          personalData = personalDetails;
                        } catch (e) {}
                      }
                      
                      // Transform cvContent to match template data structure
                      const templateData = {
                        name: personalData.fullName || 'Your Name',
                        title: personalData.title || jobDetails.position || 'Your Title',
                        email: personalData.email || 'your.email@example.com',
                        phone: personalData.phone || '',
                        location: personalData.city && personalData.country 
                          ? `${personalData.city}, ${personalData.country}` 
                          : personalData.city || personalData.country || '',
                        linkedin: personalData.linkedIn || '',
                        website: personalData.website || '',
                        summary: cvContent.professionalSummary || personalData.summary || '',
                        experience: cvContent.experience.map(exp => ({
                          position: exp.title,
                          company: exp.company,
                          period: exp.period,
                          achievements: exp.responsibilities,
                        })),
                        education: cvContent.education.map(edu => ({
                          degree: edu.degree,
                          institution: edu.institution,
                          year: edu.year,
                        })),
                        skills: cvContent.skills,
                      };
                      
                      return (
                        <div className="cv-page">
                          <TemplateComponent data={templateData} />
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cover Letter */}
          <div 
            className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-4 sm:p-6">
              <h3 className="text-lg font-semibold mb-4 dark:text-gray-200 text-gray-900">
                Generated Cover Letter
              </h3>
              <textarea
                className="w-full min-h-[600px] px-4 py-3 rounded-xl border resize-none transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                value={`Dear Hiring Manager,

I am writing to express my strong interest in the ${jobDetails.position || 'Senior Frontend Developer'} position at ${jobDetails.company || 'Tech Corp Inc.'}. With over ${jobDetails.experience || '5'} years of experience in ${jobDetails.requiredSkills || 'React, TypeScript, and modern web development'}, I am confident in my ability to contribute to your team.

Throughout my career, I have consistently delivered high-quality, scalable applications and improved performance metrics. My expertise aligns perfectly with your requirements, and I am excited about the opportunity to bring my skills to your organization.

I would welcome the opportunity to discuss how my background and skills would benefit your team.

Thank you for your consideration.

Best regards,
John Doe`}
                readOnly
              />
            </div>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <div className="flex gap-3">
          {currentStep === 4 ? (
            <>
              <button
                onClick={handleSaveCV}
                className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)] flex items-center gap-2"
              >
                Save CV
              </button>
              <button
                onClick={handleDownloadCV}
                className="px-6 py-2.5 rounded-xl text-sm font-medium border transition-colors dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 hover:bg-gray-50 dark:hover:bg-[rgba(108,166,205,0.1)] flex items-center gap-2"
              >
                <DownloadIcon className="h-4 w-4" />
                Download CV
              </button>
              <button
                onClick={handleSendApplication}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors flex items-center gap-2"
                style={{ backgroundColor: '#6CA6CD' }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#6CA6CD';
                }}
              >
                <SendIcon className="h-4 w-4" />
                Send Application
              </button>
            </>
          ) : (
            <button
              onClick={handleNext}
              disabled={currentStep === 1 && !selectedTemplate}
              className="px-6 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ backgroundColor: '#6CA6CD' }}
              onMouseEnter={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = 'rgba(108, 166, 205, 0.9)';
                }
              }}
              onMouseLeave={(e) => {
                if (!e.target.disabled) {
                  e.target.style.backgroundColor = '#6CA6CD';
                }
              }}
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default CreateCVPage;

