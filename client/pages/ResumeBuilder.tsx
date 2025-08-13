import { useState, useRef, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import ATSScoreCard from "@/components/ui/ats-score";
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
  MoveDown,
  Settings,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Save,
  X,
  Eye,
  Target,
} from "lucide-react";

interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  website: string;
  github: string;
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
    id: "modern",
    name: "Modern",
    color: "bg-orange-500",
    headerBg: "bg-gradient-to-r from-orange-500 to-orange-600",
    headerText: "text-white",
    sectionHeader: "text-orange-600 border-orange-200",
    accent: "text-orange-500",
    preview: "Clean and contemporary with orange accents",
  },
  {
    id: "classic",
    name: "Classic",
    color: "bg-gray-600",
    headerBg: "bg-gray-800",
    headerText: "text-white",
    sectionHeader: "text-gray-800 border-gray-200",
    accent: "text-gray-600",
    preview: "Traditional and professional",
  },
  {
    id: "creative",
    name: "Creative",
    color: "bg-purple-600",
    headerBg: "bg-gradient-to-r from-purple-600 to-pink-500",
    headerText: "text-white",
    sectionHeader: "text-purple-600 border-purple-200",
    accent: "text-purple-600",
    preview: "Bold design with creative elements",
  },
  {
    id: "minimal",
    name: "Minimal",
    color: "bg-blue-400",
    headerBg: "bg-white border-b-4 border-blue-400",
    headerText: "text-gray-800",
    sectionHeader: "text-blue-400 border-blue-100",
    accent: "text-blue-400",
    preview: "Clean and simple layout",
  },
  {
    id: "professional",
    name: "Professional",
    color: "bg-green-700",
    headerBg: "bg-green-700",
    headerText: "text-white",
    sectionHeader: "text-green-700 border-green-200",
    accent: "text-green-600",
    preview: "Corporate-friendly design",
  },
];

export default function ResumeBuilder() {
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [isReorderMode, setIsReorderMode] = useState(false);
  const [viewMode, setViewMode] = useState<'preview' | 'ats'>('preview');
  const [draggedSection, setDraggedSection] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Section collapse states
  const [collapsedSections, setCollapsedSections] = useState<Set<string>>(
    new Set([
      "summary",
      "education",
      "experience",
      "skills",
      "certifications",
      "projects",
    ]),
  );

  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      fullName: "",
      email: "",
      phone: "",
      location: "",
      linkedin: "",
      website: "",
      github: "",
    },
    professionalSummary: "",
    education: [],
    workExperience: [],
    skills: [],
    certifications: [],
    projects: [],
    profilePicture: null,
  });

  const [sectionOrder, setSectionOrder] = useState<SectionOrder[]>([
    { id: "summary", name: "Professional Summary", visible: true },
    { id: "experience", name: "Work Experience", visible: true },
    { id: "education", name: "Education", visible: true },
    { id: "skills", name: "Skills", visible: true },
    { id: "projects", name: "Projects", visible: true },
    { id: "certifications", name: "Certifications", visible: true },
  ]);

  const [currentSkill, setCurrentSkill] = useState("");
  const [currentCertification, setCurrentCertification] = useState("");
  const [atsScore, setATSScore] = useState<any>(null);
  const [atsLoading, setATSLoading] = useState(false);
  const [savedResumeId, setSavedResumeId] = useState<string | null>(null);

  // Section toggle function
  const toggleSection = useCallback((sectionId: string) => {
    setCollapsedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionId)) {
        newSet.delete(sectionId);
      } else {
        newSet.add(sectionId);
      }
      return newSet;
    });
  }, []);

  // Drag and drop functions
  const handleDragStart = useCallback(
    (e: React.DragEvent, sectionId: string) => {
      setDraggedSection(sectionId);
      e.dataTransfer.effectAllowed = "move";
    },
    [],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetSectionId: string) => {
      e.preventDefault();
      if (!draggedSection || draggedSection === targetSectionId) return;

      setSectionOrder((prev) => {
        const newOrder = [...prev];
        const draggedIndex = newOrder.findIndex((s) => s.id === draggedSection);
        const targetIndex = newOrder.findIndex((s) => s.id === targetSectionId);

        if (draggedIndex === -1 || targetIndex === -1) return prev;

        // Remove dragged item and insert at target position
        const [draggedItem] = newOrder.splice(draggedIndex, 1);
        newOrder.splice(targetIndex, 0, draggedItem);

        return newOrder;
      });
      setDraggedSection(null);
    },
    [draggedSection],
  );

  const handleDragEnd = useCallback(() => {
    setDraggedSection(null);
  }, []);

  // Update personal info
  const updatePersonalInfo = useCallback(
    (field: keyof PersonalInfo, value: string) => {
      setResumeData((prev) => ({
        ...prev,
        personalInfo: { ...prev.personalInfo, [field]: value },
      }));
    },
    [],
  );

  // Update professional summary
  const updateProfessionalSummary = useCallback((value: string) => {
    setResumeData((prev) => ({ ...prev, professionalSummary: value }));
  }, []);

  // Profile picture upload
  const handleProfilePictureUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setResumeData((prev) => ({
            ...prev,
            profilePicture: e.target?.result as string,
          }));
        };
        reader.readAsDataURL(file);
      }
    },
    [],
  );

  // Education functions
  const addEducation = useCallback(() => {
    const newEducation: Education = {
      id: Date.now().toString(),
      school: "",
      degree: "",
      field: "",
      startDate: "",
      endDate: "",
      gpa: "",
    };
    setResumeData((prev) => ({
      ...prev,
      education: [...prev.education, newEducation],
    }));
  }, []);

  const updateEducation = useCallback(
    (id: string, field: keyof Education, value: string) => {
      setResumeData((prev) => ({
        ...prev,
        education: prev.education.map((edu) =>
          edu.id === id ? { ...edu, [field]: value } : edu,
        ),
      }));
    },
    [],
  );

  const removeEducation = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      education: prev.education.filter((edu) => edu.id !== id),
    }));
  }, []);

  // Work experience functions
  const addWorkExperience = useCallback(() => {
    const newWork: WorkExperience = {
      id: Date.now().toString(),
      company: "",
      position: "",
      startDate: "",
      endDate: "",
      description: "",
    };
    setResumeData((prev) => ({
      ...prev,
      workExperience: [...prev.workExperience, newWork],
    }));
  }, []);

  const updateWorkExperience = useCallback(
    (id: string, field: keyof WorkExperience, value: string) => {
      setResumeData((prev) => ({
        ...prev,
        workExperience: prev.workExperience.map((work) =>
          work.id === id ? { ...work, [field]: value } : work,
        ),
      }));
    },
    [],
  );

  const removeWorkExperience = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      workExperience: prev.workExperience.filter((work) => work.id !== id),
    }));
  }, []);

  // Project functions
  const addProject = useCallback(() => {
    const newProject: Project = {
      id: Date.now().toString(),
      name: "",
      description: "",
      technologies: "",
      link: "",
    };
    setResumeData((prev) => ({
      ...prev,
      projects: [...prev.projects, newProject],
    }));
  }, []);

  const updateProject = useCallback(
    (id: string, field: keyof Project, value: string) => {
      setResumeData((prev) => ({
        ...prev,
        projects: prev.projects.map((project) =>
          project.id === id ? { ...project, [field]: value } : project,
        ),
      }));
    },
    [],
  );

  const removeProject = useCallback((id: string) => {
    setResumeData((prev) => ({
      ...prev,
      projects: prev.projects.filter((project) => project.id !== id),
    }));
  }, []);

  // Skills functions
  const addSkill = useCallback(
    (skill: string) => {
      if (skill.trim() && !resumeData.skills.includes(skill.trim())) {
        setResumeData((prev) => ({
          ...prev,
          skills: [...prev.skills, skill.trim()],
        }));
        setCurrentSkill("");
      }
    },
    [resumeData.skills],
  );

  const removeSkill = useCallback((skillToRemove: string) => {
    setResumeData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  }, []);

  // Certifications functions
  const addCertification = useCallback(
    (cert: string) => {
      if (cert.trim() && !resumeData.certifications.includes(cert.trim())) {
        setResumeData((prev) => ({
          ...prev,
          certifications: [...prev.certifications, cert.trim()],
        }));
        setCurrentCertification("");
      }
    },
    [resumeData.certifications],
  );

  const removeCertification = useCallback((certToRemove: string) => {
    setResumeData((prev) => ({
      ...prev,
      certifications: prev.certifications.filter(
        (cert) => cert !== certToRemove,
      ),
    }));
  }, []);

  // ATS Analysis function
  const analyzeATS = useCallback(async () => {
    setATSLoading(true);
    try {
      const response = await fetch('/api/ats/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalInfo: resumeData.personalInfo,
          professionalSummary: resumeData.professionalSummary,
          education: resumeData.education,
          workExperience: resumeData.workExperience,
          skills: resumeData.skills,
          certifications: resumeData.certifications,
          projects: resumeData.projects,
          template: activeTemplate,
          sectionOrder
        }),
      });

      const result = await response.json();
      if (result.success) {
        setATSScore(result.data.atsScore);
      }
    } catch (error) {
      console.error('Error analyzing ATS score:', error);
    } finally {
      setATSLoading(false);
    }
  }, [resumeData, activeTemplate, sectionOrder]);

  // Save resume function
  const saveResume = useCallback(async () => {
    try {
      const resumePayload = {
        personalInfo: resumeData.personalInfo,
        professionalSummary: resumeData.professionalSummary,
        education: resumeData.education,
        workExperience: resumeData.workExperience,
        skills: resumeData.skills,
        certifications: resumeData.certifications,
        projects: resumeData.projects,
        profilePicture: resumeData.profilePicture,
        template: activeTemplate,
        sectionOrder
      };

      const response = await fetch(savedResumeId ? `/api/resumes/${savedResumeId}` : '/api/resumes', {
        method: savedResumeId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumePayload),
      });

      const result = await response.json();
      if (result.success) {
        setSavedResumeId(result.data._id);
        if (result.data.atsScore) {
          setATSScore(result.data.atsScore);
        }
      }
    } catch (error) {
      console.error('Error saving resume:', error);
    }
  }, [resumeData, activeTemplate, sectionOrder, savedResumeId]);

  // Auto-save on data changes
  useEffect(() => {
    const timer = setTimeout(() => {
      if (resumeData.personalInfo.fullName && resumeData.personalInfo.email) {
        saveResume();
      }
    }, 2000); // Auto-save after 2 seconds of inactivity

    return () => clearTimeout(timer);
  }, [resumeData, saveResume]);

  // PDF Download function
  const downloadPDF = useCallback(() => {
    // In a real implementation, you would use a library like jsPDF or html2pdf
    const element = document.getElementById("resume-preview");
    if (element) {
      alert(
        "PDF download functionality would be implemented here using html2pdf.js or similar library",
      );
    }
  }, []);

  const sections = [
    {
      id: "personal",
      name: "Personal Information",
      icon: User,
      required: true,
    },
    {
      id: "summary",
      name: "Professional Summary",
      icon: FileText,
      required: false,
    },
    {
      id: "experience",
      name: "Work Experience",
      icon: Briefcase,
      required: false,
    },
    {
      id: "education",
      name: "Education",
      icon: GraduationCap,
      required: false,
    },
    { id: "skills", name: "Skills", icon: Code, required: false },
    {
      id: "certifications",
      name: "Certifications",
      icon: Award,
      required: false,
    },
    { id: "projects", name: "Projects", icon: FolderOpen, required: false },
  ];

  const getCurrentTemplate = () => {
    return templates.find((t) => t.id === activeTemplate) || templates[0];
  };

  const currentTemplate = getCurrentTemplate();

  // Render section content for live preview
  const renderSectionContent = useCallback(
    (sectionConfig: SectionOrder) => {
      const sectionId = sectionConfig.id;

      if (sectionId === "summary" && resumeData.professionalSummary) {
        return (
          <div key="summary">
            <h2
              className={`text-xl font-bold ${currentTemplate.sectionHeader} mb-3 border-b pb-1`}
            >
              Professional Summary
            </h2>
            <p className="text-gray-700 leading-relaxed">
              {resumeData.professionalSummary}
            </p>
          </div>
        );
      }

      if (sectionId === "experience" && resumeData.workExperience.length > 0) {
        return (
          <div key="experience">
            <h2
              className={`text-xl font-bold ${currentTemplate.sectionHeader} mb-3 border-b pb-1`}
            >
              Work Experience
            </h2>
            <div className="space-y-4">
              {resumeData.workExperience.map((work) => (
                <div key={work.id}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {work.position || "Software Developer Intern"}
                      </h3>
                      <p className={`${currentTemplate.accent} font-medium`}>
                        {work.company || "Company Name"}
                      </p>
                    </div>
                    <span className="text-gray-500 text-sm">
                      {work.startDate && work.endDate
                        ? `${work.startDate} - ${work.endDate}`
                        : work.startDate || work.endDate || "2023-08 - Present"}
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

      if (sectionId === "education" && resumeData.education.length > 0) {
        return (
          <div key="education">
            <h2
              className={`text-xl font-bold ${currentTemplate.sectionHeader} mb-3 border-b pb-1`}
            >
              Education
            </h2>
            <div className="space-y-3">
              {resumeData.education.map((edu) => (
                <div key={edu.id} className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900">
                      {edu.degree} {edu.field && `in ${edu.field}`}
                    </h3>
                    <p className={`${currentTemplate.accent} font-medium`}>
                      {edu.school}
                    </p>
                    {edu.gpa && (
                      <p className="text-gray-600 text-sm">GPA: {edu.gpa}</p>
                    )}
                  </div>
                  <span className="text-gray-500 text-sm">
                    {edu.startDate && edu.endDate
                      ? `${edu.startDate} - ${edu.endDate}`
                      : edu.startDate || edu.endDate || "Date Range"}
                  </span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      if (sectionId === "skills" && resumeData.skills.length > 0) {
        return (
          <div key="skills">
            <h2
              className={`text-xl font-bold ${currentTemplate.sectionHeader} mb-3 border-b pb-1`}
            >
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

      if (sectionId === "projects" && resumeData.projects.length > 0) {
        return (
          <div key="projects">
            <h2
              className={`text-xl font-bold ${currentTemplate.sectionHeader} mb-3 border-b pb-1`}
            >
              Projects
            </h2>
            <div className="space-y-4">
              {resumeData.projects.map((project) => (
                <div key={project.id}>
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-gray-900">
                      {project.name || "Project Name"}
                    </h3>
                    {project.link && (
                      <a
                        href={project.link}
                        className={`${currentTemplate.accent} text-sm hover:underline`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        View Project
                      </a>
                    )}
                  </div>
                  {project.technologies && (
                    <p className="text-gray-600 text-sm mb-1">
                      <span className="font-medium">Technologies:</span>{" "}
                      {project.technologies}
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

      if (
        sectionId === "certifications" &&
        resumeData.certifications.length > 0
      ) {
        return (
          <div key="certifications">
            <h2
              className={`text-xl font-bold ${currentTemplate.sectionHeader} mb-3 border-b pb-1`}
            >
              Certifications
            </h2>
            <div className="space-y-2">
              {resumeData.certifications.map((cert) => (
                <div key={cert} className="flex items-center">
                  <div
                    className={`w-2 h-2 ${currentTemplate.accent.replace("text-", "bg-")} rounded-full mr-3`}
                  ></div>
                  <span className="text-gray-700">{cert}</span>
                </div>
              ))}
            </div>
          </div>
        );
      }

      return null;
    },
    [resumeData, currentTemplate],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2 md:space-x-4">
              <Link to="/">
                <Button variant="ghost" size="sm" className="p-2 md:px-3">
                  <ArrowLeft className="w-4 h-4 md:mr-2" />
                  <span className="hidden md:inline">Back to Home</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <h1 className="text-lg md:text-xl font-bold text-gray-900 hidden sm:block">
                  AI Resume Builder
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-1 md:space-x-3">
              <Button variant="outline" size="sm" className="hidden md:flex">
                <Upload className="w-4 h-4 mr-2" />
                Upload Resume
              </Button>
              <Button variant="outline" size="sm" className="hidden sm:flex">
                <RotateCcw className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Clear All</span>
              </Button>
              <Button
                onClick={downloadPDF}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Download className="w-4 h-4 md:mr-2" />
                <span className="hidden md:inline">Download PDF</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-3 md:px-4 py-4 md:py-6">
        <div className="grid lg:grid-cols-2 gap-4 md:gap-6 lg:gap-8">
          {/* Left Panel - Collapsible Sections */}
          <div className="space-y-3 md:space-y-4">
            {sections.map((section) => {
              const Icon = section.icon;
              const isCollapsed = collapsedSections.has(section.id);

              return (
                <Collapsible
                  key={section.id}
                  open={!isCollapsed}
                  onOpenChange={() => toggleSection(section.id)}
                >
                  <Card className="border-gray-200">
                    <CollapsibleTrigger asChild>
                      <CardHeader className="cursor-pointer hover:bg-orange-50 hover:border-orange-200 transition-all duration-200 border border-transparent p-3 md:p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2 md:space-x-3 min-w-0 flex-1">
                            <div className="w-5 h-5 md:w-6 md:h-6 rounded flex items-center justify-center text-gray-600 flex-shrink-0">
                              <Icon className="w-4 h-4 md:w-5 md:h-5" />
                            </div>
                            <span className="font-medium text-gray-800 text-sm md:text-base truncate">
                              {section.name}
                            </span>
                            {section.required && (
                              <Badge
                                variant="secondary"
                                className="text-xs bg-orange-100 text-orange-700 hidden sm:inline-flex"
                              >
                                Required
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-1 md:space-x-2 flex-shrink-0">
                            {section.id === "experience" && (
                              <Button
                                size="sm"
                                className="bg-orange-500 hover:bg-orange-600 text-white h-7 px-2 md:px-3 text-xs"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Sparkles className="w-3 h-3 md:mr-1" />
                                <span className="hidden md:inline">AI Suggest</span>
                              </Button>
                            )}
                            {isCollapsed ? (
                              <ChevronDown className="w-4 h-4 text-gray-400" />
                            ) : (
                              <ChevronUp className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                        </div>
                      </CardHeader>
                    </CollapsibleTrigger>

                    <CollapsibleContent>
                      <CardContent className="pt-0 px-3 md:px-6 pb-3 md:pb-6 space-y-4">
                        {/* Personal Info Section */}
                        {section.id === "personal" && (
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
                            <div className="grid grid-cols-1 gap-3">
                              <div>
                                <Label htmlFor="fullName">Full Name *</Label>
                                <Input
                                  id="fullName"
                                  placeholder="Jashwanth Sheri"
                                  value={resumeData.personalInfo.fullName}
                                  onChange={(e) =>
                                    updatePersonalInfo(
                                      "fullName",
                                      e.target.value,
                                    )
                                  }
                                  className="h-9 text-sm"
                                />
                              </div>
                              <div>
                                <Label htmlFor="email">Email Address *</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="jashwanthsheri68@gmail.com"
                                  value={resumeData.personalInfo.email}
                                  onChange={(e) =>
                                    updatePersonalInfo("email", e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="phone">Phone Number *</Label>
                                <Input
                                  id="phone"
                                  placeholder="9010449268"
                                  value={resumeData.personalInfo.phone}
                                  onChange={(e) =>
                                    updatePersonalInfo("phone", e.target.value)
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="location">Location *</Label>
                                <Input
                                  id="location"
                                  placeholder="Hyderabad"
                                  value={resumeData.personalInfo.location}
                                  onChange={(e) =>
                                    updatePersonalInfo(
                                      "location",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="website">Website</Label>
                                <Input
                                  id="website"
                                  placeholder="https://jashwanthsheri.netlify.app/"
                                  value={resumeData.personalInfo.website}
                                  onChange={(e) =>
                                    updatePersonalInfo(
                                      "website",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div>
                                <Label htmlFor="linkedin">LinkedIn</Label>
                                <Input
                                  id="linkedin"
                                  placeholder="https://www.linkedin.com/in/jashwanth-sheri/"
                                  value={resumeData.personalInfo.linkedin}
                                  onChange={(e) =>
                                    updatePersonalInfo(
                                      "linkedin",
                                      e.target.value,
                                    )
                                  }
                                />
                              </div>
                              <div className="col-span-2">
                                <Label htmlFor="github">GitHub</Label>
                                <Input
                                  id="github"
                                  placeholder="https://github.com/Jashwanth-Sheri"
                                  value={resumeData.personalInfo.github}
                                  onChange={(e) =>
                                    updatePersonalInfo("github", e.target.value)
                                  }
                                />
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Professional Summary Section */}
                        {section.id === "summary" && (
                          <div className="space-y-4">
                            <Textarea
                              placeholder="Write a compelling professional summary that highlights your key achievements and career goals..."
                              className="min-h-[120px]"
                              value={resumeData.professionalSummary}
                              onChange={(e) =>
                                updateProfessionalSummary(e.target.value)
                              }
                            />
                          </div>
                        )}

                        {/* Education Section */}
                        {section.id === "education" && (
                          <div className="space-y-4">
                            {resumeData.education.map((edu) => (
                              <Card key={edu.id} className="border-gray-200">
                                <CardContent className="pt-4">
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 gap-3">
                                      <div>
                                        <Label>School/University</Label>
                                        <Input
                                          placeholder="University of California"
                                          value={edu.school}
                                          onChange={(e) =>
                                            updateEducation(
                                              edu.id,
                                              "school",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Degree</Label>
                                        <Input
                                          placeholder="Bachelor of Science"
                                          value={edu.degree}
                                          onChange={(e) =>
                                            updateEducation(
                                              edu.id,
                                              "degree",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Field of Study</Label>
                                        <Input
                                          placeholder="Computer Science"
                                          value={edu.field}
                                          onChange={(e) =>
                                            updateEducation(
                                              edu.id,
                                              "field",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>GPA (Optional)</Label>
                                        <Input
                                          placeholder="3.8"
                                          value={edu.gpa}
                                          onChange={(e) =>
                                            updateEducation(
                                              edu.id,
                                              "gpa",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Start Date</Label>
                                        <Input
                                          type="month"
                                          value={edu.startDate}
                                          onChange={(e) =>
                                            updateEducation(
                                              edu.id,
                                              "startDate",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>End Date</Label>
                                        <Input
                                          type="month"
                                          value={edu.endDate}
                                          onChange={(e) =>
                                            updateEducation(
                                              edu.id,
                                              "endDate",
                                              e.target.value,
                                            )
                                          }
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
                            <Button
                              onClick={addEducation}
                              variant="outline"
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Education
                            </Button>
                          </div>
                        )}

                        {/* Work Experience Section */}
                        {section.id === "experience" && (
                          <div className="space-y-4">
                            {resumeData.workExperience.map((work) => (
                              <Card key={work.id} className="border-gray-200">
                                <CardContent className="pt-4">
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 gap-3">
                                      <div>
                                        <Label>Company</Label>
                                        <Input
                                          placeholder="Tech Corp"
                                          value={work.company}
                                          onChange={(e) =>
                                            updateWorkExperience(
                                              work.id,
                                              "company",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Position</Label>
                                        <Input
                                          placeholder="Software Engineer"
                                          value={work.position}
                                          onChange={(e) =>
                                            updateWorkExperience(
                                              work.id,
                                              "position",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Start Date</Label>
                                        <Input
                                          type="month"
                                          value={work.startDate}
                                          onChange={(e) =>
                                            updateWorkExperience(
                                              work.id,
                                              "startDate",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>End Date</Label>
                                        <Input
                                          type="month"
                                          value={work.endDate}
                                          onChange={(e) =>
                                            updateWorkExperience(
                                              work.id,
                                              "endDate",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Label className="flex items-center justify-between">
                                        Job Description
                                        <Button
                                          size="sm"
                                          className="bg-orange-500 hover:bg-orange-600 text-white h-7 px-3 text-xs"
                                        >
                                          <Sparkles className="w-3 h-3 mr-1" />
                                          AI Suggest
                                        </Button>
                                      </Label>
                                      <Textarea
                                        placeholder="Describe your key responsibilities and achievements..."
                                        className="min-h-[100px]"
                                        value={work.description}
                                        onChange={(e) =>
                                          updateWorkExperience(
                                            work.id,
                                            "description",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <Button
                                      variant="destructive"
                                      size="sm"
                                      className="w-fit"
                                      onClick={() =>
                                        removeWorkExperience(work.id)
                                      }
                                    >
                                      <Trash2 className="w-4 h-4 mr-1" />
                                      Remove
                                    </Button>
                                  </div>
                                </CardContent>
                              </Card>
                            ))}
                            <Button
                              onClick={addWorkExperience}
                              variant="outline"
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Work Experience
                            </Button>
                          </div>
                        )}

                        {/* Skills Section */}
                        {section.id === "skills" && (
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                              <Input
                                placeholder="Add a skill"
                                value={currentSkill}
                                onChange={(e) =>
                                  setCurrentSkill(e.target.value)
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    addSkill(currentSkill);
                                  }
                                }}
                                className="flex-1"
                              />
                              <Button onClick={() => addSkill(currentSkill)} className="w-full sm:w-auto">
                                <Plus className="w-4 h-4 sm:mr-0" />
                                <span className="ml-2 sm:hidden">Add Skill</span>
                              </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                              {resumeData.skills.map((skill) => (
                                <Badge
                                  key={skill}
                                  variant="secondary"
                                  className="px-3 py-1"
                                >
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
                        {section.id === "certifications" && (
                          <div className="space-y-4">
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                              <Input
                                placeholder="Add a certification"
                                value={currentCertification}
                                onChange={(e) =>
                                  setCurrentCertification(e.target.value)
                                }
                                onKeyPress={(e) => {
                                  if (e.key === "Enter") {
                                    addCertification(currentCertification);
                                  }
                                }}
                                className="flex-1"
                              />
                              <Button
                                onClick={() =>
                                  addCertification(currentCertification)
                                }
                                className="w-full sm:w-auto"
                              >
                                <Plus className="w-4 h-4 sm:mr-0" />
                                <span className="ml-2 sm:hidden">Add Certification</span>
                              </Button>
                            </div>
                            <div className="space-y-2">
                              {resumeData.certifications.map((cert) => (
                                <div
                                  key={cert}
                                  className="flex items-center justify-between p-3 border rounded-lg"
                                >
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
                        {section.id === "projects" && (
                          <div className="space-y-4">
                            {resumeData.projects.map((project) => (
                              <Card
                                key={project.id}
                                className="border-gray-200"
                              >
                                <CardContent className="pt-4">
                                  <div className="space-y-3">
                                    <div className="grid grid-cols-1 gap-3">
                                      <div>
                                        <Label>Project Name</Label>
                                        <Input
                                          placeholder="E-commerce Website"
                                          value={project.name}
                                          onChange={(e) =>
                                            updateProject(
                                              project.id,
                                              "name",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                      <div>
                                        <Label>Technologies Used</Label>
                                        <Input
                                          placeholder="React, Node.js, MongoDB"
                                          value={project.technologies}
                                          onChange={(e) =>
                                            updateProject(
                                              project.id,
                                              "technologies",
                                              e.target.value,
                                            )
                                          }
                                        />
                                      </div>
                                    </div>
                                    <div>
                                      <Label>Description</Label>
                                      <Textarea
                                        placeholder="Describe the project, your role, and key achievements..."
                                        className="min-h-[80px]"
                                        value={project.description}
                                        onChange={(e) =>
                                          updateProject(
                                            project.id,
                                            "description",
                                            e.target.value,
                                          )
                                        }
                                      />
                                    </div>
                                    <div>
                                      <Label>Project Link (Optional)</Label>
                                      <Input
                                        placeholder="https://github.com/username/project"
                                        value={project.link}
                                        onChange={(e) =>
                                          updateProject(
                                            project.id,
                                            "link",
                                            e.target.value,
                                          )
                                        }
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
                            <Button
                              onClick={addProject}
                              variant="outline"
                              className="w-full"
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Add Project
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>

          {/* Right Panel - Preview */}
          <div className="space-y-4 md:space-y-6 lg:sticky lg:top-24 h-fit">
            {/* Header Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-lg font-semibold">
                  {viewMode === 'preview' ? 'Resume Preview' : 'ATS Analysis'}
                </h2>

                {/* View Toggle */}
                <div className="flex items-center bg-gray-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'preview' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('preview')}
                    className="h-8 px-3 text-xs"
                  >
                    <Eye className="w-3 h-3 mr-1" />
                    Preview
                  </Button>
                  <Button
                    variant={viewMode === 'ats' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('ats')}
                    className="h-8 px-3 text-xs"
                  >
                    <Target className="w-3 h-3 mr-1" />
                    ATS Score
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Dialog
                  open={isTemplateDialogOpen}
                  onOpenChange={setIsTemplateDialogOpen}
                >
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Template
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl">
                    <DialogHeader>
                      <DialogTitle>Choose a Template</DialogTitle>
                    </DialogHeader>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
                      {templates.map((template) => (
                        <div
                          key={template.id}
                          className={`border-2 rounded-lg p-4 cursor-pointer transition-all hover:shadow-lg ${
                            activeTemplate === template.id
                              ? "border-orange-500 bg-orange-50"
                              : "border-gray-200"
                          }`}
                          onClick={() => {
                            setActiveTemplate(template.id);
                            setIsTemplateDialogOpen(false);
                          }}
                        >
                          <div
                            className={`w-full h-32 rounded mb-3 ${template.color} flex items-center justify-center text-white font-medium`}
                          >
                            {template.name}
                          </div>
                          <h3 className="font-medium text-sm">
                            {template.name}
                          </h3>
                          <p className="text-xs text-gray-500 mt-1">
                            {template.preview}
                          </p>
                        </div>
                      ))}
                    </div>
                  </DialogContent>
                </Dialog>
                {viewMode === 'preview' && (
                  <Button
                    variant={isReorderMode ? "default" : "outline"}
                    size="sm"
                    onClick={() => setIsReorderMode(!isReorderMode)}
                  >
                    {isReorderMode ? (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Save Order
                      </>
                    ) : (
                      <>
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Reorder
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>

            {/* Reorder Instructions */}
            {isReorderMode && (
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                <p className="text-sm text-orange-700">
                  <strong>Reorder Mode:</strong> Drag and drop sections below to
                  reorder them. Personal Information cannot be moved.
                </p>
              </div>
            )}

            {/* ATS Score Analysis */}
            {viewMode === 'ats' && (
              <ATSScoreCard
                score={atsScore || {
                  totalScore: 0,
                  contactInfoScore: 0,
                  keywordsScore: 0,
                  formatScore: 0,
                  experienceScore: 0,
                  skillsScore: 0,
                  suggestions: ['Start building your resume to see ATS analysis'],
                  lastUpdated: new Date()
                }}
                loading={atsLoading}
                onAnalyze={analyzeATS}
                onViewSuggestions={() => {
                  // Could open a detailed suggestions modal
                  alert('Detailed suggestions modal would open here');
                }}
              />
            )}

            {/* Live Preview */}
            {viewMode === 'preview' && (
            <Card>
              <CardContent className="p-0">
                <div
                  id="resume-preview"
                  className="bg-white rounded-lg min-h-[700px] shadow-sm overflow-hidden"
                >
                  {/* Resume Preview Content with Live Updates */}
                  <div className="space-y-6">
                    {/* Header - Always at top, not draggable */}
                    <div
                      className={`${currentTemplate.headerBg} ${currentTemplate.headerText} p-6`}
                    >
                      <div className="flex items-center space-x-4">
                        {resumeData.profilePicture && (
                          <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-white/20 flex-shrink-0">
                            <img
                              src={resumeData.profilePicture}
                              alt="Profile"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <h1 className="text-3xl font-bold">
                            {resumeData.personalInfo.fullName ||
                              "Jashwanth Sheri"}
                          </h1>
                          <p className="text-lg opacity-90 mt-1">
                            {resumeData.workExperience[0]?.position ||
                              "Software Developer"}
                          </p>
                          <div className="flex flex-wrap items-center space-x-4 text-sm mt-3 opacity-90">
                            <span>
                              {resumeData.personalInfo.email ||
                                "jashwanthsheri68@gmail.com"}
                            </span>
                            <span>
                              {resumeData.personalInfo.phone || "9010449268"}
                            </span>
                            <span>
                              {resumeData.personalInfo.location || "Hyderabad"}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center space-x-4 text-sm mt-1 opacity-90">
                            {resumeData.personalInfo.linkedin && (
                              <span>
                                <strong>LinkedIn:</strong>{" "}
                                {resumeData.personalInfo.linkedin}
                              </span>
                            )}
                            {resumeData.personalInfo.website && (
                              <span>
                                <strong>Website:</strong>{" "}
                                {resumeData.personalInfo.website}
                              </span>
                            )}
                          </div>
                          {resumeData.personalInfo.github && (
                            <div className="text-sm mt-1 opacity-90">
                              <span>
                                <strong>GitHub:</strong>{" "}
                                {resumeData.personalInfo.github}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="px-6 pb-6 space-y-6">
                      {/* Dynamic Sections - Draggable in reorder mode */}
                      {sectionOrder
                        .filter((section) => section.visible)
                        .map((sectionConfig, index) => {
                          const content = renderSectionContent(sectionConfig);
                          if (!content) return null;

                          if (isReorderMode) {
                            return (
                              <div
                                key={sectionConfig.id}
                                draggable
                                onDragStart={(e) =>
                                  handleDragStart(e, sectionConfig.id)
                                }
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, sectionConfig.id)}
                                onDragEnd={handleDragEnd}
                                className={`border-2 border-dashed border-orange-300 rounded-lg p-4 cursor-move transition-all hover:border-orange-400 hover:shadow-md ${
                                  draggedSection === sectionConfig.id
                                    ? "opacity-50"
                                    : "opacity-100"
                                }`}
                              >
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <GripVertical className="w-4 h-4 text-orange-500" />
                                    <span className="text-sm font-medium text-orange-700">
                                      Drag to reorder: {sectionConfig.name}
                                    </span>
                                  </div>
                                </div>
                                {content}
                              </div>
                            );
                          }

                          return content;
                        })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
