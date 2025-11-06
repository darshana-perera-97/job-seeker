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

function GlobeIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
    </svg>
  );
}

export function ModernProfessional({ data }) {
  const defaultData = {
    name: "John Doe",
    title: "Senior Frontend Developer",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    location: "New York, NY",
    linkedin: "linkedin.com/in/johndoe",
    website: "johndoe.com",
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
    <div className="bg-white" style={{ width: '794px', height: '1123px', minHeight: '1123px' }}>
      {/* Header with accent bar */}
      <div className="bg-gradient-to-r from-[#6CA6CD] to-[#5090B8] p-8 text-white">
        <h1 className="text-4xl mb-2">{cvData.name}</h1>
        <p className="text-xl opacity-90">{cvData.title}</p>
      </div>

      {/* Contact Information */}
      <div className="bg-gradient-to-r from-gray-50 to-white border-b border-gray-200 px-8 py-4">
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <MailIcon className="h-4 w-4" style={{ color: '#6CA6CD' }} />
            <span>{cvData.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <PhoneIcon className="h-4 w-4" style={{ color: '#6CA6CD' }} />
            <span>{cvData.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="h-4 w-4" style={{ color: '#6CA6CD' }} />
            <span>{cvData.location}</span>
          </div>
          <div className="flex items-center gap-2">
            <LinkedinIcon className="h-4 w-4" style={{ color: '#6CA6CD' }} />
            <span>{cvData.linkedin}</span>
          </div>
          <div className="flex items-center gap-2">
            <GlobeIcon className="h-4 w-4" style={{ color: '#6CA6CD' }} />
            <span>{cvData.website}</span>
          </div>
        </div>
      </div>

      <div className="p-8 space-y-6">
        {/* Professional Summary */}
        <section>
          <h2 className="text-xl border-l-4 pl-4 mb-3" style={{ borderColor: '#6CA6CD' }}>
            Professional Summary
          </h2>
          <p className="text-gray-700 leading-relaxed pl-5">{cvData.summary}</p>
        </section>

        {/* Experience */}
        <section>
          <h2 className="text-xl border-l-4 pl-4 mb-4" style={{ borderColor: '#6CA6CD' }}>
            Professional Experience
          </h2>
          <div className="space-y-4 pl-5">
            {cvData.experience?.map((exp, index) => (
              <div key={index} className="relative">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                    <p style={{ color: '#6CA6CD' }}>{exp.company}</p>
                  </div>
                  <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-1 text-gray-700">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex gap-2">
                      <span style={{ color: '#6CA6CD' }} className="mt-1.5">•</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section>
          <h2 className="text-xl border-l-4 pl-4 mb-4" style={{ borderColor: '#6CA6CD' }}>Education</h2>
          <div className="space-y-3 pl-5">
            {cvData.education?.map((edu, index) => (
              <div key={index}>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <div className="flex justify-between text-gray-700">
                  <span>{edu.institution}</span>
                  <span className="text-gray-600">{edu.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Skills */}
        <section>
          <h2 className="text-xl border-l-4 pl-4 mb-4" style={{ borderColor: '#6CA6CD' }}>Skills</h2>
          <div className="flex flex-wrap gap-2 pl-5">
            {cvData.skills?.map((skill, index) => (
              <span
                key={index}
                className="px-4 py-2 rounded-lg border"
                style={{
                  background: 'linear-gradient(to right, rgba(108, 166, 205, 0.1), rgba(108, 166, 205, 0.05))',
                  color: '#6CA6CD',
                  borderColor: 'rgba(108, 166, 205, 0.2)'
                }}
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

