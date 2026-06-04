import { router } from "expo-router"
import { useEffect, useState } from "react"

import { submitAnswers } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"
import { selectAllSectionsAreCompleted } from "@/redux/answers.selectors"
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

  const startTimestamp = useAppSelector(({ answers }) => answers.startTimestamp)
  const checkStarted = !!startTimestamp

  const [remainingMandatoryTime, setRemainingMandatoryTime] = useState(() =>
    startTimestamp
      ? mandatoryCheckDurationMs - (Date.now() - startTimestamp)
      : mandatoryCheckDurationMs,
  )

  const allSectionsAreCompleted = useAppSelector(selectAllSectionsAreCompleted)

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
