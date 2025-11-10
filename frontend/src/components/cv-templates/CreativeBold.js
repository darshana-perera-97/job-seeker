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

function AwardIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
    </svg>
  );
}

function BriefcaseIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function GraduationCapIcon({ className }) {
  return (
    <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l9-5-9-5-9 5 9 5z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14v6" />
    </svg>
  );
}

export function CreativeBold({ data }) {
  const defaultData = {
    name: "John Doe",
    title: "Senior Frontend Developer",
    email: "john@example.com",
    phone: "+1 234 567 8900",
    location: "New York, NY",
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
    <div className="bg-white flex cv-page-a4" style={{ width: '794px', height: '1123px', minHeight: '1123px', pageBreakAfter: 'always', pageBreakInside: 'avoid' }}>
      {/* Left Sidebar - Purple Theme */}
      <div className="w-1/3 bg-gradient-to-b from-[#B2A5FF] to-[#9B8CED] text-white p-8">
        {/* Profile Circle */}
        <div className="mb-8">
          <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center mx-auto border-4 border-white/30">
            <span className="text-5xl">
              {cvData.name?.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
        </div>

        {/* Contact */}
        <section className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-1 bg-white rounded-full"></div>
            <h3 className="text-lg">Contact</h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <MailIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="break-all">{cvData.email}</span>
            </div>
            <div className="flex items-start gap-3">
              <PhoneIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{cvData.phone}</span>
            </div>
            <div className="flex items-start gap-3">
              <MapPinIcon className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>{cvData.location}</span>
            </div>
          </div>
        </section>

        {/* Skills */}
        <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <div className="flex items-center gap-2 mb-4">
            <div className="h-8 w-1 bg-white rounded-full"></div>
            <h3 className="text-lg">Skills</h3>
          </div>
          <div className="space-y-2">
            {cvData.skills?.map((skill, index) => (
              <div key={index} className="bg-white/20 backdrop-blur-sm rounded-lg px-3 py-2 text-sm border border-white/30">
                {skill}
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Right Content Area */}
      <div className="w-2/3 p-8">
        {/* Header */}
        <div className="mb-8 border-b-2 pb-6" style={{ borderColor: '#B2A5FF' }}>
          <h1 className="text-4xl mb-2 bg-gradient-to-r from-[#B2A5FF] to-[#9B8CED] bg-clip-text text-transparent">
            {cvData.name}
          </h1>
          <p className="text-2xl text-gray-700">{cvData.title}</p>
        </div>

        {/* Summary */}
        <section className="mb-8" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <div className="flex items-center gap-3 mb-3">
            <AwardIcon className="h-6 w-6" style={{ color: '#B2A5FF' }} />
            <h2 className="text-xl text-gray-900">About Me</h2>
          </div>
          <p className="text-gray-700 leading-relaxed pl-9">{cvData.summary}</p>
        </section>

        {/* Experience */}
        <section className="mb-8" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <div className="flex items-center gap-3 mb-4">
            <BriefcaseIcon className="h-6 w-6" style={{ color: '#B2A5FF' }} />
            <h2 className="text-xl text-gray-900">Experience</h2>
          </div>
          <div className="space-y-6 pl-9">
            {cvData.experience?.map((exp, index) => (
              <div key={index} className="relative pl-6">
                <div className="absolute left-[-25px] top-2 w-3 h-3 rounded-full border-4 border-white shadow-md" style={{ backgroundColor: '#B2A5FF' }}></div>
                <div className="mb-2">
                  <h3 className="font-semibold text-gray-900">{exp.position}</h3>
                  <div className="flex justify-between items-center">
                    <span style={{ color: '#B2A5FF' }}>{exp.company}</span>
                    <span className="text-sm text-gray-600 italic">{exp.period}</span>
                  </div>
                </div>
                <ul className="space-y-1 text-gray-700 text-sm">
                  {exp.achievements.map((achievement, i) => (
                    <li key={i} className="flex gap-2">
                      <span style={{ color: '#B2A5FF' }}>▸</span>
                      <span>{achievement}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </section>

        {/* Education */}
        <section style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
          <div className="flex items-center gap-3 mb-4">
            <GraduationCapIcon className="h-6 w-6" style={{ color: '#B2A5FF' }} />
            <h2 className="text-xl text-gray-900">Education</h2>
          </div>
          <div className="space-y-3 pl-9">
            {cvData.education?.map((edu, index) => (
              <div key={index} className="bg-gradient-to-r from-[#B2A5FF]/5 to-transparent rounded-lg p-3 border-l-4" style={{ borderColor: '#B2A5FF' }}>
                <h3 className="font-semibold text-gray-900">{edu.degree}</h3>
                <div className="flex justify-between text-gray-700 text-sm">
                  <span>{edu.institution}</span>
                  <span className="text-gray-600">{edu.year}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

