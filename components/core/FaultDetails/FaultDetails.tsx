import { router, useLocalSearchParams, useSegments } from "expo-router"

import { type QuestionSection } from "@/firebase/utils"

import { selectAnswersBySection } from "@/redux/answers.selectors"
import { setAnswerDetails } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"
import { selectQuestionsBySection } from "@/redux/questions.selectors"

import { useStyles } from "@/hooks/useStyles"

import { Button } from "@/components/basic/Button"
import { Input } from "@/components/basic/Input"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { DETAILS_MAX_LENGTH, DETAILS_MIN_LENGTH } from "./FaultDetails.const"
import { isAnswerDetailsValid } from "./FaultDetails.utils"

const getStyles = () =>
  ({
    questionButton: {
      alignSelf: "center",
      maxWidth: "50%",
      marginBottom: 10,
      padding: 5,
    },
  }) as const

type LocalSearchParams = {
  questionIndex: string
}

export const FaultDetails = () => {
  const segments = useSegments()
  const section = segments[segments.length - 3] as QuestionSection

  const { questionIndex: questionIndexParam } =
    useLocalSearchParams<LocalSearchParams>()
  const questionIndex = Number(questionIndexParam)

  const styles = useStyles(getStyles)
  const dispatch = useAppDispatch()

  const questions = useAppSelector(
    (state) => selectQuestionsBySection(state)[section],
  )
  const answers = useAppSelector(
    (state) => selectAnswersBySection(state)[section],
  )

  const question = questions[questionIndex]
  const value =
    answers.find(({ label }) => label === question?.label)?.details ?? ""

  if (!question) {
    return <View />
  }

  const displayedIndex = questionIndex + 1
  const isValid = isAnswerDetailsValid(value)
  const hasNextQuestion = questionIndex < questions.length - 1

  const handleChange = (text: string) =>
    dispatch(
      setAnswerDetails({
        section,
        label: question.label,
        details: text,
      }),
    )

  const onBackClick = () =>
    router.dismissTo(`/reports/check/${section}/${questionIndex}`)

  const onConfirmClick = () => {
    if (hasNextQuestion) {
      router.dismissTo(`/reports/check/${section}/${questionIndex + 1}`)
    } else {
      router.dismissTo("/reports/check")
    }
  }

  return (
    <View>
      <Button style={styles.questionButton} onClick={onBackClick}>
        <Typography type="button" numberOfLines={1}>
          Q{displayedIndex}: {question.label}
        </Typography>
      </Button>

      <Typography type="heading">Fault Details</Typography>

      <Input
        type="textarea"
        value={value}
        minLength={DETAILS_MIN_LENGTH}
        maxLength={DETAILS_MAX_LENGTH}
        onChange={handleChange}
      />

      {isValid && (
        <Button onClick={onConfirmClick}>
          <Typography type="button">Confirm</Typography>
        </Button>
      )}
    </View>
  )
}
