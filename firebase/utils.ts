import { FirebaseError } from "firebase/app"
import { signInWithCustomToken } from "firebase/auth"
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  QueryConstraint,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore"
import { firebaseAuth, firestore } from "./config"

import { Answer, OdoReading } from "@/redux/answersSlice"

const withErrorPropagation =
  <T extends (...args: any[]) => Promise<unknown>>(request: T) =>
  async (...args: Parameters<T>): Promise<Awaited<ReturnType<T>>> => {
    try {
      const data = await request(...args)

      return data as Awaited<ReturnType<T>>
    } catch (error) {
      if (error instanceof FirebaseError) {
        throw new Error(error.message)
      }

      if (error instanceof Error) {
        throw new Error(error.message)
      }

      throw new Error(`An unknown error occurred`)
    }
  }

export type Question = {
  label: string
}

export type QuestionDoc = {
  interior: Question[]
  exterior: Question[]
}

export const getQuestions = withErrorPropagation(async () => {
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

export const getCars = withErrorPropagation(async () => {
  const carsRef = collection(firestore, "cars")
  const carsSnapshot = await getDocs(carsRef)

  if (carsSnapshot.empty) {
    return []
  }

  const snapshotDocs = carsSnapshot.docs as Car[]

  return snapshotDocs.map((doc) => ({ id: doc.id }))
})

export type CheckDoc = {
  creationTimestamp: number
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
  creationTimestamp: number
  description: string
  checkId: string
  carId: string
  status: "pending" | "resolved"
}

export const getCheckFaults = withErrorPropagation(
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
  creationTimestamp: number
  driverId: string
  status: "pending" | "resolved"
}

type GetIncidentProps = {
  carId: string
  incidentId: string
}

export const getIncident = withErrorPropagation(
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
  creationTimestamp: number
  viewed: boolean
  carId: string
  bulkCount?: number
  type: ReportsNotificationType
  reference: {
    path: ReportsNotificationType
    id: string
  }
}

export type NotificationsFilters = {
  type: string
  startDate: number | null
  endDate: number | null
  carId: string
}

type GetNotificationsChunkProps = {
  uid: string
  lastRefValue?: number
  filters: NotificationsFilters
}

export const getNotificationsChunk = withErrorPropagation(
  async ({ uid, lastRefValue, filters }: GetNotificationsChunkProps) => {
    const notificationsRef = collection(
      firestore,
      "users",
      uid,
      "notifications"
    )

    const queryConstraints = [
      orderBy("creationTimestamp", "desc"),
      lastRefValue && startAfter(lastRefValue),
      filters.type !== "all" && where("type", "==", filters.type),
      filters.startDate && where("creationTimestamp", ">=", filters.startDate),
      filters.endDate && where("creationTimestamp", "<=", filters.endDate),
      filters.carId !== "all" && where("carId", "==", filters.carId),
      limit(5),
    ].filter(Boolean) as QueryConstraint[]

    const notificationsQuery = query(notificationsRef, ...queryConstraints)

    const notificationsSnapshot = await getDocs(notificationsQuery)

    if (notificationsSnapshot.empty) {
      return []
    }

    const notificationsDocs = notificationsSnapshot.docs

    const notifications = notificationsDocs.map((doc) => {
      const data = doc.data() as Omit<Notification, "id">

      return {
        id: doc.id,
        ...data,
      }
    })

    return notifications
  }
)

type MarkNotificationAsViewedProps = {
  uid: string
  notificationId: string
}

export const markNotificationAsViewed = withErrorPropagation(
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

export const signIn = withErrorPropagation((authToken: string) =>
  signInWithCustomToken(firebaseAuth, authToken)
)
