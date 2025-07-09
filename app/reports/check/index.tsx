import { router } from "expo-router"

import { useEffect } from "react"

import { resetAnswers, type OdoReading } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"
import { fetchQuestions } from "@/redux/questionsSlice"

import { useApi } from "@/hooks/useApi"
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
  const { executeApiRequest } = useApi()
  const { questions, answers, user, cars } = useAppSelector(
    ({ questions, answers, user, cars }) => ({
      questions,
      answers,
      user,
      cars,
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
    await executeApiRequest({
      method: "POST",
      path: "/cars/checks",
      payload: {
        interior: answers.interior,
        exterior: answers.exterior,
        odoReading: answers.odoReading as OdoReading,
        uid: user.uid as string,
        carId: cars.selectedCar.id,
      },
    })

    dispatch(resetAnswers())
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
