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

  const { questionIndex: searchParamQuestionIndex } =
    useLocalSearchParams<LocalSearchParams>()
  const questionIndex = Number(searchParamQuestionIndex)
  const displayedIndex = questionIndex + 1

  const answerValue = useAppSelector(({ answers }) => {
    const answersSection = answers[sectionKey]
    const answer = answersSection?.[questionIndex]
    return answer?.value
  })
  const hasNextQuestion = useAppSelector(({ questions }) => {
    const questionsSection = questions[sectionKey]

    const hasNextQuestion = questionIndex < questionsSection?.length - 1

    return hasNextQuestion
  })
  const questionLabel = useAppSelector(({ questions }) => {
    const questionsSection = questions[sectionKey]
    const question = questionsSection?.[questionIndex]

    return question?.label
  })

  const paginationLength = useAppSelector(({ answers }) => {
    const answersSection = answers[sectionKey]

    return answersSection?.length
  })

  if (!questionLabel) {
    return null
  }

  return (
    <View>
      <Typography type="heading">Check {displayedIndex}</Typography>

      <View style={styles.labelView}>
        <ScrollView>
          <Typography style={styles.typography}>{questionLabel}</Typography>
        </ScrollView>
      </View>

      <AnswerButtons
        sectionKey={sectionKey}
        questionIndex={questionIndex}
        hasNextQuestion={hasNextQuestion}
        questionLabel={questionLabel}
        answer={answerValue}
      />

      {!!paginationLength && (
        <Pagination
          sectionKey={sectionKey}
          questionIndex={questionIndex}
          sectionLength={paginationLength}
        />
      )}
    </View>
  )
}
