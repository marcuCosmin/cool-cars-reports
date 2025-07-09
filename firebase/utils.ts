import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { firestore } from "./config"

export type Question = {
  label: string
}

export type QuestionDoc = {
  interior: Question[]
  exterior: Question[]
}

export const getQuestions = async () => {
  const questionsRef = doc(firestore, "daily-checks", "questions")

  const questionsSnapshot = await getDoc(questionsRef)

  if (!questionsSnapshot.exists()) {
    return
  }

  return questionsSnapshot.data() as QuestionDoc
}

export type Car = {
  id: string
}

export const getCars = async () => {
  const carsRef = collection(firestore, "cars")
  const carsSnapshot = await getDocs(carsRef)

  if (carsSnapshot.empty) {
    return []
  }

  const snapshotDocs = carsSnapshot.docs as Car[]

  return snapshotDocs.map((doc) => ({ id: doc.id }))
}
