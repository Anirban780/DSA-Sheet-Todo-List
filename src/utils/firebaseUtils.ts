import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import type { PracticedProblem, Problem } from "../types";
import { db } from "../firebase";


export const fetchAllProblems = async() : Promise<Problem[]> => {
    const snapshot = await getDocs(collection(db, "love_babbar_sheet"));
    return snapshot.docs.map(doc => ({
        id: doc.id,
        ...(doc.data() as Omit<Problem, 'id'>)
    }));
}

export const fetchUserPracticed = async(userId: string) : Promise<Record<string, PracticedProblem>> => {
    const snapshot = await getDocs(collection(db, "users", userId, "practiced"));
    const practicedMap: Record<string, PracticedProblem> = {};

    snapshot.docs.forEach(doc => {
        practicedMap[doc.id] = {
            id: doc.id,
            question: doc.data().question,
            timestamp: doc.data().timestamp.toDate(),
        };
    });

    return practicedMap
}

export const togglePracticedStatus = async(
    userId: string,
    problem: Problem,
    currentStatus: boolean
): Promise<void> => {

    const practicedDocRef = doc(db, "users", userId, "practiced", problem.id);
    if(currentStatus) {
        await deleteDoc(practicedDocRef)
    }
    else {
        await setDoc(practicedDocRef, {
            question: problem.question,
            timestamp: new Date(),
        })
    }
}