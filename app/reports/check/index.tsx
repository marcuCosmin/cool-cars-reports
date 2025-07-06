import { router } from "expo-router"

import { useEffect } from "react"

import { addCheck } from "@/firebase/utils"

import { resetAnswers, type OdoReading } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"
import {
  closeLoadingOverlay,
  showLoadingOverlay,
} from "@/redux/loadingOverlaySlice"
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
  const { questions, answers, user, selectedCar } = useAppSelector(
    ({ questions, answers, user, selectedCar }) => ({
      questions,
      answers,
      user,
      selectedCar,
    })
  )

  const interiorIsCompleted =
    questions.interior.length === answers.interior.length
  const exteriorIsCompleted =
    questions.exterior.length === answers.exterior.length
  const odoReadingIsCompleted = answers.odoReading !== null

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

  const onSubmitClick = async () => {
    dispatch(showLoadingOverlay("Submitting your report"))
    await addCheck({
      interior: answers.interior,
      exterior: answers.exterior,
      odoReading: answers.odoReading as OdoReading,
      uid: user.uid as string,
      carId: selectedCar.id,
    })
    dispatch(resetAnswers())
    dispatch(closeLoadingOverlay())
    dispatch(showToast("Your report has been sent!"))
    router.push("/")
  }

  useEffect(() => {
    dispatch(fetchQuestions())
  }, [])

  if (questions.isLoading) {
    return <LoadingView />
  }

  return (
    <View>
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
