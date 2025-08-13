import { RequestHandler } from "express";
import Resume from "../models/Resume";
import connectToDatabase from "../utils/database";

// Helper function to check if MongoDB is available
async function isMongoDBAvailable(): Promise<boolean> {
  try {
    await connectToDatabase();
    return true;
  } catch (error) {
    console.warn(
      "MongoDB not available, using mock ATS analysis for development",
    );
    return false;
  }
}

// Mock ATS calculation for development
function calculateMockATSScore(resumeData: any) {
  let contactInfoScore = 0;
  let keywordsScore = 0;
  let formatScore = 0;
  let experienceScore = 0;
  let skillsScore = 0;
  const suggestions: string[] = [];

  // Contact Info Score (20 points)
  const personalInfo = resumeData.personalInfo;
  if (personalInfo?.fullName) contactInfoScore += 5;
  if (personalInfo?.email) contactInfoScore += 5;
  if (personalInfo?.phone) contactInfoScore += 5;
  if (personalInfo?.location) contactInfoScore += 5;

  if (!personalInfo?.linkedin)
    suggestions.push("Add LinkedIn profile for better visibility");
  if (
    !personalInfo?.github &&
    resumeData.skills?.some((skill: string) =>
      ["javascript", "python", "java", "react", "node"].includes(
        skill.toLowerCase(),
      ),
    )
  ) {
    suggestions.push("Add GitHub profile to showcase your technical projects");
  }

  // Keywords Score (25 points)
  const keywordCount = resumeData.skills?.length || 0;
  keywordsScore = Math.min(keywordCount * 2, 25);
  if (keywordCount < 10)
    suggestions.push("Add more relevant keywords to improve ATS visibility");

  // Format Score (20 points)
  if (
    resumeData.professionalSummary &&
    resumeData.professionalSummary.length >= 100
  )
    formatScore += 5;
  else
    suggestions.push("Add a professional summary of at least 100 characters");

  if (resumeData.workExperience?.length > 0) formatScore += 5;
  else suggestions.push("Add work experience to strengthen your resume");

  if (resumeData.education?.length > 0) formatScore += 5;
  else suggestions.push("Add education information");

  if (resumeData.skills?.length >= 5) formatScore += 5;
  else suggestions.push("Add at least 5 relevant skills");

  // Experience Score (20 points)
  const expScore =
    resumeData.workExperience?.reduce((score: number, exp: any) => {
      let expPoints = 0;
      if (exp.description && exp.description.length >= 100) expPoints += 3;
      if (exp.position && exp.company) expPoints += 2;
      return score + Math.min(expPoints, 5);
    }, 0) || 0;
  experienceScore = Math.min(expScore, 20);

  if (
    resumeData.workExperience?.some(
      (exp: any) => !exp.description || exp.description.length < 100,
    )
  ) {
    suggestions.push(
      "Provide detailed job descriptions with quantifiable achievements",
    );
  }

  // Skills Score (15 points)
  skillsScore = Math.min((resumeData.skills?.length || 0) * 1.5, 15);
  if ((resumeData.skills?.length || 0) < 8)
    suggestions.push("Add more relevant skills (aim for 8-12 skills)");

  const totalScore =
    contactInfoScore +
    keywordsScore +
    formatScore +
    experienceScore +
    skillsScore;

  return {
    totalScore: Math.round(totalScore),
    contactInfoScore: Math.round(contactInfoScore),
    keywordsScore: Math.round(keywordsScore),
    formatScore: Math.round(formatScore),
    experienceScore: Math.round(experienceScore),
    skillsScore: Math.round(skillsScore),
    suggestions,
    lastUpdated: new Date(),
  };
}

// Analyze resume for ATS compatibility
export const analyzeResume: RequestHandler = async (req, res) => {
  try {
    const resumeData = req.body;

    const mongoAvailable = await isMongoDBAvailable();

    if (mongoAvailable) {
      // Use MongoDB and Resume model
      const tempResume = new Resume(resumeData);
      const atsScore = tempResume.calculateATSScore();

      // Additional ATS analysis
      const analysis = {
        atsScore,
        recommendations: generateRecommendations(resumeData, atsScore),
        keywordAnalysis: analyzeKeywords(resumeData),
        formatAnalysis: analyzeFormat(resumeData),
        industryBenchmark: getIndustryBenchmark(atsScore.totalScore),
      };

      res.json({
        success: true,
        data: analysis,
      });
    } else {
      // Use mock ATS calculation
      const atsScore = calculateMockATSScore(resumeData);

      const analysis = {
        atsScore,
        recommendations: generateRecommendations(resumeData, atsScore),
        keywordAnalysis: analyzeKeywords(resumeData),
        formatAnalysis: analyzeFormat(resumeData),
        industryBenchmark: getIndustryBenchmark(atsScore.totalScore),
      };

      res.json({
        success: true,
        data: analysis,
        message: "ATS analysis completed (dev mode)",
      });
    }
  } catch (error) {
    console.error("Error analyzing resume:", error);
    res.status(500).json({
      success: false,
      message: "Failed to analyze resume",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get ATS-friendly keywords for a specific industry
export const getIndustryKeywords: RequestHandler = async (req, res) => {
  try {
    const { industry, role } = req.query;

    const keywords = getKeywordsForIndustry(industry as string, role as string);

    res.json({
      success: true,
      data: {
        industry: industry || "general",
        role: role || "general",
        keywords,
        totalCount: keywords.length,
      },
    });
  } catch (error) {
    console.error("Error fetching industry keywords:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch industry keywords",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Suggest improvements for ATS score
export const suggestImprovements: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();

    const { id } = req.params;
    const resume = await Resume.findById(id);

    if (!resume) {
      return res.status(404).json({
        success: false,
        message: "Resume not found",
      });
    }

    const improvements = generateDetailedImprovements(resume);

    res.json({
      success: true,
      data: improvements,
    });
  } catch (error) {
    console.error("Error generating improvements:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate improvements",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Helper function to generate recommendations
function generateRecommendations(resumeData: any, atsScore: any): string[] {
  const recommendations: string[] = [];

  // Contact information recommendations
  if (atsScore.contactInfoScore < 15) {
    recommendations.push(
      "Ensure all contact information is complete and properly formatted",
    );
  }

  // Keywords recommendations
  if (atsScore.keywordsScore < 20) {
    recommendations.push(
      "Include more industry-specific keywords and technical skills",
    );
    recommendations.push(
      "Use keywords from the job description you're applying for",
    );
  }

  // Format recommendations
  if (atsScore.formatScore < 15) {
    recommendations.push(
      "Use a clean, simple format that ATS systems can easily parse",
    );
    recommendations.push("Avoid complex layouts, graphics, and unusual fonts");
  }

  // Experience recommendations
  if (atsScore.experienceScore < 15) {
    recommendations.push(
      "Provide more detailed job descriptions with quantifiable achievements",
    );
    recommendations.push(
      "Use action verbs and specific metrics in your experience section",
    );
  }

  // Skills recommendations
  if (atsScore.skillsScore < 10) {
    recommendations.push("Add more relevant technical and soft skills");
    recommendations.push(
      "Include both hard and soft skills relevant to your target role",
    );
  }

  return recommendations;
}

// Helper function to analyze keywords
function analyzeKeywords(resumeData: any): any {
  const keywords = new Set<string>();

  // Extract keywords from different sections
  if (resumeData.skills) {
    resumeData.skills.forEach((skill: string) =>
      keywords.add(skill.toLowerCase()),
    );
  }

  if (resumeData.workExperience) {
    resumeData.workExperience.forEach((exp: any) => {
      if (exp.description) {
        const words = exp.description.toLowerCase().match(/\b\w{3,}\b/g) || [];
        words.forEach((word: string) => {
          if (
            ![
              "the",
              "and",
              "for",
              "with",
              "was",
              "were",
              "are",
              "have",
              "has",
            ].includes(word)
          ) {
            keywords.add(word);
          }
        });
      }
    });
  }

  return {
    totalKeywords: keywords.size,
    keywords: Array.from(keywords).slice(0, 20),
    techKeywords: Array.from(keywords).filter((k) =>
      [
        "javascript",
        "python",
        "react",
        "node",
        "sql",
        "aws",
        "docker",
        "kubernetes",
      ].includes(k),
    ),
    softSkillKeywords: Array.from(keywords).filter((k) =>
      [
        "leadership",
        "communication",
        "teamwork",
        "management",
        "collaboration",
      ].includes(k),
    ),
  };
}

// Helper function to analyze format
function analyzeFormat(resumeData: any): any {
  const issues: string[] = [];
  const strengths: string[] = [];

  // Check for proper structure
  if (!resumeData.personalInfo || !resumeData.personalInfo.fullName) {
    issues.push("Missing or incomplete personal information");
  } else {
    strengths.push("Complete personal information section");
  }

  if (
    !resumeData.professionalSummary ||
    resumeData.professionalSummary.length < 50
  ) {
    issues.push("Professional summary is missing or too short");
  } else {
    strengths.push("Professional summary present");
  }

  if (!resumeData.workExperience || resumeData.workExperience.length === 0) {
    issues.push("No work experience provided");
  } else {
    strengths.push("Work experience section included");
  }

  if (!resumeData.skills || resumeData.skills.length < 5) {
    issues.push("Insufficient skills listed (aim for 8-12)");
  } else {
    strengths.push("Good variety of skills listed");
  }

  return {
    score: Math.max(0, 100 - issues.length * 20),
    issues,
    strengths,
    recommendations: [
      "Use standard section headers (Experience, Education, Skills)",
      "Keep formatting consistent throughout the resume",
      "Use bullet points for easy scanning",
      "Ensure dates are in a consistent format",
    ],
  };
}

// Helper function to get industry benchmark
function getIndustryBenchmark(score: number): any {
  let category = "Needs Improvement";
  let percentile = 0;

  if (score >= 90) {
    category = "Excellent";
    percentile = 95;
  } else if (score >= 80) {
    category = "Very Good";
    percentile = 80;
  } else if (score >= 70) {
    category = "Good";
    percentile = 65;
  } else if (score >= 60) {
    category = "Fair";
    percentile = 40;
  } else {
    category = "Needs Improvement";
    percentile = 20;
  }

  return {
    category,
    percentile,
    message: `Your resume scores in the ${percentile}th percentile of resumes we've analyzed.`,
  };
}

// Helper function to get keywords for specific industries
function getKeywordsForIndustry(industry: string, role: string): string[] {
  const keywordMap: { [key: string]: string[] } = {
    technology: [
      "JavaScript",
      "Python",
      "React",
      "Node.js",
      "AWS",
      "Docker",
      "Kubernetes",
      "Microservices",
      "REST API",
      "GraphQL",
      "MongoDB",
      "PostgreSQL",
      "Redis",
      "Git",
      "CI/CD",
      "Agile",
      "Scrum",
      "TDD",
      "DevOps",
      "Cloud Computing",
    ],
    marketing: [
      "Digital Marketing",
      "SEO",
      "SEM",
      "Google Analytics",
      "Social Media",
      "Content Marketing",
      "Email Marketing",
      "PPC",
      "Conversion Rate",
      "Marketing Automation",
      "Brand Management",
      "Campaign Management",
    ],
    finance: [
      "Financial Analysis",
      "Financial Modeling",
      "Excel",
      "PowerBI",
      "Tableau",
      "Risk Management",
      "Portfolio Management",
      "Investment Analysis",
      "Financial Reporting",
      "Budgeting",
      "Forecasting",
      "Accounting",
    ],
    sales: [
      "Lead Generation",
      "CRM",
      "Salesforce",
      "HubSpot",
      "Sales Funnel",
      "Cold Calling",
      "Relationship Building",
      "Negotiation",
      "Closing",
      "Pipeline Management",
      "Account Management",
      "Territory Management",
    ],
  };

  const roleKeywords: { [key: string]: string[] } = {
    frontend: [
      "React",
      "Vue.js",
      "Angular",
      "HTML",
      "CSS",
      "TypeScript",
      "Webpack",
      "SASS",
    ],
    backend: [
      "Node.js",
      "Python",
      "Java",
      "Express",
      "Django",
      "Spring",
      "API",
      "Database",
    ],
    fullstack: [
      "MEAN",
      "MERN",
      "Full Stack",
      "Frontend",
      "Backend",
      "Database",
      "API",
    ],
    manager: [
      "Leadership",
      "Team Management",
      "Project Management",
      "Strategy",
      "Planning",
    ],
    senior: [
      "Mentoring",
      "Architecture",
      "System Design",
      "Technical Leadership",
      "Code Review",
    ],
  };

  let keywords: string[] = [];

  if (industry && keywordMap[industry.toLowerCase()]) {
    keywords = keywords.concat(keywordMap[industry.toLowerCase()]);
  }

  if (role && roleKeywords[role.toLowerCase()]) {
    keywords = keywords.concat(roleKeywords[role.toLowerCase()]);
  }

  // Add general keywords if no specific industry/role found
  if (keywords.length === 0) {
    keywords = [
      "Communication",
      "Teamwork",
      "Problem Solving",
      "Leadership",
      "Project Management",
      "Time Management",
      "Critical Thinking",
      "Adaptability",
      "Innovation",
      "Collaboration",
    ];
  }

  return [...new Set(keywords)]; // Remove duplicates
}

// Helper function to generate detailed improvements
function generateDetailedImprovements(resume: any): any {
  const improvements = {
    immediate: [] as string[],
    shortTerm: [] as string[],
    longTerm: [] as string[],
    keywordSuggestions: [] as string[],
    formatSuggestions: [] as string[],
  };

  const atsScore = resume.atsScore || resume.calculateATSScore();

  // Immediate improvements (can be done now)
  if (!resume.personalInfo.linkedin) {
    improvements.immediate.push("Add LinkedIn profile URL");
  }
  if (
    !resume.personalInfo.github &&
    resume.skills.some((s: string) =>
      ["javascript", "python", "java", "react"].includes(s.toLowerCase()),
    )
  ) {
    improvements.immediate.push("Add GitHub profile URL");
  }
  if (resume.skills.length < 8) {
    improvements.immediate.push("Add more relevant skills (aim for 8-12)");
  }

  // Short-term improvements (within a week)
  if (!resume.professionalSummary || resume.professionalSummary.length < 100) {
    improvements.shortTerm.push(
      "Write a compelling professional summary (100-150 words)",
    );
  }
  if (
    resume.workExperience.some(
      (exp: any) => !exp.description || exp.description.length < 100,
    )
  ) {
    improvements.shortTerm.push(
      "Enhance job descriptions with specific achievements and metrics",
    );
  }

  // Long-term improvements (ongoing)
  improvements.longTerm.push(
    "Regularly update with new skills and experiences",
  );
  improvements.longTerm.push("Customize keywords for each job application");
  improvements.longTerm.push(
    "Seek additional certifications relevant to your field",
  );

  // Keyword suggestions based on existing content
  const currentKeywords = resume.keywords || [];
  if (currentKeywords.includes("javascript")) {
    improvements.keywordSuggestions.push(
      "React",
      "Node.js",
      "TypeScript",
      "Express",
    );
  }
  if (currentKeywords.includes("python")) {
    improvements.keywordSuggestions.push(
      "Django",
      "Flask",
      "Pandas",
      "NumPy",
      "Machine Learning",
    );
  }

  // Format suggestions
  improvements.formatSuggestions = [
    "Use consistent date formats throughout",
    "Start bullet points with action verbs",
    "Quantify achievements with numbers and percentages",
    "Keep sections in a logical order",
    "Use standard section headers",
  ];

  return improvements;
}
