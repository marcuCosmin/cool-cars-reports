import { useCallback, useEffect, useState } from "react"

import { getNotificationsChunk, type Notification } from "@/firebase/utils"
import { DocumentReference } from "firebase/firestore"

import { useAppSelector } from "@/redux/config"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"

export const useInfiniteNotificationsList = () => {
  const [lastDocRef, setLastDocRef] = useState<DocumentReference | undefined>()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const uid = useAppSelector(({ user }) => user.uid)

  const { isLoading, handleAsyncRequest: handleNotificationsLoad } =
    useAsyncRequestHandler({
      request: getNotificationsChunk,
    })

  const loadNotificationsChunk = useCallback(async () => {
    if (!uid) {
      return
    }

    const result = await handleNotificationsLoad({
      uid,
      lastDocRef,
    })

    if (!result) {
      return
    }

    setNotifications((prev) => [...prev, ...result.notifications])
    setLastDocRef(result.lastDocRef)
  }, [uid, lastDocRef, handleNotificationsLoad])

  useEffect(() => {
    loadNotificationsChunk()
  }, [])

  return {
    notifications,
    isLoading,
    loadNotificationsChunk,
  }
}
