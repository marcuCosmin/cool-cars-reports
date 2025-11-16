import { router } from "expo-router"

import { useEffect } from "react"

import { submitAnswers } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"
import { fetchQuestions } from "@/redux/questionsSlice"
import { setSubmittedCheckId } from "@/redux/submittedCheckSlice"

import { useStyles } from "@/hooks/useStyles"

import {
  ActionCardList,
  type ActionCardProps,
} from "@/components/basic/ActionCardList/ActionCardList"
import { Button } from "@/components/basic/Button"
import { LoadingView } from "@/components/basic/LoadingView/LoadingView"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

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

  const questionsPath = useAppSelector(({ cars }) => {
    const { isRental, council } = cars.selectedCar

    if (isRental) {
      return "rental-questions"
    }

    if (council === "PSV") {
      return "psv-questions"
    }

    return "non-psv-questions"
  })

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
  const hasFaults = useAppSelector(({ answers }) => {
    const allQuestions = [...answers.interior, ...answers.exterior]

    return allQuestions.some(({ value }) => !value)
  })
  const faultsDetailsIsCompleted = useAppSelector(({ answers }) =>
    hasFaults ? !!answers.faultsDetails : true
  )

  const allSectionsAreCompleted =
    interiorIsCompleted &&
    exteriorIsCompleted &&
    odoReadingIsCompleted &&
    faultsDetailsIsCompleted

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
    {
      hidden: !hasFaults,
      label: "Faults Details",
      icon: "file-document-edit",
      displayOverlay: faultsDetailsIsCompleted,
      overlayIcon: "check-circle",
      onClick: () => router.push("/reports/check/faults-details"),
    },
  ]

  useEffect(() => {
    if (checkStarted) {
      return
    }

    dispatch(fetchQuestions(questionsPath))
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
