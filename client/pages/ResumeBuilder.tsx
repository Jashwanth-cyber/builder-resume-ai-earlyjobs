import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
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
  FolderOpen
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

const templates = [
  { id: 'modern', name: 'Modern', color: 'blue' },
  { id: 'classic', name: 'Classic', color: 'gray' },
  { id: 'creative', name: 'Creative', color: 'purple' },
  { id: 'minimal', name: 'Minimal', color: 'green' },
  { id: 'professional', name: 'Professional', color: 'indigo' }
];

export default function ResumeBuilder() {
  const [activeTemplate, setActiveTemplate] = useState('modern');
  const [activeSection, setActiveSection] = useState('personal');
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

  const addEducation = () => {
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
  };

  const addWorkExperience = () => {
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
  };

  const addProject = () => {
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
  };

  const sections = [
    { id: 'personal', name: 'Personal Info', icon: User },
    { id: 'summary', name: 'Professional Summary', icon: FileText },
    { id: 'education', name: 'Education', icon: GraduationCap },
    { id: 'experience', name: 'Work Experience', icon: Briefcase },
    { id: 'skills', name: 'Skills', icon: Code },
    { id: 'certifications', name: 'Certifications', icon: Award },
    { id: 'projects', name: 'Projects', icon: FolderOpen }
  ];

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
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-md flex items-center justify-center">
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
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
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
                      <div className="w-24 h-24 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                      </div>
                      <Button variant="outline" size="sm">
                        <Upload className="w-4 h-4 mr-2" />
                        Upload Photo
                      </Button>
                    </div>
                    <Separator />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="fullName">Full Name</Label>
                        <Input id="fullName" placeholder="John Doe" />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" placeholder="john@example.com" />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input id="phone" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input id="location" placeholder="New York, NY" />
                      </div>
                      <div>
                        <Label htmlFor="linkedin">LinkedIn</Label>
                        <Input id="linkedin" placeholder="linkedin.com/in/johndoe" />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input id="website" placeholder="johndoe.com" />
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
                    />
                  </div>
                )}

                {/* Education Section */}
                {activeSection === 'education' && (
                  <div className="space-y-4">
                    {resumeData.education.map((edu, index) => (
                      <Card key={edu.id} className="border-gray-200">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>School/University</Label>
                                <Input placeholder="University of California" />
                              </div>
                              <div>
                                <Label>Degree</Label>
                                <Input placeholder="Bachelor of Science" />
                              </div>
                              <div>
                                <Label>Field of Study</Label>
                                <Input placeholder="Computer Science" />
                              </div>
                              <div>
                                <Label>GPA (Optional)</Label>
                                <Input placeholder="3.8" />
                              </div>
                              <div>
                                <Label>Start Date</Label>
                                <Input type="month" />
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <Input type="month" />
                              </div>
                            </div>
                            <Button variant="destructive" size="sm" className="w-fit">
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
                    {resumeData.workExperience.map((work, index) => (
                      <Card key={work.id} className="border-gray-200">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>Company</Label>
                                <Input placeholder="Tech Corp" />
                              </div>
                              <div>
                                <Label>Position</Label>
                                <Input placeholder="Software Engineer" />
                              </div>
                              <div>
                                <Label>Start Date</Label>
                                <Input type="month" />
                              </div>
                              <div>
                                <Label>End Date</Label>
                                <Input type="month" />
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
                              />
                            </div>
                            <Button variant="destructive" size="sm" className="w-fit">
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
                    <Input placeholder="Add a skill and press Enter" />
                    <div className="flex flex-wrap gap-2">
                      {['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].map((skill) => (
                        <Badge key={skill} variant="secondary" className="px-3 py-1">
                          {skill}
                          <button className="ml-2 text-gray-500 hover:text-red-500">
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
                    <Input placeholder="Add a certification and press Enter" />
                    <div className="space-y-2">
                      {['AWS Certified Developer', 'Google Cloud Professional'].map((cert) => (
                        <div key={cert} className="flex items-center justify-between p-3 border rounded-lg">
                          <span>{cert}</span>
                          <Button variant="ghost" size="sm">
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
                    {resumeData.projects.map((project, index) => (
                      <Card key={project.id} className="border-gray-200">
                        <CardContent className="pt-4">
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3">
                              <div>
                                <Label>Project Name</Label>
                                <Input placeholder="E-commerce Website" />
                              </div>
                              <div>
                                <Label>Technologies Used</Label>
                                <Input placeholder="React, Node.js, MongoDB" />
                              </div>
                            </div>
                            <div>
                              <Label>Description</Label>
                              <Textarea 
                                placeholder="Describe the project, your role, and key achievements..."
                                className="min-h-[80px]"
                              />
                            </div>
                            <div>
                              <Label>Project Link (Optional)</Label>
                              <Input placeholder="https://github.com/username/project" />
                            </div>
                            <Button variant="destructive" size="sm" className="w-fit">
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
                <CardTitle className="text-lg">Choose Template</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {templates.map((template) => (
                    <Button
                      key={template.id}
                      variant={activeTemplate === template.id ? "default" : "outline"}
                      className="h-16 flex flex-col p-2"
                      onClick={() => setActiveTemplate(template.id)}
                    >
                      <div className={`w-6 h-6 rounded mb-1 bg-${template.color}-500`}></div>
                      <span className="text-xs">{template.name}</span>
                    </Button>
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
                <div className="bg-white border rounded-lg p-6 min-h-[600px] shadow-sm">
                  {/* Resume Preview Content */}
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="text-center border-b pb-4">
                      <h1 className="text-2xl font-bold text-gray-900">John Doe</h1>
                      <p className="text-gray-600">Software Engineer</p>
                      <div className="flex justify-center space-x-4 text-sm text-gray-500 mt-2">
                        <span>john@example.com</span>
                        <span>+1 (555) 123-4567</span>
                        <span>New York, NY</span>
                      </div>
                    </div>

                    {/* Professional Summary */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Professional Summary</h2>
                      <p className="text-gray-700 text-sm leading-relaxed">
                        Experienced software engineer with 5+ years developing scalable web applications...
                      </p>
                    </div>

                    {/* Experience */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Experience</h2>
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-medium text-gray-900">Senior Software Engineer</h3>
                              <p className="text-blue-600 text-sm">Tech Corp</p>
                            </div>
                            <span className="text-gray-500 text-sm">2021 - Present</span>
                          </div>
                          <p className="text-gray-700 text-sm mt-1">
                            Led development of microservices architecture serving 1M+ users...
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Education */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Education</h2>
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-medium text-gray-900">Bachelor of Science in Computer Science</h3>
                          <p className="text-blue-600 text-sm">University of California</p>
                        </div>
                        <span className="text-gray-500 text-sm">2016 - 2020</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h2 className="text-lg font-semibold text-gray-900 mb-2">Skills</h2>
                      <div className="flex flex-wrap gap-2">
                        {['JavaScript', 'React', 'Node.js', 'Python', 'SQL'].map((skill) => (
                          <Badge key={skill} variant="secondary" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
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
