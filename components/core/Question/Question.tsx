import { router, useLocalSearchParams, useSegments } from "expo-router"
import { ScrollView } from "react-native"

import {
  type QuestionDoc,
  type Question as QuestionType,
} from "@/firebase/utils"

import { Answer } from "@/redux/answersSlice"
import { useAppSelector } from "@/redux/config"

import { useCheckStartTimeInit } from "@/hooks/useCheckStartTimeInit"
import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { AnswerButtons } from "./AnswerButtons/AnswerButtons"
import { Pagination } from "./Pagination"

const getStyles = (theme: Theme) =>
  ({
    containerView: {
      justifyContent: "space-between",
      flex: 1,
      gap: 10,
    },
    labelView: {
      borderWidth: theme.borderWidth,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius,
      padding: theme.inputPadding,
      maxHeight: "45%",
      minHeight: 200,
      flex: 0,
    },
    typography: {
      fontSize: theme.fontSize.medium,
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
    faultDetailsButton: {
      alignSelf: "center",
      maxWidth: "50%",
      marginBottom: 10,
      padding: 5,
    },
  }) as const

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

  const onViewFaultDetailsClick = () =>
    router.dismissTo(
      `/reports/check/${sectionKey}/${questionIndex}/fault-details`,
    )

  useCheckStartTimeInit()

  if (!question) {
    return <View />
  }

  return (
    <View style={styles.containerView}>
      {answer?.value === false && (
        <Button
          style={styles.faultDetailsButton}
          onClick={onViewFaultDetailsClick}
        >
          <Typography type="button" numberOfLines={1}>
            Fault details
          </Typography>
        </Button>
      )}

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
        faultDetails={answer?.details}
      />

      <Pagination
        sectionKey={sectionKey}
        questionIndex={questionIndex}
        items={paginationItems}
      />
    </View>
  )
}
