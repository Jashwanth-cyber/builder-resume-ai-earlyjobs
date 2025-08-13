import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./card";
import { Progress } from "./progress";
import { Badge } from "./badge";
import { Button } from "./button";
import {
  CheckCircle,
  AlertCircle,
  XCircle,
  Target,
  TrendingUp,
  Eye,
  Lightbulb,
} from "lucide-react";

interface ATSScore {
  totalScore: number;
  contactInfoScore: number;
  keywordsScore: number;
  formatScore: number;
  experienceScore: number;
  skillsScore: number;
  suggestions: string[];
  lastUpdated: Date;
}

interface ATSScoreProps {
  score: ATSScore;
  onViewSuggestions?: () => void;
  onAnalyze?: () => void;
  loading?: boolean;
}

export function ATSScoreCard({
  score,
  onViewSuggestions,
  onAnalyze,
  loading = false,
}: ATSScoreProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (score >= 60) return <AlertCircle className="w-5 h-5 text-orange-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  if (loading) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center text-orange-700">
            <Target className="w-5 h-5 mr-2" />
            ATS Score Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
            <span className="ml-2 text-orange-600">Analyzing resume...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-orange-700">
          <div className="flex items-center">
            <Target className="w-5 h-5 mr-2" />
            ATS Score Analysis
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={onAnalyze}
            className="border-orange-300 text-orange-700 hover:bg-orange-100"
          >
            <TrendingUp className="w-4 h-4 mr-1" />
            Re-analyze
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Score */}
        <div className="text-center">
          <div className="flex items-center justify-center mb-2">
            {getScoreIcon(score.totalScore)}
            <span
              className={`ml-2 text-3xl font-bold ${getScoreColor(score.totalScore)}`}
            >
              {score.totalScore}
            </span>
            <span className="text-gray-500 text-lg ml-1">/100</span>
          </div>
          <Badge
            variant="secondary"
            className={`${getScoreColor(score.totalScore)} bg-white`}
          >
            {getScoreLabel(score.totalScore)}
          </Badge>
          <p className="text-sm text-gray-600 mt-2">
            Last updated: {new Date(score.lastUpdated).toLocaleDateString()}
          </p>
        </div>

        {/* Score Breakdown */}
        <div className="space-y-4">
          <h4 className="font-medium text-gray-800">Score Breakdown</h4>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Contact Information
                </span>
                <span className="text-sm text-gray-600">
                  {score.contactInfoScore}/20
                </span>
              </div>
              <Progress
                value={(score.contactInfoScore / 20) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Keywords & Skills
                </span>
                <span className="text-sm text-gray-600">
                  {score.keywordsScore}/25
                </span>
              </div>
              <Progress
                value={(score.keywordsScore / 25) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Format & Structure
                </span>
                <span className="text-sm text-gray-600">
                  {score.formatScore}/20
                </span>
              </div>
              <Progress
                value={(score.formatScore / 20) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Experience Details
                </span>
                <span className="text-sm text-gray-600">
                  {score.experienceScore}/20
                </span>
              </div>
              <Progress
                value={(score.experienceScore / 20) * 100}
                className="h-2"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  Skills Variety
                </span>
                <span className="text-sm text-gray-600">
                  {score.skillsScore}/15
                </span>
              </div>
              <Progress
                value={(score.skillsScore / 15) * 100}
                className="h-2"
              />
            </div>
          </div>
        </div>

        {/* Quick Suggestions */}
        {score.suggestions.length > 0 && (
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center">
              <Lightbulb className="w-4 h-4 mr-2 text-orange-600" />
              Quick Improvements
            </h4>
            <div className="space-y-2">
              {score.suggestions.slice(0, 3).map((suggestion, index) => (
                <div key={index} className="flex items-start space-x-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-orange-500 rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">{suggestion}</span>
                </div>
              ))}
            </div>
            {score.suggestions.length > 3 && onViewSuggestions && (
              <Button
                variant="outline"
                size="sm"
                onClick={onViewSuggestions}
                className="w-full border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <Eye className="w-4 h-4 mr-2" />
                View All {score.suggestions.length} Suggestions
              </Button>
            )}
          </div>
        )}

        {/* ATS Tips */}
        <div className="bg-white rounded-lg p-4 border border-orange-200">
          <h5 className="font-medium text-gray-800 mb-2">💡 ATS Tips</h5>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>
              • Use standard section headers (Experience, Education, Skills)
            </li>
            <li>• Include keywords from the job description</li>
            <li>• Use a simple, clean format without graphics</li>
            <li>• Save as PDF to preserve formatting</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default ATSScoreCard;
