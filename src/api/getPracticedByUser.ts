import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";


export async function getPracticedByUser(uid: string) {
    const snapshot = await getDocs(collection(
        db, `users/${uid}/practiced`
    ));

    return snapshot.docs.map(doc => ({
        questionId: doc.id,
        ...doc.data(),
    }))
}