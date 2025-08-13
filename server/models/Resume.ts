import mongoose, { Schema, Document } from 'mongoose';

// Personal Information interface
interface IPersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin?: string;
  website?: string;
  github?: string;
}

// Education interface
interface IEducation {
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa?: string;
}

// Work Experience interface
interface IWorkExperience {
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  location?: string;
}

// Project interface
interface IProject {
  name: string;
  description: string;
  technologies: string;
  link?: string;
  startDate?: string;
  endDate?: string;
}

// ATS Score interface
interface IATSScore {
  totalScore: number;
  contactInfoScore: number;
  keywordsScore: number;
  formatScore: number;
  experienceScore: number;
  skillsScore: number;
  suggestions: string[];
  lastUpdated: Date;
}

// Resume Document interface
export interface IResume extends Document {
  userId?: string;
  personalInfo: IPersonalInfo;
  professionalSummary: string;
  education: IEducation[];
  workExperience: IWorkExperience[];
  skills: string[];
  certifications: string[];
  projects: IProject[];
  profilePicture?: string;
  template: string;
  sectionOrder: Array<{
    id: string;
    name: string;
    visible: boolean;
  }>;
  atsScore?: IATSScore;
  keywords: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Personal Info Schema
const PersonalInfoSchema = new Schema<IPersonalInfo>({
  fullName: { type: String, required: true, trim: true },
  email: { 
    type: String, 
    required: true, 
    trim: true,
    lowercase: true,
    validate: {
      validator: function(v: string) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
      },
      message: 'Invalid email format'
    }
  },
  phone: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  linkedin: { type: String, trim: true },
  website: { type: String, trim: true },
  github: { type: String, trim: true }
});

// Education Schema
const EducationSchema = new Schema<IEducation>({
  school: { type: String, required: true, trim: true },
  degree: { type: String, required: true, trim: true },
  field: { type: String, required: true, trim: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  gpa: { type: String, trim: true }
});

// Work Experience Schema
const WorkExperienceSchema = new Schema<IWorkExperience>({
  company: { type: String, required: true, trim: true },
  position: { type: String, required: true, trim: true },
  startDate: { type: String, required: true },
  endDate: { type: String, required: true },
  description: { type: String, required: true, trim: true },
  location: { type: String, trim: true }
});

// Project Schema
const ProjectSchema = new Schema<IProject>({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  technologies: { type: String, required: true, trim: true },
  link: { type: String, trim: true },
  startDate: { type: String },
  endDate: { type: String }
});

// ATS Score Schema
const ATSScoreSchema = new Schema<IATSScore>({
  totalScore: { type: Number, min: 0, max: 100, default: 0 },
  contactInfoScore: { type: Number, min: 0, max: 100, default: 0 },
  keywordsScore: { type: Number, min: 0, max: 100, default: 0 },
  formatScore: { type: Number, min: 0, max: 100, default: 0 },
  experienceScore: { type: Number, min: 0, max: 100, default: 0 },
  skillsScore: { type: Number, min: 0, max: 100, default: 0 },
  suggestions: [{ type: String }],
  lastUpdated: { type: Date, default: Date.now }
});

// Section Order Schema
const SectionOrderSchema = new Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  visible: { type: Boolean, default: true }
});

// Main Resume Schema
const ResumeSchema = new Schema<IResume>({
  userId: { type: String, index: true },
  personalInfo: { type: PersonalInfoSchema, required: true },
  professionalSummary: { type: String, trim: true },
  education: [EducationSchema],
  workExperience: [WorkExperienceSchema],
  skills: [{ type: String, trim: true }],
  certifications: [{ type: String, trim: true }],
  projects: [ProjectSchema],
  profilePicture: { type: String },
  template: { 
    type: String, 
    default: 'modern',
    enum: ['modern', 'classic', 'creative', 'minimal', 'professional']
  },
  sectionOrder: [SectionOrderSchema],
  atsScore: ATSScoreSchema,
  keywords: [{ type: String, trim: true }]
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Indexes for better performance
ResumeSchema.index({ userId: 1, createdAt: -1 });
ResumeSchema.index({ 'personalInfo.email': 1 });
ResumeSchema.index({ 'atsScore.totalScore': -1 });
ResumeSchema.index({ keywords: 1 });

// Virtual for full name search
ResumeSchema.virtual('searchName').get(function() {
  return this.personalInfo.fullName.toLowerCase();
});

// Method to calculate ATS score
ResumeSchema.methods.calculateATSScore = function(): IATSScore {
  let contactInfoScore = 0;
  let keywordsScore = 0;
  let formatScore = 0;
  let experienceScore = 0;
  let skillsScore = 0;
  const suggestions: string[] = [];

  // Contact Info Score (20 points)
  const personalInfo = this.personalInfo;
  if (personalInfo.fullName) contactInfoScore += 5;
  if (personalInfo.email) contactInfoScore += 5;
  if (personalInfo.phone) contactInfoScore += 5;
  if (personalInfo.location) contactInfoScore += 5;

  if (!personalInfo.linkedin) suggestions.push('Add LinkedIn profile for better visibility');
  if (!personalInfo.github && this.skills.some((skill: string) => 
    ['javascript', 'python', 'java', 'react', 'node'].includes(skill.toLowerCase())
  )) {
    suggestions.push('Add GitHub profile to showcase your technical projects');
  }

  // Keywords Score (25 points)
  const keywordCount = this.keywords.length;
  keywordsScore = Math.min(keywordCount * 2, 25);
  if (keywordCount < 10) suggestions.push('Add more relevant keywords to improve ATS visibility');

  // Format Score (20 points)
  if (this.professionalSummary && this.professionalSummary.length >= 100) formatScore += 5;
  else suggestions.push('Add a professional summary of at least 100 characters');
  
  if (this.workExperience.length > 0) formatScore += 5;
  else suggestions.push('Add work experience to strengthen your resume');
  
  if (this.education.length > 0) formatScore += 5;
  else suggestions.push('Add education information');
  
  if (this.skills.length >= 5) formatScore += 5;
  else suggestions.push('Add at least 5 relevant skills');

  // Experience Score (20 points)
  const expScore = this.workExperience.reduce((score: number, exp: IWorkExperience) => {
    let expPoints = 0;
    if (exp.description && exp.description.length >= 100) expPoints += 3;
    if (exp.position && exp.company) expPoints += 2;
    return score + Math.min(expPoints, 5);
  }, 0);
  experienceScore = Math.min(expScore, 20);

  if (this.workExperience.some((exp: IWorkExperience) => !exp.description || exp.description.length < 100)) {
    suggestions.push('Provide detailed job descriptions with quantifiable achievements');
  }

  // Skills Score (15 points)
  skillsScore = Math.min(this.skills.length * 1.5, 15);
  if (this.skills.length < 8) suggestions.push('Add more relevant skills (aim for 8-12 skills)');

  const totalScore = contactInfoScore + keywordsScore + formatScore + experienceScore + skillsScore;

  return {
    totalScore: Math.round(totalScore),
    contactInfoScore: Math.round(contactInfoScore),
    keywordsScore: Math.round(keywordsScore),
    formatScore: Math.round(formatScore),
    experienceScore: Math.round(experienceScore),
    skillsScore: Math.round(skillsScore),
    suggestions,
    lastUpdated: new Date()
  };
};

// Pre-save middleware to update ATS score and extract keywords
ResumeSchema.pre('save', function(next) {
  // Extract keywords from resume content
  const keywords = new Set<string>();
  
  // Add skills as keywords
  this.skills.forEach(skill => keywords.add(skill.toLowerCase()));
  
  // Extract keywords from job descriptions
  this.workExperience.forEach(exp => {
    if (exp.description) {
      const words = exp.description.toLowerCase().match(/\b\w{3,}\b/g) || [];
      words.forEach(word => {
        if (!['the', 'and', 'for', 'with', 'was', 'were', 'are', 'have', 'has'].includes(word)) {
          keywords.add(word);
        }
      });
    }
  });
  
  // Extract keywords from professional summary
  if (this.professionalSummary) {
    const words = this.professionalSummary.toLowerCase().match(/\b\w{3,}\b/g) || [];
    words.forEach(word => {
      if (!['the', 'and', 'for', 'with', 'was', 'were', 'are', 'have', 'has'].includes(word)) {
        keywords.add(word);
      }
    });
  }
  
  this.keywords = Array.from(keywords).slice(0, 50); // Limit to 50 keywords
  
  // Calculate and update ATS score
  this.atsScore = this.calculateATSScore();
  
  next();
});

export default mongoose.models.Resume || mongoose.model<IResume>('Resume', ResumeSchema);
