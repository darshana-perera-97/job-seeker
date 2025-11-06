export function MinimalistClean({ data }) {
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
    <div className="bg-white p-12" style={{ width: '794px', height: '1123px', minHeight: '1123px' }}>
      {/* Header - Ultra Minimal */}
      <div className="text-center mb-12 pb-8 border-b" style={{ borderColor: '#C3CEDA' }}>
        <h1 className="text-4xl mb-3 tracking-tight text-gray-900">{cvData.name}</h1>
        <p className="text-xl mb-4" style={{ color: '#C3CEDA' }}>{cvData.title}</p>
        <div className="flex justify-center gap-6 text-sm text-gray-600">
          <span>{cvData.email}</span>
          <span>•</span>
          <span>{cvData.phone}</span>
          <span>•</span>
          <span>{cvData.location}</span>
        </div>
      </div>

      {/* Summary */}
      <section className="mb-10">
        <p className="text-gray-700 leading-relaxed text-center max-w-3xl mx-auto">
          {cvData.summary}
        </p>
      </section>

      {/* Experience */}
      <section className="mb-10">
        <h2 className="text-sm uppercase tracking-widest mb-6 text-center" style={{ color: '#C3CEDA' }}>
          Experience
        </h2>
        <div className="space-y-8 max-w-3xl mx-auto">
          {cvData.experience?.map((exp, index) => (
            <div key={index} className="relative">
              <div className="flex justify-between items-baseline mb-2">
                <h3 className="text-lg text-gray-900">{exp.position}</h3>
                <span className="text-sm text-gray-500">{exp.period}</span>
              </div>
              <p className="text-gray-600 mb-3">{exp.company}</p>
              <ul className="space-y-2 text-gray-700">
                {exp.achievements.map((achievement, i) => (
                  <li key={i} className="pl-4 relative">
                    <div className="absolute left-0 top-2.5 w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#C3CEDA' }}></div>
                    {achievement}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Education */}
      <section className="mb-10">
        <h2 className="text-sm uppercase tracking-widest mb-6 text-center" style={{ color: '#C3CEDA' }}>
          Education
        </h2>
        <div className="space-y-4 max-w-3xl mx-auto">
          {cvData.education?.map((edu, index) => (
            <div key={index} className="flex justify-between items-baseline">
              <div>
                <h3 className="text-lg text-gray-900">{edu.degree}</h3>
                <p className="text-gray-600">{edu.institution}</p>
              </div>
              <span className="text-sm text-gray-500">{edu.year}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Skills */}
      <section>
        <h2 className="text-sm uppercase tracking-widest mb-6 text-center" style={{ color: '#C3CEDA' }}>
          Skills
        </h2>
        <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
          {cvData.skills?.map((skill, index) => (
            <span
              key={index}
              className="px-4 py-1 text-sm text-gray-700 border rounded-full"
              style={{ borderColor: '#C3CEDA' }}
            >
              {skill}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

