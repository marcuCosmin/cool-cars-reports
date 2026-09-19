import { useEffect, useState } from "react"

import { useAppSelector } from "@/redux/config"

import { formatCountdown } from "@/utils/formatCountdown"

import { mandatoryCheckDurationMs } from "./CheckFooter.const"

export const useMandatoryCheckTimer = () => {
  const startTimestamp = useAppSelector(
    ({ answers }) => answers.startTimestamp,
  )
  const checkStarted = !!startTimestamp

  const [remainingTime, setRemainingTime] = useState(() =>
    startTimestamp
      ? mandatoryCheckDurationMs - (Date.now() - startTimestamp)
      : mandatoryCheckDurationMs,
  )

  const hasElapsed = checkStarted && remainingTime <= 0
  const showRemainingTime = checkStarted && !hasElapsed

  useEffect(() => {
    if (!checkStarted || hasElapsed) {
      return
    }

    const intervalId = setInterval(
      () => setRemainingTime((prev) => (prev ? prev - 1000 : prev)),
      1000,
    )

    return () => clearInterval(intervalId)
  }, [checkStarted, hasElapsed])

  return {
    hasElapsed,
    showRemainingTime,
    formattedRemainingTime: formatCountdown(remainingTime),
  }
}
