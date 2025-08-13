import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Upload, Plus, FileText, Sparkles, Download, Zap, Briefcase, Lightbulb } from "lucide-react";

export default function Index() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-orange-25 to-white">
      {/* Header */}
      <header className="border-b border-white/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
                <FileText className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
                ResumeForge
              </h1>
            </div>
            <div className="flex items-center space-x-2 text-xs md:text-sm text-gray-600">
              <Sparkles className="w-3 h-3 md:w-4 md:h-4" />
              <span className="hidden sm:inline">AI-Powered Resume Builder</span>
              <span className="sm:hidden">AI-Powered</span>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Create Your Perfect Resume in
            <span className="bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent">
              {" "}
              Minutes
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 leading-relaxed">
            Build professional resumes with AI assistance, beautiful templates,
            and instant PDF downloads. Get hired faster with our modern resume
            builder.
          </p>

          {/* Feature highlights */}
          <div className="flex justify-center items-center space-x-8 mb-12 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <Zap className="w-4 h-4 text-orange-500" />
              <span>AI-Powered Suggestions</span>
            </div>
            <div className="flex items-center space-x-2">
              <FileText className="w-4 h-4 text-orange-600" />
              <span>Professional Templates</span>
            </div>
            <div className="flex items-center space-x-2">
              <Download className="w-4 h-4 text-green-500" />
              <span>Instant PDF Export</span>
            </div>
          </div>
        </div>

        {/* Main Action Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Upload Existing Resume Card */}
          <Card className="relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group">
            <CardHeader className="text-center pb-4">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                <Upload className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                Upload Existing Resume
              </CardTitle>
              <CardDescription className="text-gray-600 text-base">
                Have a resume already? Upload it and we'll extract your
                information automatically using AI parsing.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-4">
                <div className="flex justify-center space-x-4 text-sm text-gray-500">
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    PDF Support
                  </span>
                  <span className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    DOCX Support
                  </span>
                </div>
                <Link to="/builder?mode=upload" className="block">
                  <Button className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                    Upload & Parse Resume
                    <Upload className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Create New Resume Card with Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Card className="relative overflow-hidden border-0 shadow-xl bg-white/80 backdrop-blur-sm hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                <CardHeader className="text-center pb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-orange-600 to-orange-700 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                    <Plus className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                    Create New Resume
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-base">
                    Start fresh with our guided builder. Get AI suggestions and
                    choose from beautiful templates.
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-4">
                    <div className="flex justify-center space-x-4 text-sm text-gray-500">
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        AI Assistance
                      </span>
                      <span className="flex items-center">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        Live Preview
                      </span>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white text-lg py-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300">
                      Start Building Resume
                      <Plus className="w-5 h-5 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </DialogTrigger>

            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-center text-xl font-bold text-gray-900">
                  Choose Resume Type
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-4 mt-6">
                <div className="text-center mb-6">
                  <p className="text-gray-600">
                    Select the type of resume you'd like to create:
                  </p>
                </div>

                {/* JDE Option */}
                <Link to="/builder?type=jde" className="block">
                  <Card className="border-2 border-orange-200 hover:border-orange-400 transition-colors cursor-pointer hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                          <Briefcase className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Job Description Enhanced (JDE)</h3>
                          <p className="text-sm text-gray-600">AI-optimized for specific job descriptions</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* Standard Option */}
                <Link to="/builder?type=standard" className="block">
                  <Card className="border-2 border-gray-200 hover:border-orange-400 transition-colors cursor-pointer hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-gray-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">Standard Resume</h3>
                          <p className="text-sm text-gray-600">General purpose resume template</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>

                {/* AI-Powered Option */}
                <Link to="/builder?type=ai-enhanced" className="block">
                  <Card className="border-2 border-purple-200 hover:border-orange-400 transition-colors cursor-pointer hover:shadow-md">
                    <CardContent className="p-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Lightbulb className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">AI-Enhanced Resume</h3>
                          <p className="text-sm text-gray-600">Maximum AI assistance and optimization</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              </div>

              <div className="mt-6 text-center">
                <p className="text-xs text-gray-500">
                  You can change the resume type later in the builder
                </p>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        {/* Additional Features */}
        <div className="mt-20 text-center max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-900 mb-8">
            Why Choose ResumeForge?
          </h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">AI-Powered</h4>
              <p className="text-gray-600 text-sm">
                Smart suggestions for professional summaries and job
                descriptions
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <FileText className="w-6 h-6 text-orange-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Beautiful Templates
              </h4>
              <p className="text-gray-600 text-sm">
                Choose from modern, ATS-friendly resume templates
              </p>
            </div>
            <div className="p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">
                Instant Export
              </h4>
              <p className="text-gray-600 text-sm">
                Download your perfect resume as a high-quality PDF
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
