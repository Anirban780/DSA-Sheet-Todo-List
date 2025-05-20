import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";


export async function getUsersForQuestion(questionId: string) {
    const snapshot = await getDocs(collection(
        db, `questions/${questionId}/practicedBy`
    ));

    return snapshot.docs.map(doc => ({
        uid: doc.id,
        ...doc.data(),
    }));
}