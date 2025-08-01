import { StyleSheet, type TextStyle, type ViewStyle } from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Button as DefaultButton } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"

const getStyles = (theme: Theme) =>
  ({
    button: {
      borderColor: theme.colors.primary,
      borderWidth: 0,
      borderRightWidth: theme.borderWidth,
      borderRadius: 0,
      backgroundColor: "transparent",
      display: "flex",
      flex: 0,
      justifyContent: "center",
    },
    buttonActive: {
      backgroundColor: theme.colors.primary,
    },
    typography: {
      color: theme.colors.text,
    },
    typgoraphyActive: {
      color: theme.colors.white,
    },
    firstButton: {
      borderTopLeftRadius: theme.borderRadius,
      borderBottomLeftRadius: theme.borderRadius,
      borderLeftWidth: 0,
    },
    lastButton: {
      borderTopRightRadius: theme.borderRadius,
      borderBottomRightRadius: theme.borderRadius,
      borderLeftWidth: 0,
      borderRightWidth: 0,
    },
  } as const)

type TabButtonProps = {
  position: "first" | "middle" | "last"
  label: string
  isActive: boolean
  onClick: () => void
}

export const TabButton = ({
  label,
  isActive,
  position,
  onClick,
}: TabButtonProps) => {
  const styles = useStyles(getStyles)

  const mergedButtonStyles = StyleSheet.flatten<ViewStyle>([
    styles.button,
    position === "first" && styles.firstButton,
    position === "last" && styles.lastButton,
    isActive && styles.buttonActive,
  ])
  const mergedTypographyStyles = StyleSheet.flatten<TextStyle>([
    styles.typography,
    isActive && styles.typgoraphyActive,
  ])

  return (
    <DefaultButton style={mergedButtonStyles} onClick={onClick}>
      <Typography type="button" style={mergedTypographyStyles}>
        {label}
      </Typography>
    </DefaultButton>
  )
}
