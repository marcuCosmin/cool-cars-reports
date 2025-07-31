import { StyleSheet, type TextStyle, type ViewStyle } from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Button as DefaultButton } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"

const getStyles = (theme: Theme) =>
  ({
    button: {
      borderColor: theme.colors.primary,
      borderWidth: theme.borderWidth,
      borderRadius: 0,
      backgroundColor: "transparent",
      display: "flex",
      justifyContent: "center",
      height: "100%",
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
  } as const)

type TabButtonProps = {
  label: string
  isActive: boolean
  onClick: () => void
}

export const TabButton = ({ label, isActive, onClick }: TabButtonProps) => {
  const styles = useStyles(getStyles)

  const mergedButtonStyles = StyleSheet.flatten<ViewStyle>([
    styles.button,
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
