import { type OdoReading } from "@/redux/answersSlice"

import { addDoc, collection, doc, getDoc, Timestamp } from "firebase/firestore"

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

type AddCheckProps = {
  uid: string
  interior: Question[]
  exterior: Question[]
  odoReading: OdoReading
}

export const addCheck = async ({
  uid,
  interior,
  exterior,
  odoReading,
}: AddCheckProps) => {
  const checkRef = collection(firestore, "daily-checks", "questions", "checks")
  const currentTime = new Date().getTime()
  const timestamp = new Timestamp(currentTime / 1000, 0)

  await addDoc(checkRef, {
    createDate: timestamp,
    driverId: uid,
    interior,
    exterior,
    odoReading,
  })
}

export const addIncident = async () => {}
