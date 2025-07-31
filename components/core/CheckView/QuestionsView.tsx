import { MaterialCommunityIcons } from "@expo/vector-icons"
import { ScrollView } from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { IssuesStatus } from "@/components/basic/IssuesStatus"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

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
  } as const)

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

          const iconName = answer.value ? "check-circle" : "close-circle"
          const iconColor = answer.value
            ? theme.colors.primary
            : theme.colors.text

          return (
            <View key={index} style={styles.itemView}>
              <Typography style={styles.labelTypography}>{label}</Typography>
              <MaterialCommunityIcons
                name={iconName}
                color={iconColor}
                size={24}
              />
              {fault && <IssuesStatus status={fault.status} />}
            </View>
          )
        })}
      </ScrollView>
    </View>
  )
}
