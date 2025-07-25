import { router } from "expo-router"

import { Question, type QuestionDoc } from "@/firebase/utils"

import { setAnswer, type Answer } from "@/redux/answersSlice"
import { useAppDispatch } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"

import { View } from "@/components/basic/View"

import { Button } from "./Button"

const getStlyes = () =>
  ({
    view: {
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
  sectionIsCompleted: boolean
  question: Question
  answer?: Answer
}

export const AnswerButtons = ({
  questionIndex,
  sectionKey,
  hasNextQuestion,
  sectionIsCompleted,
  question,
  answer,
}: AnswerButtonsProps) => {
  const styles = useStyles(getStlyes)
  const dispatch = useAppDispatch()

  const answerValue = answer?.value

  const isYesButtonActive = answerValue === true && sectionIsCompleted
  const isNoButtonActive = answerValue === false && sectionIsCompleted

  const handleButtonClick = (value: boolean) => {
    dispatch(
      setAnswer({
        sectionKey,
        index: questionIndex,
        answer: {
          value,
          label: question.label,
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
      <Button icon="check" onClick={onYesClick} isActive={isYesButtonActive} />
      <Button icon="close" onClick={onNoClick} isActive={isNoButtonActive} />
    </View>
  )
}
