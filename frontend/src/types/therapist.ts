export type Student = { id: string; name: string };

// Student assessment data
export type Assessment = {
  studentId: string;
  studentName: string;
  date: string; // YYYY-MM-DD
  summary: string;
  strengths: string;
  difficulties: string;
  homeworkPerf: string;
  drillsPerf: string;
  classPerf: string;
  tests: string;
  homeworkAssigned: string;
  comments: string;
};
