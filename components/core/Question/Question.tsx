import { useLocalSearchParams, useSegments } from "expo-router"
import { ScrollView } from "react-native"

import {
  type QuestionDoc,
  type Question as QuestionType,
} from "@/firebase/utils"

import { Answer } from "@/redux/answersSlice"
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

  const questions = useAppSelector(({ questions }) => questions[sectionKey])
  const answers = useAppSelector(({ answers }) => answers[sectionKey])

  const question = questions?.[questionIndex] as QuestionType | undefined
  const answer = answers?.[questionIndex] as Answer | undefined
  const hasNextQuestion = questionIndex < questions?.length - 1

  const paginationItems = questions?.map((_, index) => {
    const answer = answers?.[index] as Answer | undefined

    return {
      isActive: index === questionIndex,
      isDisabled: !answer && index !== questionIndex,
    }
  })

  if (!question) {
    return <View />
  }

  return (
    <View>
      <Typography type="heading">Check {displayedIndex}</Typography>

      <View style={styles.labelView}>
        <ScrollView>
          <Typography style={styles.typography}>{question.label}</Typography>
        </ScrollView>
      </View>

      <AnswerButtons
        sectionKey={sectionKey}
        questionIndex={questionIndex}
        hasNextQuestion={hasNextQuestion}
        questionLabel={question.label}
        answer={answer?.value}
      />

      <Pagination
        sectionKey={sectionKey}
        questionIndex={questionIndex}
        items={paginationItems}
      />
    </View>
  )
}
