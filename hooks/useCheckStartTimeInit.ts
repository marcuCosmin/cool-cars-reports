import { useFocusEffect } from "expo-router"
import { useCallback, useRef } from "react"

import { initStartTimestamp } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"

export const useCheckStartTimeInit = () => {
  const checkStarted = useAppSelector(({ answers }) => !!answers.startTimestamp)
  const checkStartedRef = useRef(checkStarted)
  checkStartedRef.current = checkStarted

  const dispatch = useAppDispatch()

  const handleFocusEvent = useCallback(() => {
    if (checkStartedRef.current) {
      return
    }

    dispatch(initStartTimestamp())
  }, [])

  useFocusEffect(handleFocusEvent)
}
