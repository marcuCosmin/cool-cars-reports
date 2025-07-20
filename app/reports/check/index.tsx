import { router } from "expo-router"

import { useEffect } from "react"

import { submitAnswers, type OdoReading } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"
import { fetchQuestions } from "@/redux/questionsSlice"
import { showToast } from "@/redux/toastSlice"

import { useStyles } from "@/hooks/useStyles"

import {
  ActionCardList,
  type ActionCardProps,
} from "@/components/basic/ActionCardList"
import { Button } from "@/components/basic/Button"
import { LoadingView } from "@/components/basic/LoadingView"
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
  const { questions, answers, cars } = useAppSelector(
    ({ questions, answers, cars }) => ({
      questions,
      answers,
      cars,
    })
  )

  const interiorIsCompleted =
    questions.interior.length === answers.interior.length
  const exteriorIsCompleted =
    questions.exterior.length === answers.exterior.length
  const odoReadingIsCompleted = answers.odoReading !== null

  const checkStarted =
    answers.interior.length > 0 ||
    answers.exterior.length > 0 ||
    answers.odoReading !== null

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
    const result = await dispatch(
      submitAnswers({
        interior: answers.interior,
        exterior: answers.exterior,
        odoReading: answers.odoReading as OdoReading,
        carId: cars.selectedCar.id,
      })
    )

    if (result.meta.requestStatus === "rejected") {
      return
    }

    dispatch(showToast("Check submitted successfully!"))

    router.push("/")
  }

  if (questions.isLoading) {
    return <LoadingView />
  }

  return (
    <View>
      {answers.isLoading && <LoadingView overlay />}

      <Typography type="heading" style={styles.heading}>
        Vehicle check
      </Typography>
      <ActionCardList items={actionCardListItems} />

      {allSectionsAreCompleted && (
        <Button onClick={onSubmitClick}>
          <Typography type="button">Submit check</Typography>
        </Button>
      )}
    </View>
  )
}
