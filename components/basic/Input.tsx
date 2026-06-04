import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useMemo } from "react"
import {
  InputAccessoryView,
  Keyboard,
  KeyboardAvoidingView,
  TextInput as NativeInput,
  StyleSheet,
  type StyleProp,
  type TextStyle,
} from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Button } from "./Button"
import { Typography } from "./Typography"

const getStyles = (theme: Theme) =>
  ({
    keyboardAvoidingView: {
      flex: 1,
    },
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
    closeKeyboardButton: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
      alignItems: "flex-end",
      padding: 0,
      borderWidth: 1,
      alignSelf: "flex-end",
    },
    characterCountTypography: {
      color: theme.colors.text,
      alignSelf: "flex-end",
      marginTop: 10,
    },
  }) as const

type InputProps = {
  type?: "text" | "number" | "textarea"
  style?: StyleProp<TextStyle>
  value?: string
  placeholder?: string
  minLength?: number
  maxLength?: number
  onChange: (value: string) => void
}

const keyboardTypes = {
  text: "default",
  number: "numeric",
  textarea: "default",
} as const

let inputIndex = 0

export const Input = ({
  type = "text",
  style,
  value,
  placeholder,
  minLength,
  maxLength,
  onChange,
}: InputProps) => {
  const theme = useTheme()
  const isTextarea = type === "textarea"
  const keyboardType = keyboardTypes[type]

  const index = useMemo(() => inputIndex++, [])

  const onCloseKeyboardButtonClick = () => Keyboard.dismiss()

  const styles = useStyles(getStyles)
  const mergedStyles = StyleSheet.flatten<TextStyle>([
    styles.input,
    style,
    isTextarea && styles.textarea,
  ])

  const onChangeText = (text: string) => onChange(text)

  const hasMaxLength = maxLength !== undefined
  const hasMinLength = minLength !== undefined

  const showCharacterCount = hasMinLength || hasMaxLength
  const currentLength = value?.length ?? 0

  const renderedContent = (
    <>
      <NativeInput
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        multiline={isTextarea}
        numberOfLines={isTextarea ? 10 : 1}
        keyboardType={keyboardType}
        style={mergedStyles}
        value={value}
        maxLength={maxLength}
        onChangeText={onChangeText}
        inputAccessoryViewID={index.toString()}
      />

      <InputAccessoryView nativeID={index.toString()}>
        <Button
          style={styles.closeKeyboardButton}
          onClick={onCloseKeyboardButtonClick}
        >
          <MaterialCommunityIcons
            name="keyboard-off-outline"
            size={50}
            color={theme.colors.primary}
          />
        </Button>
      </InputAccessoryView>
    </>
  )

  if (type === "textarea") {
    return (
      <KeyboardAvoidingView
        behavior="height"
        style={styles.keyboardAvoidingView}
      >
        {renderedContent}
        {showCharacterCount && (
          <Typography style={styles.characterCountTypography}>
            {currentLength}
            {hasMinLength && ` / ${maxLength}`}
            {hasMinLength && ` (minimum ${minLength})`}
          </Typography>
        )}
      </KeyboardAvoidingView>
    )
  }

  return renderedContent
}
