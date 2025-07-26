import { useEffect, useRef, useState } from "react"

import { getNotificationsChunk, type Notification } from "@/firebase/utils"
import { Timestamp } from "firebase/firestore"

import { useAppSelector } from "@/redux/config"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"

export const useInfiniteNotificationsList = () => {
  const [lastRefValue, setLastRefValue] = useState<Timestamp | undefined>()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [canFetchMore, setCanFetchMore] = useState(true)
  const uid = useAppSelector(({ user }) => user.uid)
  const executedFirstLoadRef = useRef(false)

  const { isLoading, handleAsyncRequest: handleNotificationsLoad } =
    useAsyncRequestHandler({
      request: getNotificationsChunk,
      isLoadingByDefault: true,
    })

  const loadNotificationsChunk = async () => {
    const isLoadingNextChunk = executedFirstLoadRef.current && isLoading

    if (!uid || isLoadingNextChunk || !canFetchMore) {
      return
    }

    const notifications = await handleNotificationsLoad({
      uid,
      lastRefValue,
    })

    if (!notifications) {
      setCanFetchMore(false)
      executedFirstLoadRef.current = true
      return
    }

    setNotifications((prev) => [...prev, ...notifications])
    const lastNotification = notifications[notifications.length - 1]
    setLastRefValue(lastNotification.creationTimestamp)
    executedFirstLoadRef.current = true
  }

  useEffect(() => {
    loadNotificationsChunk()
  }, [])

  return {
    notifications,
    isLoadingFirstChunk: !executedFirstLoadRef.current && isLoading,
    loadNotificationsChunk,
  }
}
