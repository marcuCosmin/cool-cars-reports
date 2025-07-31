import { useLocalSearchParams, useSegments } from "expo-router"
import { ScrollView } from "react-native"

import { type QuestionDoc } from "@/firebase/utils"

import { useAppSelector } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { AnswerButtons } from "./AnswerButtons/AnswerButtons"
import { Pagination } from "./Pagination"

const getStyles = (theme: Theme) =>
  ({
    labelView: {
      borderWidth: theme.borderWidth,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius,
      padding: theme.inputPadding,
      flex: 0,
      height: "40%",
      marginBottom: 50,
    },
    typography: {
      fontSize: 20,
      textAlign: "center",
    },
    mainMenuButton: {
      borderRadius: theme.borderRadius,
      gap: theme.gap,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
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

      <View style={styles.labelView}>
        <ScrollView>
          <Typography style={styles.typography}>{question?.label}</Typography>
        </ScrollView>
      </View>

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
