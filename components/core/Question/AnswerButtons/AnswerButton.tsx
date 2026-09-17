import { MaterialCommunityIcons } from "@expo/vector-icons"
import { StyleSheet } from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"

const getStyles = (theme: Theme) =>
  ({
    button: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
      borderRadius: "100%",
      borderWidth: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 100,
      height: 100,
    },
    content: {
      alignSelf: "stretch",
      display: "flex",
      textAlign: "center",
      fontSize: theme.fontSize.extraLarge,
      color: theme.colors.primary,
      fontWeight: "bold",
    },
    contentActive: {
      color: theme.colors.white,
    },
    buttonActive: {
      backgroundColor: theme.colors.primary,
    },
  }) as const

type AnswerButtonIconProps = {
  icon: "check" | "close"
}

type AnswerButtonTextProps = {
  text: string
}

type AnswerButtonProps = {
  isActive?: boolean
  onClick: () => void
} & (AnswerButtonIconProps | AnswerButtonTextProps)

export const AnswerButton = ({
  isActive,
  onClick,
  ...props
}: AnswerButtonProps) => {
  const styles = useStyles(getStyles)
  const mergedStyles = StyleSheet.flatten([
    styles.button,
    isActive && styles.buttonActive,
  ])

  if ("text" in props) {
    const mergedTypographyStyles = StyleSheet.flatten([
      styles.content,
      isActive && styles.contentActive,
    ])

    return (
      <Button style={mergedStyles} onClick={onClick}>
        <Typography numberOfLines={1} style={mergedTypographyStyles}>
          {props.text}
        </Typography>
      </Button>
    )
  }

  const iconColor = isActive ? styles.contentActive.color : styles.content.color

  return (
    <Button style={mergedStyles} onClick={onClick}>
      <MaterialCommunityIcons name={props.icon} size={75} color={iconColor} />
    </Button>
  )
}
