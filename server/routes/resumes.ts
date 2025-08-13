import { RequestHandler } from "express";
import Resume, { IResume } from "../models/Resume";
import connectToDatabase from "../utils/database";

// In-memory storage for development (fallback when MongoDB is not available)
let inMemoryResumes: any[] = [];
let nextId = 1;

// Helper function to check if MongoDB is available
async function isMongoDBAvailable(): Promise<boolean> {
  try {
    await connectToDatabase();
    return true;
  } catch (error) {
    console.warn('MongoDB not available, using in-memory storage for development');
    return false;
  }
}

// Get all resumes for a user
export const getResumes: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { userId } = req.query;
    const resumes = await Resume.find(userId ? { userId } : {})
      .select('-__v')
      .sort({ updatedAt: -1 })
      .limit(20);
    
    res.json({
      success: true,
      data: resumes,
      count: resumes.length
    });
  } catch (error) {
    console.error('Error fetching resumes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resumes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get a single resume by ID
export const getResumeById: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { id } = req.params;
    const resume = await Resume.findById(id).select('-__v');
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    res.json({
      success: true,
      data: resume
    });
  } catch (error) {
    console.error('Error fetching resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch resume',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Create a new resume
export const createResume: RequestHandler = async (req, res) => {
  try {
    const resumeData = req.body;

    // Validate required fields
    if (!resumeData.personalInfo || !resumeData.personalInfo.fullName || !resumeData.personalInfo.email) {
      return res.status(400).json({
        success: false,
        message: 'Personal information with name and email is required'
      });
    }

    const mongoAvailable = await isMongoDBAvailable();

    if (mongoAvailable) {
      // Use MongoDB
      const resume = new Resume(resumeData);
      await resume.save();

      res.status(201).json({
        success: true,
        data: resume,
        message: 'Resume created successfully'
      });
    } else {
      // Use in-memory storage
      const resume = {
        _id: nextId++,
        ...resumeData,
        createdAt: new Date(),
        updatedAt: new Date(),
        atsScore: {
          totalScore: 75,
          contactInfoScore: 15,
          keywordsScore: 20,
          formatScore: 15,
          experienceScore: 15,
          skillsScore: 10,
          suggestions: ['Add more relevant keywords', 'Include LinkedIn profile'],
          lastUpdated: new Date()
        }
      };

      inMemoryResumes.push(resume);

      res.status(201).json({
        success: true,
        data: resume,
        message: 'Resume created successfully (dev mode)'
      });
    }
  } catch (error) {
    console.error('Error creating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create resume',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Update an existing resume
export const updateResume: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const mongoAvailable = await isMongoDBAvailable();

    if (mongoAvailable) {
      // Use MongoDB
      const resume = await Resume.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      ).select('-__v');

      if (!resume) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }

      res.json({
        success: true,
        data: resume,
        message: 'Resume updated successfully'
      });
    } else {
      // Use in-memory storage
      const resumeIndex = inMemoryResumes.findIndex(r => r._id == id);

      if (resumeIndex === -1) {
        return res.status(404).json({
          success: false,
          message: 'Resume not found'
        });
      }

      inMemoryResumes[resumeIndex] = {
        ...inMemoryResumes[resumeIndex],
        ...updateData,
        updatedAt: new Date(),
        atsScore: {
          totalScore: 75,
          contactInfoScore: 15,
          keywordsScore: 20,
          formatScore: 15,
          experienceScore: 15,
          skillsScore: 10,
          suggestions: ['Add more relevant keywords', 'Include LinkedIn profile'],
          lastUpdated: new Date()
        }
      };

      res.json({
        success: true,
        data: inMemoryResumes[resumeIndex],
        message: 'Resume updated successfully (dev mode)'
      });
    }
  } catch (error) {
    console.error('Error updating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update resume',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Delete a resume
export const deleteResume: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { id } = req.params;
    const resume = await Resume.findByIdAndDelete(id);
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Resume deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete resume',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Get ATS score for a resume
export const getATSScore: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { id } = req.params;
    const resume = await Resume.findById(id).select('atsScore personalInfo.fullName');
    
    if (!resume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    // Recalculate ATS score if needed
    const atsScore = resume.calculateATSScore();
    
    res.json({
      success: true,
      data: {
        resumeId: resume._id,
        resumeName: resume.personalInfo.fullName,
        atsScore
      }
    });
  } catch (error) {
    console.error('Error calculating ATS score:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to calculate ATS score',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Duplicate a resume
export const duplicateResume: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { id } = req.params;
    const originalResume = await Resume.findById(id);
    
    if (!originalResume) {
      return res.status(404).json({
        success: false,
        message: 'Resume not found'
      });
    }
    
    // Create a copy without _id and with updated name
    const resumeData = originalResume.toObject();
    delete resumeData._id;
    delete resumeData.createdAt;
    delete resumeData.updatedAt;
    delete resumeData.__v;
    
    resumeData.personalInfo.fullName = `${resumeData.personalInfo.fullName} (Copy)`;
    
    const newResume = new Resume(resumeData);
    await newResume.save();
    
    res.status(201).json({
      success: true,
      data: newResume,
      message: 'Resume duplicated successfully'
    });
  } catch (error) {
    console.error('Error duplicating resume:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to duplicate resume',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// Search resumes
export const searchResumes: RequestHandler = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { q, userId, template, minScore } = req.query;
    
    let query: any = {};
    
    if (userId) query.userId = userId;
    if (template) query.template = template;
    if (minScore) query['atsScore.totalScore'] = { $gte: parseInt(minScore as string) };
    
    if (q) {
      query.$or = [
        { 'personalInfo.fullName': { $regex: q, $options: 'i' } },
        { 'personalInfo.email': { $regex: q, $options: 'i' } },
        { keywords: { $in: [new RegExp(q as string, 'i')] } }
      ];
    }
    
    const resumes = await Resume.find(query)
      .select('personalInfo.fullName personalInfo.email template atsScore.totalScore updatedAt')
      .sort({ updatedAt: -1 })
      .limit(10);
    
    res.json({
      success: true,
      data: resumes,
      count: resumes.length
    });
  } catch (error) {
    console.error('Error searching resumes:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to search resumes',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
