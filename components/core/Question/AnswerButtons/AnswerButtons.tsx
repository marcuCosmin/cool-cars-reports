import { router } from "expo-router"

import { type QuestionSection } from "@/firebase/utils"

import { setAnswer } from "@/redux/answersSlice"
import { useAppDispatch } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { AnswerButton } from "./AnswerButton"

const getStyles = (theme: Theme) =>
  ({
    view: {
      marginTop: "auto",
      gap: theme.gap,
      flex: 1,
    },
    mainButtonsView: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    notApplicableButton: {
      marginTop: 0,
    },
    notApplicableButtonActive: {
      backgroundColor: theme.colors.primary,
    },
  }) as const

type AnswerButtonsProps = {
  questionIndex: number
  section: QuestionSection
  hasNextQuestion: boolean
  questionLabel: string
  showNotApplicable?: boolean
  answer?: boolean | "not-applicable"
  faultDetails?: string
}

export const AnswerButtons = ({
  questionIndex,
  section,
  hasNextQuestion,
  questionLabel,
  showNotApplicable,
  answer,
  faultDetails,
}: AnswerButtonsProps) => {
  const styles = useStyles(getStyles)
  const dispatch = useAppDispatch()

  const isYesButtonActive = answer === true
  const isNoButtonActive = answer === false
  const isNotApplicableButtonActive = answer === "not-applicable"

  const handleButtonClick = (value: boolean | "not-applicable") => {
    dispatch(
      setAnswer({
        section,
        label: questionLabel,
        value,
      }),
    )

    if (value === false && !faultDetails) {
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
  const onNotApplicableClick = () => handleButtonClick("not-applicable")

  return (
    <View style={styles.view}>
      <View style={styles.mainButtonsView}>
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

      {showNotApplicable && (
        <Button
          style={[
            styles.notApplicableButton,
            isNotApplicableButtonActive && styles.notApplicableButtonActive,
          ]}
          onClick={onNotApplicableClick}
        >
          <Typography type="button" numberOfLines={1}>
            Not applicable
          </Typography>
        </Button>
      )}
    </View>
  )
}
