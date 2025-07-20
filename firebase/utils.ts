import { signInWithCustomToken } from "firebase/auth"
import { collection, doc, getDoc, getDocs } from "firebase/firestore"
import { firebaseAuth, firestore } from "./config"

import { withErrorPropagation } from "@/utils/withErrorPropagation"

export type Question = {
  label: string
}

export type QuestionDoc = {
  interior: Question[]
  exterior: Question[]
}

export const getQuestions = withErrorPropagation("QUESTIONS", async () => {
  const questionsRef = doc(firestore, "daily-checks", "questions")

  const questionsSnapshot = await getDoc(questionsRef)

  if (!questionsSnapshot.exists()) {
    return
  }

  return questionsSnapshot.data() as QuestionDoc
})

export type Car = {
  id: string
}

export const getCars = withErrorPropagation("CARS", async () => {
  const carsRef = collection(firestore, "cars")
  const carsSnapshot = await getDocs(carsRef)

  if (carsSnapshot.empty) {
    return []
  }

  const snapshotDocs = carsSnapshot.docs as Car[]

  return snapshotDocs.map((doc) => ({ id: doc.id }))
})

export const signIn = withErrorPropagation("SIGN IN", (authToken: string) =>
  signInWithCustomToken(firebaseAuth, authToken)
)
