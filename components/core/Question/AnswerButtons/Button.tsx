import { MaterialCommunityIcons } from "@expo/vector-icons"
import { StyleSheet, type ViewStyle } from "react-native"

import { Button as DefaultButton } from "@/components/basic/Button"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

const getStyles = (theme: Theme) =>
  ({
    button: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
      borderRadius: "100%",
      borderWidth: 1,
      display: "flex",
      alignItems: "center",
      width: 100,
      height: 100,
    },
    buttonActive: {
      backgroundColor: theme.colors.primary,
    },
  } as const)

type ButtonProps = {
  icon: "check" | "close"
  isActive?: boolean
  onClick: () => void
}

export const Button = ({ icon, isActive, onClick }: ButtonProps) => {
  const styles = useStyles(getStyles)
  const mergedStyles = StyleSheet.compose<ViewStyle, ViewStyle, ViewStyle>(
    styles.button,
    isActive && styles.buttonActive
  )
  const theme = useTheme()
  const iconColor = isActive ? theme.colors.white : theme.colors.primary

  return (
    <DefaultButton style={mergedStyles} onClick={onClick}>
      <MaterialCommunityIcons name={icon} size={75} color={iconColor} />
    </DefaultButton>
  )
}
