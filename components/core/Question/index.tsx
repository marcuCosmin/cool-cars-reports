import { useLocalSearchParams, useSegments } from "expo-router"

import { type QuestionDoc } from "@/firebase/utils"

import { useAppSelector } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { AnswerButtons } from "./AnswerButtons"
import { Pagination } from "./Pagination"

const getStyles = (theme: Theme) =>
  ({
    typography: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
      borderWidth: theme.borderWidth,
      color: theme.colors.text,
      borderRadius: theme.borderRadius,
      height: "40%",
      padding: 10,
      fontSize: 20,
      verticalAlign: "middle",
      textAlign: "center",
    },

    mainMenuButton: {
      borderRadius: theme.borderRadius,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
      backgroundColor: "transparent",
      zIndex: 10,
    },
  } as const)

type LocalSearchParams = {
  questionIndex: string
}

export const Question = () => {
  const segments = useSegments()
  const sectionKey = segments[segments.length - 2] as keyof QuestionDoc

  const styles = useStyles(getStyles)

  const { questionIndex } = useLocalSearchParams<LocalSearchParams>()

  const { questions, answers } = useAppSelector(({ questions, answers }) => ({
    questions,
    answers,
  }))

  const questionsSection = questions[sectionKey]
  const answersSection = answers[sectionKey]

  const sectionIsCompleted = answersSection?.length === questionsSection?.length

  const numericIndex = Number(questionIndex)
  const question = questionsSection?.[numericIndex]
  const answer = answersSection?.[numericIndex]
  const displayedIndex = numericIndex + 1
  const hasNextQuestion = numericIndex < questionsSection?.length - 1

  if (!question) {
    return null
  }

  return (
    <View>
      <Typography type="heading">Check {displayedIndex}</Typography>
      <Typography type="heading" style={styles.typography}>
        {question?.label}
      </Typography>

      <AnswerButtons
        sectionKey={sectionKey}
        sectionIsCompleted={sectionIsCompleted}
        questionIndex={numericIndex}
        hasNextQuestion={hasNextQuestion}
        question={question}
        answer={answer}
      />

      {sectionIsCompleted && (
        <Pagination
          sectionKey={sectionKey}
          questionIndex={numericIndex}
          sectionLength={questionsSection?.length}
        />
      )}
    </View>
  )
}
