import { type PropsWithChildren } from "react"
import { StyleSheet, Text, type StyleProp, type TextStyle } from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

const getStyles = (theme: Theme) =>
  ({
    heading: {
      fontSize: 24,
      fontWeight: "bold",
      color: theme.colors.primary,
      marginBottom: 50,
      textAlign: "center",
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
      fontWeight: "semibold",
      marginBottom: 8,
    },
    text: {
      fontSize: 16,
      color: theme.colors.text,
    },
    button: {
      fontSize: 16,
      color: theme.colors.white,
      fontWeight: "semibold",
      textAlign: "center",
    },
  } as const)

type TypographyProps = PropsWithChildren<{
  type?: "heading" | "label" | "text" | "button"
  style?: StyleProp<TextStyle>
}>

export const Typography = ({
  type = "text",
  style,
  children,
}: TypographyProps) => {
  const styles = useStyles(getStyles)
  const typeStyles = styles[type]

  const mergedStyles = StyleSheet.compose<TextStyle, TextStyle, TextStyle>(
    typeStyles,
    style
  )

  return <Text style={mergedStyles}>{children}</Text>
}
