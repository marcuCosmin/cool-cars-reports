import { useEffect, useReducer, useRef, useState } from "react"

import {
  getNotificationsChunk,
  type Notification,
  type NotificationsFilters,
} from "@/firebase/utils"

import { useAppSelector } from "@/redux/config"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"

import { filtersReducer } from "./NotificationsList.utils"

import type { FiltersAction } from "./NotificationsList.model"

const filtersInitialState: NotificationsFilters = {
  type: "all",
  startDate: null,
  endDate: null,
  carId: "all",
}

export const useInfiniteNotificationsList = () => {
  const [filters, dispatchFilters] = useReducer<
    NotificationsFilters,
    FiltersAction
  >(filtersReducer, filtersInitialState)
  const [lastRefValue, setLastRefValue] = useState<number | undefined>()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [canFetchMore, setCanFetchMore] = useState(true)
  const isFirstTimeLoadingRef = useRef(true)
  const uid = useAppSelector(({ user }) => user.uid)

  const { isLoading, handleAsyncRequest: handleInitialNotificationsLoad } =
    useAsyncRequestHandler({
      request: getNotificationsChunk,
      isLoadingByDefault: true,
    })
  const { handleAsyncRequest: handleNextNotificationsLoad } =
    useAsyncRequestHandler({
      request: getNotificationsChunk,
    })

  const loadInitialChunk = async () => {
    const notifications = await handleInitialNotificationsLoad({
      uid,
      filters,
    })

    if (!notifications) {
      setCanFetchMore(false)
      isFirstTimeLoadingRef.current = false
      return
    }

    setNotifications(notifications)
    const lastNotification = notifications[notifications.length - 1]
    setLastRefValue(lastNotification.creationTimestamp)
    isFirstTimeLoadingRef.current = false
  }

  const loadNextNotificationsChunk = async () => {
    if (!canFetchMore) {
      return
    }

    const notifications = await handleNextNotificationsLoad({
      uid,
      lastRefValue,
      filters,
    })

    if (!notifications) {
      setCanFetchMore(false)
      return
    }

    setNotifications((prev) => [...prev, ...notifications])
    const lastNotification = notifications[notifications.length - 1]
    setLastRefValue(lastNotification.creationTimestamp)
  }

  useEffect(() => {
    loadInitialChunk()
  }, [filters])

  return {
    filters,
    dispatchFilters,
    notifications,
    isInitLoading: isLoading,
    isFirstTimeLoading: isFirstTimeLoadingRef.current && isLoading,
    loadNextNotificationsChunk,
  }
}
