import { router } from "expo-router"
import { useEffect, useState } from "react"

import { submitAnswers } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"
import { setSubmittedCheckId } from "@/redux/submittedCheckSlice"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { formatCountdown } from "@/utils/formatCountdown"

import { mandatoryCheckDurationMs } from "./CheckFooter.const"

const getStyles = (theme: Theme) =>
  ({
    view: {
      flex: 0,
    },
    timerView: {
      flex: 0,
      alignItems: "center",
      marginBottom: 10,
    },
    timerLabelTypography: {
      color: theme.colors.text,
    },
    timerValueTypography: {
      fontSize: theme.fontSize.large,
      color: theme.colors.primary,
      fontWeight: "bold",
    },
  }) as const

export const CheckFooter = () => {
  const styles = useStyles(getStyles)

  const checkStarted = useAppSelector(({ answers }) => !!answers.startTimestamp)
  const startTimestamp = useAppSelector(({ answers }) => answers.startTimestamp)

  const [remainingMandatoryTime, setRemainingMandatoryTime] = useState(() =>
    startTimestamp
      ? mandatoryCheckDurationMs - (Date.now() - startTimestamp)
      : mandatoryCheckDurationMs,
  )

  const allSectionsAreCompleted = useAppSelector(({ answers, questions }) => {
    const interiorIsCompleted =
      questions.interior.length === answers.interior.length
    const exteriorIsCompleted =
      questions.exterior.length === answers.exterior.length
    const odoReadingIsCompleted = answers.odoReading !== null
    const hasFaults = [...answers.interior, ...answers.exterior].some(
      ({ value }) => !value,
    )
    const faultsDetailsIsCompleted = hasFaults ? !!answers.faultsDetails : true

    return (
      interiorIsCompleted &&
      exteriorIsCompleted &&
      odoReadingIsCompleted &&
      faultsDetailsIsCompleted
    )
  })

  const hasRemainingMandatoryTimeElapsed =
    checkStarted && remainingMandatoryTime <= 0
  const isSubmitDisabled =
    !allSectionsAreCompleted || !hasRemainingMandatoryTimeElapsed

  const showRemainingMandatoryTime =
    checkStarted && !hasRemainingMandatoryTimeElapsed

  const dispatch = useAppDispatch()

  const onSubmitClick = async () => {
    const result = await dispatch(submitAnswers())

    if (result.meta.requestStatus === "rejected") {
      return
    }

    const checkId = result.payload as string

    dispatch(setSubmittedCheckId(checkId))

    router.dismissTo("/")
  }

  useEffect(() => {
    if (!checkStarted || hasRemainingMandatoryTimeElapsed) {
      return
    }

    const intervalId = setInterval(
      () => setRemainingMandatoryTime((prev) => (prev ? prev - 1000 : prev)),
      1000,
    )

    return () => clearInterval(intervalId)
  }, [checkStarted, hasRemainingMandatoryTimeElapsed])

  return (
    <View style={styles.view}>
      {showRemainingMandatoryTime && (
        <View style={styles.timerView}>
          <Typography style={styles.timerLabelTypography}>
            Mandatory check time remaining
          </Typography>
          <Typography style={styles.timerValueTypography}>
            {formatCountdown(remainingMandatoryTime)}
          </Typography>
        </View>
      )}
      <Button onClick={onSubmitClick} disabled={isSubmitDisabled}>
        <Typography type="button">Submit check</Typography>
      </Button>
    </View>
  )
}
