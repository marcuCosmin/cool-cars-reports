import { router } from "expo-router"

import { type QuestionDoc } from "@/firebase/utils"

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
  } as const)

type AnswerButtonsProps = {
  questionIndex: number
  sectionKey: keyof QuestionDoc
  hasNextQuestion: boolean
  questionLabel: string
  answer?: boolean
}

export const AnswerButtons = ({
  questionIndex,
  sectionKey,
  hasNextQuestion,
  questionLabel,
  answer,
}: AnswerButtonsProps) => {
  const styles = useStyles(getStlyes)
  const dispatch = useAppDispatch()

  const isYesButtonActive = answer === true
  const isNoButtonActive = answer === false

  const handleButtonClick = (value: boolean) => {
    dispatch(
      setAnswer({
        sectionKey,
        index: questionIndex,
        answer: {
          value,
          label: questionLabel,
        },
      })
    )

    if (hasNextQuestion) {
      const nextIndex = questionIndex + 1
      router.push(`/reports/check/${sectionKey}/${nextIndex}`)
      return
    }

    router.push("/reports/check")
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
