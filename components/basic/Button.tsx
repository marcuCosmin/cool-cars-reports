import { type PropsWithChildren } from "react"
import {
  Pressable,
  StyleSheet,
  ViewStyle,
  type PressableStateCallbackType,
  type StyleProp,
} from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

const getStyles = (theme: Theme) => ({
  pressable: {
    borderRadius: theme.borderRadius,
    padding: theme.inputPadding,
    backgroundColor: theme.colors.primary,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    opacity: 0.8,
  },
})

type ButtonProps = PropsWithChildren<{
  isActive?: boolean
  disabled?: boolean
  style?: StyleProp<ViewStyle>
  onClick?: () => void
}>

export const Button = ({ children, disabled, style, onClick }: ButtonProps) => {
  const styles = useStyles(getStyles)

  const mergeStyles = ({ pressed }: PressableStateCallbackType) =>
    StyleSheet.flatten([
      styles.pressable,
      pressed && styles.pressed,
      disabled && styles.disabled,
      style,
    ])

  return (
    <Pressable disabled={disabled} onPress={onClick} style={mergeStyles}>
      {children}
    </Pressable>
  )
}
