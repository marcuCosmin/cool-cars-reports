import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ScrollView } from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { IssuesStatus } from "@/components/basic/IssuesStatus"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { answersIconsConfig } from "./CheckView.const"

import type { AnswerWithFault } from "./CheckView.model"

const getStyles = (theme: Theme) =>
  ({
    scrollView: {
      gap: theme.gap,
      alignItems: "center",
    },
    itemView: {
      borderWidth: theme.borderWidth,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius,
      padding: theme.inputPadding,
      gap: theme.gap,
      alignItems: "center",
      width: "100%",
      flex: 0,
      maxWidth: "90%",
    },
    labelTypography: {
      textAlign: "center",
    },
    faultView: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 5,
    },
    faultTypography: {
      fontSize: theme.fontSize.small,
      color: theme.colors.primary,
      fontWeight: "bold",
    },
    answerTypography: {
      fontSize: theme.fontSize.medium,
      fontWeight: "bold",
    },
  }) as const

type QuestionsViewProps = {
  answers: AnswerWithFault[]
}

export const QuestionsView = ({ answers }: QuestionsViewProps) => {
  const theme = useTheme()
  const styles = useStyles(getStyles)

  return (
    <View>
      <ScrollView contentContainerStyle={styles.scrollView}>
        {answers.map((answer, index) => {
          const { fault, label } = answer
          const answerIcon = answersIconsConfig[`${answer.value}`]
          const color = theme.colors[answerIcon.colorKey]

          return (
            <View key={index} style={styles.itemView}>
              <Typography style={styles.labelTypography}>{label}</Typography>
              {"text" in answerIcon ? (
                <Typography style={[styles.answerTypography, { color }]}>
                  {answerIcon.text}
                </Typography>
              ) : (
                <MaterialCommunityIcons
                  name={answerIcon.name}
                  color={color}
                  size={24}
                />
              )}
              {fault && <IssuesStatus status={fault.status} />}
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
