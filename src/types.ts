export interface Problem {
  id: string;         // Firestore document id (optional when adding new)
  topic: string;      // Optional topic name
  question: string;    // Problem title/question
  link: string;        // URL to the problem  
}

export interface PracticedProblem {
  id: string;
  question: string;
  timestamp: Date;
}