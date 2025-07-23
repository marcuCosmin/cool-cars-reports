import { signInWithCustomToken } from "firebase/auth"
import {
  collection,
  doc,
  DocumentReference,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  Timestamp,
  updateDoc,
  where,
} from "firebase/firestore"
import { firebaseAuth, firestore } from "./config"

import { Answer, OdoReading } from "@/redux/answersSlice"
import { withErrorPropagation } from "@/utils/withErrorPropagation"

export type Question = {
  label: string
}

export type QuestionDoc = {
  interior: Question[]
  exterior: Question[]
}

export const getQuestions = withErrorPropagation("QUESTIONS", async () => {
  const questionsRef = doc(firestore, "reports-config", "questions")

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

export type CheckDoc = {
  creationTimestamp: Timestamp
  driverId: string
  odoReading: OdoReading
  interior: Answer[]
  exterior: Answer[]
}

type GetCheckProps = {
  carId: string
  checkId: string
}

export const getCheck = withErrorPropagation(
  "GET CHECK",
  async ({ carId, checkId }: GetCheckProps) => {
    const checkRef = doc(firestore, "cars", carId, "checks", checkId)
    const checkSnapshot = await getDoc(checkRef)

    if (!checkSnapshot.exists()) {
      return
    }

    const check = checkSnapshot.data() as CheckDoc

    return check
  }
)

export type FaultDoc = {
  driverId: string
  creationTimestamp: Timestamp
  description: string
  checkId: string
  carId: string
  status: "pending" | "resolved"
}

export const getCheckFaults = withErrorPropagation(
  "GET CHECK FAULTS",
  async ({ carId, checkId }: GetCheckProps) => {
    const faultsRef = collection(firestore, "cars", carId, "faults")
    const faultsQuery = query(faultsRef, where("checkId", "==", checkId))
    const faultsSnapshot = await getDocs(faultsQuery)

    if (faultsSnapshot.empty) {
      return []
    }

    const data = faultsSnapshot.docs.map((doc) => doc.data() as FaultDoc)

    return data
  }
)

export type IncidentDoc = {
  description: string
  creationTimestamp: Timestamp
  driverId: string
  status: "pending" | "resolved"
}

type GetIncidentProps = {
  carId: string
  incidentId: string
}

export const getIncident = withErrorPropagation(
  "GET INCIDENT",
  async ({ carId, incidentId }: GetIncidentProps) => {
    const incidentRef = doc(firestore, "cars", carId, "incidents", incidentId)
    const incidentSnapshot = await getDoc(incidentRef)

    if (!incidentSnapshot.exists()) {
      return
    }

    const incident = incidentSnapshot.data() as IncidentDoc

    return incident
  }
)

type ReportsNotificationType = "incident" | "check" | "fault"

export type Notification = {
  id: string
  creationTimestamp: Timestamp
  viewed: boolean
  carId: string
  bulkCount?: number
  type: ReportsNotificationType
  reference: {
    path: ReportsNotificationType
    id: string
  }
}

type GetNotificationsProps = {
  uid: string
  lastDocRef?: DocumentReference
}

export const getNotificationsChunk = withErrorPropagation(
  "NOTIFICATIONS",
  async ({ uid, lastDocRef }: GetNotificationsProps) => {
    const notificationsRef = collection(
      firestore,
      "users",
      uid,
      "notifications"
    )

    const queryConstraints = [
      orderBy("creationTimestamp", "desc"),
      lastDocRef && startAfter(lastDocRef),
      limit(10),
    ].filter(Boolean) as QueryConstraint[]

    const notificationsQuery = query(notificationsRef, ...queryConstraints)

    const notificationsSnapshot = await getDocs(notificationsQuery)

    if (notificationsSnapshot.empty) {
      return
    }

    const notificationsDocs = notificationsSnapshot.docs
    const lastDoc = notificationsDocs[notificationsDocs.length - 1]

    const notifications = notificationsDocs.map((doc) => {
      const data = doc.data() as Omit<Notification, "id">

      return {
        id: doc.id,
        ...data,
      }
    })

    return { notifications, lastDocRef: lastDoc.ref }
  }
)

type MarkNotificationAsViewedProps = {
  uid: string
  notificationId: string
}

export const markNotificationAsViewed = withErrorPropagation(
  "MARK NOTIFICATION AS VIEWED",
  async ({ uid, notificationId }: MarkNotificationAsViewedProps) => {
    const notificationRef = doc(
      firestore,
      "users",
      uid,
      "notifications",
      notificationId
    )

    await updateDoc(notificationRef, { viewed: true })
  }
)

export const signIn = withErrorPropagation("SIGN IN", (authToken: string) =>
  signInWithCustomToken(firebaseAuth, authToken)
)
