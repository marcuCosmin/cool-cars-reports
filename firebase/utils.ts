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

const questionsPaths: Partial<Record<Councils, string>> = {
  PSV: "psv-questions",
}

export const getQuestions = withErrorPropagation(async (council: Councils) => {
  const questionsPath = questionsPaths[council] || "taxi-questions"

  const questionsRef = doc(firestore, "reports-config", questionsPath)

  const questionsSnapshot = await getDoc(questionsRef)

  if (!questionsSnapshot.exists()) {
    return
  }

  return questionsSnapshot.data() as QuestionDoc
})

type Councils = "PSV" | "Cornwall"

export type Car = {
  id: string
  council: Councils
}

export const getCars = withErrorPropagation(async () => {
  const carsRef = collection(firestore, "cars")
  const carsSnapshot = await getDocs(carsRef)

  if (carsSnapshot.empty) {
    return []
  }

  const snapshotDocs = carsSnapshot.docs

  return snapshotDocs.map((doc) => {
    const { council } = doc.data() as Omit<Car, "id">

    return {
      id: doc.id,
      council,
    }
  })
})

export type CheckDoc = {
  carId: string
  creationTimestamp: number
  driverId: string
  odoReading: OdoReading
  interior: Answer[]
  exterior: Answer[]
  faultsCount?: number
  hasUnresolvedFaults?: boolean
}

export const getCheck = withErrorPropagation(async (checkId: string) => {
  const checkRef = doc(firestore, "checks", checkId)
  const checkSnapshot = await getDoc(checkRef)

  if (!checkSnapshot.exists()) {
    return
  }

  const check = checkSnapshot.data() as CheckDoc

  return check
})

export type FaultDoc = {
  driverId: string
  creationTimestamp: number
  description: string
  checkId: string
  carId: string
  status: "pending" | "resolved"
}

export const getCheckFaults = withErrorPropagation(async (checkId: string) => {
  const faultsRef = collection(firestore, "faults")
  const faultsQuery = query(faultsRef, where("checkId", "==", checkId))
  const faultsSnapshot = await getDocs(faultsQuery)

  if (faultsSnapshot.empty) {
    return []
  }

  const data = faultsSnapshot.docs.map((doc) => doc.data() as FaultDoc)

  return data
})

export type IncidentDoc = {
  description: string
  creationTimestamp: number
  driverId: string
  status: "pending" | "resolved"
}

export const getIncident = withErrorPropagation(async (incidentId: string) => {
  const incidentRef = doc(firestore, "incidents", incidentId)
  const incidentSnapshot = await getDoc(incidentRef)

  if (!incidentSnapshot.exists()) {
    return
  }

  const incident = incidentSnapshot.data() as IncidentDoc

  return incident
})

type ReportsNotificationType =
  | "incident"
  | "check"
  | "fault"
  | "fault-resolved"
  | "incident-resolved"

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
  carId: string
  type: "all" | Notification["type"]
  startDate: number | null
  endDate: number | null
}

const getNotificationTypeConstraint = (type: Notification["type"]) => {
  switch (type) {
    case "fault":
      return where("type", "in", ["fault", "fault-resolved"])
    case "incident":
      return where("type", "in", ["incident", "incident-resolved"])
    default:
      return where("type", "==", type)
  }
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
      filters.type !== "all" && getNotificationTypeConstraint(filters.type),
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

type GetCheckSubmittedTodayProps = {
  carId: string
  uid: string
}

export const getCheckSubmittedToday = withErrorPropagation(
  async ({ carId, uid }: GetCheckSubmittedTodayProps) => {
    const checksRef = collection(firestore, "checks")

    const startOfToday = new Date()
    startOfToday.setHours(0, 0, 0, 0)
    const startTimestamp = startOfToday.getTime()

    const endOfToday = new Date(startOfToday)
    endOfToday.setHours(23, 59, 59, 999)
    const endTimestamp = endOfToday.getTime()

    const checksQuery = query(
      checksRef,
      where("carId", "==", carId),
      where("driverId", "==", uid),
      where("creationTimestamp", ">=", startTimestamp),
      where("creationTimestamp", "<=", endTimestamp)
    )

    const checksSnapshot = await getDocs(checksQuery)

    if (checksSnapshot.empty) {
      return
    }

    const [todaySubmittedCheck] = checksSnapshot.docs.map((doc) => {
      const data = doc.data() as CheckDoc

      return {
        ...data,
        id: doc.id,
      }
    })

    return todaySubmittedCheck
  }
)
