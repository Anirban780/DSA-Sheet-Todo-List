export interface Problem {
  id?: string;         // Firestore document id (optional when adding new)
  topic?: string;      // Optional topic name
  question: string;    // Problem title/question
  link: string;        // URL to the problem
  practiced: boolean;  // Whether problem is marked practiced or not
}
