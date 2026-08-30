import { router, type RelativePathString } from "expo-router"

import { useEffect } from "react"

import { QUESTION_SECTIONS, type QuestionSection } from "@/firebase/utils"

import { useAppDispatch, useAppSelector } from "@/redux/config"
import { fetchQuestions } from "@/redux/questionsSlice"
import {
  selectCompletedSections,
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

type SectionCard = Pick<ActionCardProps, "label" | "icon">

const sectionCards: Record<QuestionSection, SectionCard> = {
  interior: {
    label: "Interior",
    icon: "car-arrow-left",
  },
  exterior: {
    label: "Exterior",
    icon: "car-arrow-right",
  },
  driver: {
    label: "Driver",
    icon: "account",
  },
}

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
  const completedSections = useAppSelector(selectCompletedSections)
  const odoReadingIsCompleted = useAppSelector(selectOdoReadingIsCompleted)

  const actionCardListItems: ActionCardProps[] = [
    ...QUESTION_SECTIONS.map((section) => ({
      ...sectionCards[section],
      displayOverlay: completedSections[section],
      overlayIcon: "check-circle" as const,
      onClick: () =>
        router.dismissTo(
          `/reports/check/${section}/0` as RelativePathString,
        ),
    })),
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
