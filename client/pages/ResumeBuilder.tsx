import { useState, useRef, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  ArrowLeft, 
  FileText, 
  Sparkles, 
  Download, 
  Upload,
  Plus,
  Trash2,
  User,
  Briefcase,
  GraduationCap,
  Award,
  Code,
  FolderOpen,
  Camera,
  Palette,
  GripVertical,
  MoveUp,
  MoveDown
} from "lucide-react";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
}

interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  gpa: string;
}

interface WorkExperience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface Project {
  id: string;
  name: string;
  description: string;
  technologies: string;
  link: string;
}

interface ResumeData {
  personalInfo: PersonalInfo;
  professionalSummary: string;
  education: Education[];
  workExperience: WorkExperience[];
  skills: string[];
  certifications: string[];
  projects: Project[];
  profilePicture: string | null;
}

interface SectionOrder {
  id: string;
  name: string;
  visible: boolean;
}

const templates = [
  { 
    id: 'modern', 
    name: 'Modern', 
    color: 'orange-500',
    preview: 'Clean and contemporary with orange accents'
  },
  { 
    id: 'classic', 
    name: 'Classic', 
    color: 'gray-600',
    preview: 'Traditional and professional'
  },
  { 
    id: 'creative', 
    name: 'Creative', 
    color: 'orange-600',
    preview: 'Bold design with creative elements'
  },
  { 
    id: 'minimal', 
    name: 'Minimal', 
    color: 'orange-400',
    preview: 'Clean and simple layout'
  },
  { 
    id: 'professional', 
    name: 'Professional', 
    color: 'orange-700',
    preview: 'Corporate-friendly design'
  }
];

export default function ResumeBuilder() {
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [activeSection, setActiveSection] = useState('personal');
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      website: ''
    },
    professionalSummary: '',
    education: [],
    workExperience: [],
    skills: [],
    certifications: [],
    projects: [],
    profilePicture: null
  });

  const [sectionOrder, setSectionOrder] = useState<SectionOrder[]>([
    { id: 'summary', name: 'Professional Summary', visible: true },
    { id: 'experience', name: 'Work Experience', visible: true },
    { id: 'education', name: 'Education', visible: true },
    { id: 'skills', name: 'Skills', visible: true },
    { id: 'projects', name: 'Projects', visible: true },
    { id: 'certifications', name: 'Certifications', visible: true }
  ]);

  const [currentSkill, setCurrentSkill] = useState('');
  const [currentCertification, setCurrentCertification] = useState('');

  // Update personal info
  const updatePersonalInfo = useCallback((field: keyof PersonalInfo, value: string) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  }, []);

  // Update professional summary
  const updateProfessionalSummary = useCallback((value: string) => {
    setResumeData(prev => ({ ...prev, professionalSummary: value }));
  }, []);

  // Profile picture upload
  const handleProfilePictureUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setResumeData(prev => ({
          ...prev,
          profilePicture: e.target?.result as string
        }));
      };
      reader.readAsDataURL(file);
    }
  }, []);

  // Education functions
  const addEducation = useCallback(() => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      gpa: ''
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  }, []);

  const updateEducation = useCallback((id: string, field: keyof Education, value: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.map(edu => 
        edu.id === id ? { ...edu, [field]: value } : edu
      )
    }));
  }, []);

  const removeEducation = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      education: prev.education.filter(edu => edu.id !== id)
    }));
  }, []);

  // Work experience functions
  const addWorkExperience = useCallback(() => {
    const newWork: WorkExperience = {
      id: Date.now().toString(),
      company: '',
      position: '',
      startDate: '',
      endDate: '',
      description: ''
    };
    setResumeData(prev => ({
      ...prev,
      workExperience: [...prev.workExperience, newWork]
    }));
  }, []);

  const updateWorkExperience = useCallback((id: string, field: keyof WorkExperience, value: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.map(work => 
        work.id === id ? { ...work, [field]: value } : work
      )
    }));
  }, []);

  const removeWorkExperience = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      workExperience: prev.workExperience.filter(work => work.id !== id)
    }));
  }, []);

  // Project functions
  const addProject = useCallback(() => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: '',
      description: '',
      technologies: '',
      link: ''
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  }, []);

  const updateProject = useCallback((id: string, field: keyof Project, value: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.map(project => 
        project.id === id ? { ...project, [field]: value } : project
      )
    }));
  }, []);

  const removeProject = useCallback((id: string) => {
    setResumeData(prev => ({
      ...prev,
      projects: prev.projects.filter(project => project.id !== id)
    }));
  }, []);

  // Skills functions
  const addSkill = useCallback((skill: string) => {
    if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
      setResumeData(prev => ({
        ...prev,
        skills: [...prev.skills, skill.trim()]
      }));
      setCurrentSkill('');
    }
  }, [resumeData.skills]);

  const removeSkill = useCallback((skillToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }));
  }, []);

  // Certifications functions
  const addCertification = useCallback((cert: string) => {
    if (cert.trim() && !resumeData.certifications.includes(cert.trim())) {
      setResumeData(prev => ({
        ...prev,
        certifications: [...prev.certifications, cert.trim()]
      }));
      setCurrentCertification('');
    }
  }, [resumeData.certifications]);

  const removeCertification = useCallback((certToRemove: string) => {
    setResumeData(prev => ({
      ...prev,
      certifications: prev.certifications.filter(cert => cert !== certToRemove)
    }));
  }, []);

  // Section reordering
  const moveSectionUp = useCallback((index: number) => {
    if (index > 0) {
      setSectionOrder(prev => {
        const newOrder = [...prev];
        [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        return newOrder;
      });
    }
  }, []);

  const moveSectionDown = useCallback((index: number) => {
    setSectionOrder(prev => {
      if (index < prev.length - 1) {
        const newOrder = [...prev];
        [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        return newOrder;
      }
      return prev;
    });
  }, []);

  const toggleSectionVisibility = useCallback((id: string) => {
    setSectionOrder(prev => 
      prev.map(section => 
        section.id === id ? { ...section, visible: !section.visible } : section
      )
    );
  }, []);

  // PDF Download function
  const downloadPDF = useCallback(() => {
    // In a real implementation, you would use a library like jsPDF or html2pdf
    // For now, we'll simulate the download
    const element = document.getElementById('resume-preview');
    if (element) {
      // This is a simplified implementation
      // In production, use html2pdf.js or similar library
      alert('PDF download functionality would be implemented here using html2pdf.js or similar library');
    }
  }, []);

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Professional Summary', icon: FileText },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'experience', name: 'Work Experience', icon: Briefcase },
    { id: 'skills', name: 'Skills', icon: Code },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'projects', name: 'Projects', icon: FolderOpen }
  ];

  const getTemplateStyle = (templateId: string) => {
    switch (templateId) {
      case 'modern':
        return {
          headerBg: 'bg-gradient-to-r from-orange-500 to-orange-600',
          headerText: 'text-white',
          sectionHeader: 'text-orange-600',
          accent: 'text-orange-500'
        };
      case 'classic':
        return {
          headerBg: 'bg-gray-800',
          headerText: 'text-white',
          sectionHeader: 'text-gray-800',
          accent: 'text-gray-600'
        };
      case 'creative':
        return {
          headerBg: 'bg-gradient-to-r from-orange-600 to-red-500',
          headerText: 'text-white',
          sectionHeader: 'text-orange-600',
          accent: 'text-orange-600'
        };
      case 'minimal':
        return {
          headerBg: 'bg-white border-b-4 border-orange-400',
          headerText: 'text-gray-800',
          sectionHeader: 'text-orange-400',
          accent: 'text-orange-400'
        };
      case 'professional':
        return {
          headerBg: 'bg-orange-700',
          headerText: 'text-white',
          sectionHeader: 'text-orange-700',
          accent: 'text-orange-600'
        };
      default:
        return {
          headerBg: 'bg-gradient-to-r from-orange-500 to-orange-600',
          headerText: 'text-white',
          sectionHeader: 'text-orange-600',
          accent: 'text-orange-500'
        };
    }
  };

  const templateStyle = getTemplateStyle(activeTemplate);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Home
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 bg-gradient-to-r from-orange-500 to-orange-600 rounded-md flex items-center justify-center">
                  <FileText className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Resume Builder</h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-2" />
                Import Data
              </Button>
              <Button 
                onClick={downloadPDF}
                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Form */}
          <div className="space-y-6">
            {/* Section Navigation */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Resume Sections</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-2">
                  {sections.map((section) => {
                    const Icon = section.icon;
                    return (
                      <Button
                        key={section.id}
                        variant={activeSection === section.id ? "default" : "ghost"}
                        className="justify-start h-auto p-3"
                        onClick={() => setActiveSection(section.id)}
                      >
                        <Icon className="w-4 h-4 mr-2" />
                        <span className="text-sm">{section.name}</span>
                      </Button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Dynamic Form Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  {sections.find(s => s.id === activeSection)?.name}
                  {(activeSection === 'summary' || activeSection === 'experience') && (
                    <Button size="sm" variant="outline" className="ml-auto">
                      <Sparkles className="w-4 h-4 mr-1" />
                      AI Suggest
                    </Button>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Personal Info Section */}
                {activeSection === 'personal' && (
                  <div className="space-y-4">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center overflow-hidden">
                        {resumeData.profilePicture ? (
                          <img 
                            src={resumeData.profilePicture} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <User className="w-8 h-8 text-gray-400" />
                        )}
                      </div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleProfilePictureUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input 
                          id="fullName" 
                          placeholder="John Doe" 
                          value={resumeData.personalInfo.fullName}
                          onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          placeholder="john@example.com" 
                          value={resumeData.personalInfo.email}
                          onChange={(e) => updatePersonalInfo('email', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input 
                          id="phone" 
                          placeholder="+1 (555) 123-4567" 
                          value={resumeData.personalInfo.phone}
                          onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input 
                          id="location" 
                          placeholder="New York, NY" 
                          value={resumeData.personalInfo.location}
                          onChange={(e) => updatePersonalInfo('location', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input 
                          id="linkedin" 
                          placeholder="linkedin.com/in/johndoe" 
                          value={resumeData.personalInfo.linkedin}
                          onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input 
                          id="website" 
                          placeholder="johndoe.com" 
                          value={resumeData.personalInfo.website}
                          onChange={(e) => updatePersonalInfo('website', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Professional Summary Section */}
                {activeSection === 'summary' && (
                  <div className="space-y-4">
                    <Textarea
                      placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
                      className="min-h-[120px]"
                      value={resumeData.professionalSummary}
                      onChange={(e) => updateProfessionalSummary(e.target.value)}
                    />
                  </div>
                )}

                {/* Education Section */}
                {activeSection === 'education' && (
                  <div className="space-y-4">
                    {resumeData.education.map((edu) => (
                      <Card key={edu.id} className="border-gray-200">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>School/University</Label>
                                <Input 
                                  placeholder="University of California" 
                                  value={edu.school}
                                  onChange={(e) => updateEducation(edu.id, 'school', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Degree</Label>
                                <Input 
                                  placeholder="Bachelor of Science" 
                                  value={edu.degree}
                                  onChange={(e) => updateEducation(edu.id, 'degree', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Field of Study</Label>
                                <Input 
                                  placeholder="Computer Science" 
                                  value={edu.field}
                                  onChange={(e) => updateEducation(edu.id, 'field', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>GPA (Optional)</Label>
                                <Input 
                                  placeholder="3.8" 
                                  value={edu.gpa}
                                  onChange={(e) => updateEducation(edu.id, 'gpa', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Start Date</Label>
                                <Input 
                                  type="month" 
                                  value={edu.startDate}
                                  onChange={(e) => updateEducation(edu.id, 'startDate', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <Input 
                                  type="month" 
                                  value={edu.endDate}
                                  onChange={(e) => updateEducation(edu.id, 'endDate', e.target.value)}
                                />
                              </div>
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="w-fit"
                              onClick={() => removeEducation(edu.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button onClick={addEducation} variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Education
                    </Button>
                  </div>
                )}

                {/* Work Experience Section */}
                {activeSection === 'experience' && (
                  <div className="space-y-4">
                    {resumeData.workExperience.map((work) => (
                      <Card key={work.id} className="border-gray-200">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>Company</Label>
                                <Input 
                                  placeholder="Tech Corp" 
                                  value={work.company}
                                  onChange={(e) => updateWorkExperience(work.id, 'company', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Position</Label>
                                <Input 
                                  placeholder="Software Engineer" 
                                  value={work.position}
                                  onChange={(e) => updateWorkExperience(work.id, 'position', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Start Date</Label>
                                <Input 
                                  type="month" 
                                  value={work.startDate}
                                  onChange={(e) => updateWorkExperience(work.id, 'startDate', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <Input 
                                  type="month" 
                                  value={work.endDate}
                                  onChange={(e) => updateWorkExperience(work.id, 'endDate', e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="flex items-center justify-between">
                                Job Description
                                <Button size="sm" variant="outline">
                                  <Sparkles className="w-3 h-3 mr-1" />
                                  AI Suggest
                                </Button>
                              </Label>
                              <Textarea 
                                placeholder="Describe your key responsibilities and achievements..."
                                className="min-h-[100px]"
                                value={work.description}
                                onChange={(e) => updateWorkExperience(work.id, 'description', e.target.value)}
                              />
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="w-fit"
                              onClick={() => removeWorkExperience(work.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button onClick={addWorkExperience} variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Work Experience
                    </Button>
                  </div>
                )}

                {/* Skills Section */}
                {activeSection === 'skills' && (
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Add a skill" 
                        value={currentSkill}
                        onChange={(e) => setCurrentSkill(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addSkill(currentSkill);
                          }
                        }}
                      />
                      <Button onClick={() => addSkill(currentSkill)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                          {skill}
                          <button 
                            className="ml-2 text-gray-500 hover:text-red-500"
                            onClick={() => removeSkill(skill)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Certifications Section */}
                {activeSection === 'certifications' && (
                  <div className="space-y-4">
                    <div className="flex space-x-2">
                      <Input 
                        placeholder="Add a certification" 
                        value={currentCertification}
                        onChange={(e) => setCurrentCertification(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            addCertification(currentCertification);
                          }
                        }}
                      />
                      <Button onClick={() => addCertification(currentCertification)}>
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {resumeData.certifications.map((cert) => (
                        <div key={cert} className="flex items-center justify-between p-3 border rounded-lg">
                          <span>{cert}</span>
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => removeCertification(cert)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Projects Section */}
                {activeSection === 'projects' && (
                  <div className="space-y-4">
                    {resumeData.projects.map((project) => (
                      <Card key={project.id} className="border-gray-200">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>Project Name</Label>
                                <Input 
                                  placeholder="E-commerce Website" 
                                  value={project.name}
                                  onChange={(e) => updateProject(project.id, 'name', e.target.value)}
                                />
                              </div>
                              <div>
                                <Label>Technologies Used</Label>
                                <Input 
                                  placeholder="React, Node.js, MongoDB" 
                                  value={project.technologies}
                                  onChange={(e) => updateProject(project.id, 'technologies', e.target.value)}
                                />
                              </div>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea 
                                placeholder="Describe the project, your role, and key achievements..."
                                className="min-h-[80px]"
                                value={project.description}
                                onChange={(e) => updateProject(project.id, 'description', e.target.value)}
                              />
                            </div>
                            <div>
                              <Label>Project Link (Optional)</Label>
                              <Input 
                                placeholder="https://github.com/username/project" 
                                value={project.link}
                                onChange={(e) => updateProject(project.id, 'link', e.target.value)}
                              />
                            </div>
                            <Button 
                              variant="destructive" 
                              size="sm" 
                              className="w-fit"
                              onClick={() => removeProject(project.id)}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    <Button onClick={addProject} variant="outline" className="w-full">
                      <Plus className="w-4 h-4 mr-2" />
                      Add Project
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-6 sticky top-24 h-fit">
            {/* Template Selection */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center justify-between">
                  Resume Template
                  <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="outline" size="sm">
                        <Palette className="w-4 h-4 mr-2" />
                        Change Template
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-4xl">
                      <DialogHeader>
                        <DialogTitle>Choose a Template</DialogTitle>
                      </DialogHeader>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                        {templates.map((template) => (
                          <div
                            key={template.id}
                            className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                              activeTemplate === template.id 
                                ? 'border-orange-500 bg-orange-50' 
                                : 'border-gray-200'
                            }`}
                            onClick={() => {
                              setActiveTemplate(template.id);
                              setIsTemplateDialogOpen(false);
                            }}
                          >
                            <div className={`w-full h-32 rounded mb-3 bg-${template.color} flex items-center justify-center text-white font-medium`}>
                              {template.name}
                            </div>
                            <h3 className="font-medium text-sm">{template.name}</h3>
                            <p className="text-xs text-gray-500 mt-1">{template.preview}</p>
                          </div>
                        ))}
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  Current: <span className="font-medium text-orange-600">{templates.find(t => t.id === activeTemplate)?.name}</span>
                </div>
              </CardContent>
            </Card>

            {/* Section Order Control */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Section Order</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sectionOrder.map((section, index) => (
                    <div 
                      key={section.id} 
                      className="flex items-center justify-between p-2 border rounded-lg"
                    >
                      <div className="flex items-center space-x-2">
                        <GripVertical className="w-4 h-4 text-gray-400" />
                        <span className="text-sm">{section.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSectionUp(index)}
                          disabled={index === 0}
                        >
                          <MoveUp className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => moveSectionDown(index)}
                          disabled={index === sectionOrder.length - 1}
                        >
                          <MoveDown className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => toggleSectionVisibility(section.id)}
                        >
                          {section.visible ? '👁️' : '👁️‍🗨️'}
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Live Preview */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Live Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div id="resume-preview" className="bg-white border rounded-lg p-6 min-h-[600px] shadow-sm">
                  {/* Resume Preview Content with Live Updates */}
                  <div className="space-y-6">
                    {/* Header */}
                    <div className={`${templateStyle.headerBg} ${templateStyle.headerText} p-6 rounded-lg -mx-6 -mt-6 mb-6`}>
                      <div className="flex items-center space-x-4">
                        {resumeData.profilePicture && (
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20">
                            <img 
                              src={resumeData.profilePicture} 
                              alt="Profile" 
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h1 className="text-3xl font-bold">
                            {resumeData.personalInfo.fullName || 'Your Name'}
                          </h1>
                          <p className="text-lg opacity-90 mt-1">
                            {resumeData.workExperience[0]?.position || 'Your Title'}
                          </p>
                          <div className="flex flex-wrap items-center space-x-4 text-sm mt-3 opacity-90">
                            {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                            {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                            {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                          </div>
                          <div className="flex flex-wrap items-center space-x-4 text-sm mt-1 opacity-90">
                            {resumeData.personalInfo.linkedin && <span>{resumeData.personalInfo.linkedin}</span>}
                            {resumeData.personalInfo.website && <span>{resumeData.personalInfo.website}</span>}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Dynamic Sections Based on Order */}
                    {sectionOrder.filter(section => section.visible).map((sectionConfig) => {
                      const sectionId = sectionConfig.id;
                      
                      if (sectionId === 'summary' && resumeData.professionalSummary) {
                        return (
                          <div key="summary">
                            <h2 className={`text-xl font-bold ${templateStyle.sectionHeader} mb-3 border-b pb-1`}>
                              Professional Summary
                            </h2>
                            <p className="text-gray-700 leading-relaxed">
                              {resumeData.professionalSummary}
                            </p>
                          </div>
                        );
                      }

                      if (sectionId === 'experience' && resumeData.workExperience.length > 0) {
                        return (
                          <div key="experience">
                            <h2 className={`text-xl font-bold ${templateStyle.sectionHeader} mb-3 border-b pb-1`}>
                              Work Experience
                            </h2>
                            <div className="space-y-4">
                              {resumeData.workExperience.map((work) => (
                                <div key={work.id}>
                                  <div className="flex justify-between items-start mb-2">
                                    <div>
                                      <h3 className="font-semibold text-gray-900">
                                        {work.position || 'Position'}
                                      </h3>
                                      <p className={`${templateStyle.accent} font-medium`}>
                                        {work.company || 'Company'}
                                      </p>
                                    </div>
                                    <span className="text-gray-500 text-sm">
                                      {work.startDate && work.endDate 
                                        ? `${work.startDate} - ${work.endDate}`
                                        : work.startDate || work.endDate || 'Date Range'
                                      }
                                    </span>
                                  </div>
                                  {work.description && (
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                      {work.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      if (sectionId === 'education' && resumeData.education.length > 0) {
                        return (
                          <div key="education">
                            <h2 className={`text-xl font-bold ${templateStyle.sectionHeader} mb-3 border-b pb-1`}>
                              Education
                            </h2>
                            <div className="space-y-3">
                              {resumeData.education.map((edu) => (
                                <div key={edu.id} className="flex justify-between items-start">
                                  <div>
                                    <h3 className="font-semibold text-gray-900">
                                      {edu.degree} {edu.field && `in ${edu.field}`}
                                    </h3>
                                    <p className={`${templateStyle.accent} font-medium`}>
                                      {edu.school}
                                    </p>
                                    {edu.gpa && (
                                      <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                                    )}
                                  </div>
                                  <span className="text-gray-500 text-sm">
                                    {edu.startDate && edu.endDate 
                                      ? `${edu.startDate} - ${edu.endDate}`
                                      : edu.startDate || edu.endDate || 'Date Range'
                                    }
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      if (sectionId === 'skills' && resumeData.skills.length > 0) {
                        return (
                          <div key="skills">
                            <h2 className={`text-xl font-bold ${templateStyle.sectionHeader} mb-3 border-b pb-1`}>
                              Skills
                            </h2>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.skills.map((skill) => (
                                <Badge key={skill} variant="secondary" className="text-sm">
                                  {skill}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      if (sectionId === 'projects' && resumeData.projects.length > 0) {
                        return (
                          <div key="projects">
                            <h2 className={`text-xl font-bold ${templateStyle.sectionHeader} mb-3 border-b pb-1`}>
                              Projects
                            </h2>
                            <div className="space-y-4">
                              {resumeData.projects.map((project) => (
                                <div key={project.id}>
                                  <div className="flex justify-between items-start mb-2">
                                    <h3 className="font-semibold text-gray-900">
                                      {project.name || 'Project Name'}
                                    </h3>
                                    {project.link && (
                                      <a 
                                        href={project.link} 
                                        className={`${templateStyle.accent} text-sm hover:underline`}
                                        target="_blank" 
                                        rel="noopener noreferrer"
                                      >
                                        View Project
                                      </a>
                                    )}
                                  </div>
                                  {project.technologies && (
                                    <p className="text-gray-600 text-sm mb-1">
                                      <span className="font-medium">Technologies:</span> {project.technologies}
                                    </p>
                                  )}
                                  {project.description && (
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                      {project.description}
                                    </p>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      if (sectionId === 'certifications' && resumeData.certifications.length > 0) {
                        return (
                          <div key="certifications">
                            <h2 className={`text-xl font-bold ${templateStyle.sectionHeader} mb-3 border-b pb-1`}>
                              Certifications
                            </h2>
                            <div className="space-y-2">
                              {resumeData.certifications.map((cert) => (
                                <div key={cert} className="flex items-center">
                                  <div className={`w-2 h-2 ${templateStyle.accent.replace('text-', 'bg-')} rounded-full mr-3`}></div>
                                  <span className="text-gray-700">{cert}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
