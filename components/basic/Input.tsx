import {
  TextInput as NativeInput,
  StyleSheet,
  type StyleProp,
  type TextStyle,
} from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

const getStyles = (theme: Theme) =>
  ({
    input: {
      borderWidth: theme.borderWidth,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius,
      padding: theme.inputPadding,
      color: theme.colors.text,
      fontSize: theme.fontSize.medium,
    },
    textarea: {
      maxHeight: "50%",
      textAlignVertical: "top",
      flex: 1,
    },
  } as const)

type InputProps = {
  type?: "text" | "number" | "textarea"
  style?: StyleProp<TextStyle>
  value?: string
  placeholder?: string
  onChange: (value: string) => void
}

const keyboardTypes = {
  text: "default",
  number: "numeric",
  textarea: "default",
} as const

export const Input = ({
  type = "text",
  style,
  value,
  placeholder,
  onChange,
}: InputProps) => {
  const theme = useTheme()
  const isTextarea = type === "textarea"
  const keyboardType = keyboardTypes[type]

  const styles = useStyles(getStyles)
  const mergedStyles = StyleSheet.flatten<TextStyle>([
    styles.input,
    style,
    isTextarea && styles.textarea,
  ])

  const onChangeText = (text: string) => onChange(text)

  return (
    <NativeInput
      placeholder={placeholder}
      placeholderTextColor={theme.colors.placeholder}
      multiline={isTextarea}
      numberOfLines={isTextarea ? 10 : 1}
      keyboardType={keyboardType}
      style={mergedStyles}
      value={value}
      onChangeText={onChangeText}
    />
  )
}
