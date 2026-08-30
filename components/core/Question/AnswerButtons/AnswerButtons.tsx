import { router } from "expo-router"

import { type QuestionSection } from "@/firebase/utils"

import { setAnswer } from "@/redux/answersSlice"
import { useAppDispatch } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"

import { View } from "@/components/basic/View"

import { AnswerButton } from "./AnswerButton"

const getStlyes = () =>
  ({
    view: {
      marginTop: "auto",
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      flex: 0,
    },
  }) as const

type AnswerButtonsProps = {
  questionIndex: number
  section: QuestionSection
  hasNextQuestion: boolean
  questionLabel: string
  answer?: boolean
  faultDetails?: string
}

export const AnswerButtons = ({
  questionIndex,
  section,
  hasNextQuestion,
  questionLabel,
  answer,
  faultDetails,
}: AnswerButtonsProps) => {
  const styles = useStyles(getStlyes)
  const dispatch = useAppDispatch()

  const isYesButtonActive = answer === true
  const isNoButtonActive = answer === false

  const handleButtonClick = (value: boolean) => {
    dispatch(
      setAnswer({
        section,
        label: questionLabel,
        value,
      }),
    )

    if (!value && !faultDetails) {
      router.dismissTo(
        `/reports/check/${section}/${questionIndex}/fault-details`,
      )
      return
    }

    if (hasNextQuestion) {
      const nextIndex = questionIndex + 1
      router.dismissTo(`/reports/check/${section}/${nextIndex}`)
      return
    }

    router.dismissTo("/reports/check")
  }

  const onYesClick = () => handleButtonClick(true)
  const onNoClick = () => handleButtonClick(false)

  return (
    <View style={styles.view}>
      <AnswerButton
        icon="check"
        onClick={onYesClick}
        isActive={isYesButtonActive}
      />
      <AnswerButton
        icon="close"
        onClick={onNoClick}
        isActive={isNoButtonActive}
      />
    </View>
  )
}
