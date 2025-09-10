import { router } from "expo-router"

import { useEffect } from "react"

import { submitAnswers } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"
import { fetchQuestions } from "@/redux/questionsSlice"

import { useStyles } from "@/hooks/useStyles"

import {
  ActionCardList,
  type ActionCardProps,
} from "@/components/basic/ActionCardList/ActionCardList"
import { Button } from "@/components/basic/Button"
import { LoadingView } from "@/components/basic/LoadingView/LoadingView"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"
import { setSubmittedCheckId } from "@/redux/submittedCheckSlice"

const getStyles = () =>
  ({
    heading: {
      textAlign: "center",
    },
  } as const)

export default function Check() {
  const styles = useStyles(getStyles)
  const dispatch = useAppDispatch()
  const questionsError = useAppSelector(({ questions }) => questions.error)
  const questionsAreLoading = useAppSelector(
    ({ questions }) => questions.isLoading
  )
  const answersAreLoading = useAppSelector(({ answers }) => answers.isLoading)
  const interiorIsCompleted = useAppSelector(
    ({ answers, questions }) =>
      questions.interior.length === answers.interior.length
  )
  const exteriorIsCompleted = useAppSelector(
    ({ answers, questions }) =>
      questions.exterior.length === answers.exterior.length
  )
  const odoReadingIsCompleted = useAppSelector(
    ({ answers }) => answers.odoReading !== null
  )
  const checkStarted = useAppSelector(
    ({ answers }) =>
      answers.interior.length > 0 ||
      answers.exterior.length > 0 ||
      answers.odoReading !== null
  )

  const allSectionsAreCompleted =
    interiorIsCompleted && exteriorIsCompleted && odoReadingIsCompleted

  const actionCardListItems: ActionCardProps[] = [
    {
      label: "Interior",
      icon: "car-arrow-left",
      displayOverlay: interiorIsCompleted,
      overlayIcon: "check-circle",
      onClick: () => router.push("/reports/check/interior/0"),
    },
    {
      label: "Exterior",
      icon: "car-arrow-right",
      displayOverlay: exteriorIsCompleted,
      overlayIcon: "check-circle",
      onClick: () => router.push("/reports/check/exterior/0"),
    },
    {
      label: "ODO Reading",
      icon: "speedometer",
      displayOverlay: odoReadingIsCompleted,
      overlayIcon: "check-circle",
      onClick: () => router.push("/reports/check/odo-reading"),
    },
  ]

  useEffect(() => {
    if (checkStarted) {
      return
    }

    dispatch(fetchQuestions())
  }, [checkStarted])

  const onSubmitClick = async () => {
    const result = await dispatch(submitAnswers())

    if (result.meta.requestStatus === "rejected") {
      return
    }

    const checkId = result.payload as string

    dispatch(setSubmittedCheckId(checkId))

    router.dismissTo("/")
  }

  if (questionsAreLoading) {
    return <LoadingView />
  }

  return (
    <View>
      {answersAreLoading && <LoadingView overlay />}

      <Typography type="heading" style={styles.heading}>
        Vehicle check
      </Typography>

      {questionsError ? (
        <Typography>{questionsError}</Typography>
      ) : (
        <ActionCardList items={actionCardListItems} />
      )}

      {allSectionsAreCompleted && (
        <Button onClick={onSubmitClick}>
          <Typography type="button">Submit check</Typography>
        </Button>
      )}
    </View>
  )
}
