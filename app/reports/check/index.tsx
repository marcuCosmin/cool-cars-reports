import { router } from "expo-router"

import { useEffect } from "react"

import { useAppDispatch, useAppSelector } from "@/redux/config"
import { fetchQuestions } from "@/redux/questionsSlice"
import {
  selectExteriorIsCompleted,
  selectInteriorIsCompleted,
  selectOdoReadingIsCompleted,
} from "@/redux/answers.selectors"

import { useStyles } from "@/hooks/useStyles"

import { CheckFooter } from "@/components/core/CheckFooter/CheckFooter"

import {
  ActionCardList,
  type ActionCardProps,
} from "@/components/basic/ActionCardList/ActionCardList"
import { LoadingView } from "@/components/basic/LoadingView/LoadingView"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = () =>
  ({
    heading: {
      textAlign: "center",
    },
  }) as const

export default function Check() {
  const styles = useStyles(getStyles)
  const dispatch = useAppDispatch()

  const questionsError = useAppSelector(({ questions }) => questions.error)
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
  const interiorIsCompleted = useAppSelector(selectInteriorIsCompleted)
  const exteriorIsCompleted = useAppSelector(selectExteriorIsCompleted)
  const odoReadingIsCompleted = useAppSelector(selectOdoReadingIsCompleted)

  const actionCardListItems: ActionCardProps[] = [
    {
      label: "Interior",
      icon: "car-arrow-left",
      displayOverlay: interiorIsCompleted,
      overlayIcon: "check-circle",
      onClick: () => router.dismissTo("/reports/check/interior/0"),
    },
    {
      label: "Exterior",
      icon: "car-arrow-right",
      displayOverlay: exteriorIsCompleted,
      overlayIcon: "check-circle",
      onClick: () => router.dismissTo("/reports/check/exterior/0"),
    },
    {
      label: "ODO Reading",
      icon: "speedometer",
      displayOverlay: odoReadingIsCompleted,
      overlayIcon: "check-circle",
      onClick: () => router.dismissTo("/reports/check/odo-reading"),
    },
  ]

  useEffect(() => {
    dispatch(fetchQuestions(questionsPath))
  }, [questionsPath])

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

      <CheckFooter />
    </View>
  )
}
