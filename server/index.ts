import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  getResumes,
  getResumeById,
  createResume,
  updateResume,
  deleteResume,
  getATSScore,
  duplicateResume,
  searchResumes
} from "./routes/resumes";
import {
  analyzeResume,
  getIndustryKeywords,
  suggestImprovements
} from "./routes/ats";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Resume API routes
  app.get("/api/resumes", getResumes);
  app.get("/api/resumes/search", searchResumes);
  app.get("/api/resumes/:id", getResumeById);
  app.post("/api/resumes", createResume);
  app.put("/api/resumes/:id", updateResume);
  app.delete("/api/resumes/:id", deleteResume);
  app.get("/api/resumes/:id/ats-score", getATSScore);
  app.post("/api/resumes/:id/duplicate", duplicateResume);

  // ATS Analysis routes
  app.post("/api/ats/analyze", analyzeResume);
  app.get("/api/ats/keywords", getIndustryKeywords);
  app.get("/api/ats/improvements/:id", suggestImprovements);

  return app;
}
