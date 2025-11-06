import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Stepper from '../components/Stepper';
import { ModernProfessional } from '../components/cv-templates/ModernProfessional';
import { CreativeBold } from '../components/cv-templates/CreativeBold';
import { MinimalistClean } from '../components/cv-templates/MinimalistClean';
import { ExecutiveElite } from '../components/cv-templates/ExecutiveElite';

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
  { id: 2, title: 'Job Details', description: 'Add job info' },
  { id: 3, title: 'CV Content', description: 'Edit CV details' },
  { id: 4, title: 'Preview & Download', description: 'Review and download' },
];

const templates = [
  { id: 1, name: 'Modern Professional', component: ModernProfessional, description: 'Clean design with blue accents' },
  { id: 2, name: 'Creative Bold', component: CreativeBold, description: 'Vibrant purple sidebar layout' },
  { id: 3, name: 'Minimalist Clean', component: MinimalistClean, description: 'Ultra-minimal centered design' },
  { id: 4, name: 'Executive Elite', component: ExecutiveElite, description: 'Premium dark theme with gold' },
];

function CreateCVPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [jobDetails, setJobDetails] = useState({
    position: '',
    company: '',
    requiredSkills: '',
    experience: '',
    jobLink: '',
  });
  const [cvContent, setCvContent] = useState({
    professionalSummary: 'Experienced frontend developer with 5+ years of expertise in React, TypeScript, and modern web technologies. Proven track record of delivering high-quality, scalable applications.',
    experience: [
      {
        title: 'Senior Developer',
        company: 'Tech Corp',
        period: '2020 - Present',
        responsibilities: ['Led development of customer-facing applications', 'Improved application performance by 40%'],
      },
    ],
    education: [
      {
        degree: 'B.S. Computer Science',
        institution: 'University Name',
        year: '2018',
      },
    ],
    skills: ['React', 'TypeScript', 'Node.js', 'CSS', 'Git'],
  });

  const handleNext = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
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
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                {templates.map((template) => {
                  const TemplateComponent = template.component;
                  return (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`group relative overflow-hidden rounded-2xl border-2 transition-all ${
                        selectedTemplate === template.id
                          ? 'border-[#6CA6CD] shadow-lg scale-105 dark:border-[#6CA6CD]'
                          : 'dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)] hover:border-[#6CA6CD]/50 dark:hover:border-[#6CA6CD]/50'
                      }`}
                    >
                      <div className="aspect-[794/1123] bg-white overflow-hidden">
                        <div className="origin-top-left" style={{ transform: 'scale(0.19)', width: '794px', height: '1123px' }}>
                          <TemplateComponent />
                        </div>
                      </div>
                      <div className="p-4 dark:bg-[#1A1F2E] bg-white border-t dark:border-[rgba(108,166,205,0.25)] border-[rgba(108,166,205,0.15)]">
                        <p className="font-medium text-sm mb-1 dark:text-gray-200 text-gray-900">{template.name}</p>
                        <p className="text-xs dark:text-gray-400 text-gray-500">{template.description}</p>
                      </div>
                      {selectedTemplate === template.id && (
                        <div 
                          className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full text-white shadow-lg z-10"
                          style={{ backgroundColor: '#6CA6CD' }}
                        >
                          <CheckIcon className="h-4 w-4" />
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

      {/* Step 2: Job Details */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div 
            className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-6 sm:p-8">
              <h3 className="text-lg font-semibold mb-6 dark:text-gray-200 text-gray-900">
                Job Vacancy Details
              </h3>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="space-y-2">
                  <label htmlFor="position" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Position Title
                  </label>
                  <input
                    id="position"
                    type="text"
                    placeholder="e.g., Senior Frontend Developer"
                    value={jobDetails.position}
                    onChange={(e) => setJobDetails({ ...jobDetails, position: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Company Name
                  </label>
                  <input
                    id="company"
                    type="text"
                    placeholder="e.g., Tech Corp Inc."
                    value={jobDetails.company}
                    onChange={(e) => setJobDetails({ ...jobDetails, company: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="requiredSkills" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Required Skills
                  </label>
                  <input
                    id="requiredSkills"
                    type="text"
                    placeholder="React, TypeScript, Node.js"
                    value={jobDetails.requiredSkills}
                    onChange={(e) => setJobDetails({ ...jobDetails, requiredSkills: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="experience" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Years of Experience
                  </label>
                  <input
                    id="experience"
                    type="text"
                    placeholder="e.g., 5+"
                    value={jobDetails.experience}
                    onChange={(e) => setJobDetails({ ...jobDetails, experience: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="jobLink" className="text-sm font-medium dark:text-gray-200 text-gray-900">
                    Job Posting Link (Optional)
                  </label>
                  <input
                    id="jobLink"
                    type="url"
                    placeholder="https://example.com/job"
                    value={jobDetails.jobLink}
                    onChange={(e) => setJobDetails({ ...jobDetails, jobLink: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl border transition-colors dark:bg-[#0F1419] dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] dark:text-gray-200 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#6CA6CD] focus:ring-opacity-50"
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
                          <label className="text-xs font-medium dark:text-gray-300 text-gray-700">Degree</label>
                          <input
                            type="text"
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* CV Preview */}
          <div 
            className="rounded-xl shadow-sm dark:bg-[#1A1F2E] bg-white dark:border dark:border-[rgba(108,166,205,0.2)]"
          >
            <div className="p-4 sm:p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold dark:text-gray-200 text-gray-900">CV Preview</h3>
                <FileTextIcon className="h-5 w-5 dark:text-gray-400 text-gray-500" />
              </div>
              <div className="rounded-xl border overflow-y-auto dark:bg-white bg-white dark:border-[rgba(108,166,205,0.2)] border-[rgba(108,166,205,0.15)] p-4">
                <div className="flex justify-center">
                  <div style={{ transform: 'scale(0.6)', transformOrigin: 'top center' }}>
                    {(() => {
                      const selectedTemplateData = templates.find(t => t.id === selectedTemplate);
                      const TemplateComponent = selectedTemplateData?.component;
                      if (!TemplateComponent) return null;
                      
                      // Transform cvContent to match template data structure
                      const templateData = {
                        name: 'John Doe',
                        title: jobDetails.position || 'Senior Frontend Developer',
                        email: 'john@example.com',
                        phone: '+1 234 567 8900',
                        location: 'New York, NY',
                        summary: cvContent.professionalSummary,
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
                      
                      return <TemplateComponent data={templateData} />;
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

