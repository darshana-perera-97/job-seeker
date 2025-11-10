// SVG Icons
function MailIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function PhoneIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
    </svg>
  );
}

function MapPinIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  );
}

function LinkedinIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  );
}

export function ExecutiveElite({ data }) {
  const defaultData = {
    name: "John Doe",
    title: "Senior Frontend Developer",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    location: "New York, NY",
    linkedin: "linkedin.com/in/johndoe",
    summary: "Experienced frontend developer with 5+ years of expertise in React, TypeScript, and modern web technologies. Proven track record of delivering high-quality, scalable applications with focus on user experience and performance optimization.",
    experience: [
      {
        position: "Senior Frontend Developer",
        company: "Tech Corp Inc.",
        period: "2020 - Present",
        achievements: [
          "Led development of customer-facing applications serving 1M+ users",
          "Improved application performance by 40% through code optimization",
          "Mentored junior developers and conducted code reviews",
        ],
      },
      {
        position: "Frontend Developer",
        company: "Digital Solutions Ltd.",
        period: "2018 - 2020",
        achievements: [
          "Developed responsive web applications using React and TypeScript",
          "Implemented CI/CD pipelines reducing deployment time by 60%",
        ],
      },
    ],
    education: [
      {
        degree: "B.S. Computer Science",
        institution: "University of Technology",
        year: "2018",
      },
    ],
    skills: ["React", "TypeScript", "Node.js", "Next.js", "Tailwind CSS", "Git", "REST APIs", "GraphQL"],
  };

  const cvData = { ...defaultData, ...data };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-white cv-page-a4" style={{ width: '794px', height: '1123px', minHeight: '1123px', pageBreakAfter: 'always', pageBreakInside: 'avoid' }}>
      {/* Elegant Header with Gold Accent */}
      <div className="relative bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 text-white p-10">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400"></div>
        <div className="max-w-4xl mx-auto">
          <div className="mb-1">
            <h1 className="text-5xl mb-3 tracking-wide">{cvData.name}</h1>
            <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-yellow-500 mb-4"></div>
            <p className="text-xl text-gray-300 tracking-wide">{cvData.title}</p>
          </div>
        </div>
      </div>

      {/* Contact Bar */}
      <div className="bg-white border-b-2 border-gray-200">
        <div className="max-w-4xl mx-auto px-10 py-5">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {cvData.email && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                  <MailIcon className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700">{cvData.email}</span>
              </div>
            )}
            {cvData.phone && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                  <PhoneIcon className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700">{cvData.phone}</span>
              </div>
            )}
            {cvData.location && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                  <MapPinIcon className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700">{cvData.location}</span>
              </div>
            )}
            {cvData.linkedin && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-yellow-500 flex items-center justify-center">
                  <LinkedinIcon className="h-4 w-4 text-white" />
                </div>
                <span className="text-gray-700 truncate">{cvData.linkedin}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-10 py-8 space-y-8">
        {/* Executive Summary */}
        <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-shrink-0 w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full"></div>
            <h2 className="text-2xl text-gray-900 tracking-wide">Executive Summary</h2>
          </div>
          <div className="pl-6">
            <p className="text-gray-700 leading-relaxed text-justify">
              {cvData.summary}
            </p>
          </div>
        </section>

        {/* Professional Experience */}
        <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-shrink-0 w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full"></div>
            <h2 className="text-2xl text-gray-900 tracking-wide">Professional Experience</h2>
          </div>
          <div className="space-y-6 pl-6">
            {cvData.experience?.map((exp, index) => (
              <div
                key={index}
                className="bg-white rounded-lg p-6 border-l-4 border-amber-400 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-xl text-gray-900 mb-1">{exp.position}</h3>
                    <p className="text-gray-600 italic">{exp.company}</p>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-yellow-50 px-4 py-2 rounded-lg border border-amber-200">
                    <span className="text-sm text-gray-700">{exp.period}</span>
                  </div>
                </div>
                <ul className="space-y-2 text-gray-700 mt-4">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex gap-3">
                      <span className="text-amber-500 mt-1.5 flex-shrink-0">◆</span>
                      <span className="leading-relaxed">{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-shrink-0 w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full"></div>
            <h2 className="text-2xl text-gray-900 tracking-wide">Education</h2>
          </div>
          <div className="space-y-4 pl-6">
            {cvData.education?.map((edu, index) => (
              <div
                key={index}
                className="bg-gradient-to-r from-amber-50/50 to-transparent rounded-lg p-5 border border-amber-100"
              >
                <div className="flex justify-between items-baseline">
                  <div>
                    <h3 className="text-lg text-gray-900 mb-1">{edu.degree}</h3>
                    <p className="text-gray-600">{edu.institution}</p>
                  </div>
                  <span className="text-gray-500">{edu.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Core Competencies */}
        <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <div className="flex items-center gap-4 mb-5">
            <div className="flex-shrink-0 w-2 h-8 bg-gradient-to-b from-amber-400 to-yellow-500 rounded-full"></div>
            <h2 className="text-2xl text-gray-900 tracking-wide">Core Competencies</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pl-6">
            {cvData.skills?.map((skill, index) => (
              <div
                key={index}
                className="bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg px-4 py-3 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <span className="text-gray-800">{skill}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Footer Accent */}
      <div className="h-2 bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 mt-8"></div>
    </div>
  );
}

