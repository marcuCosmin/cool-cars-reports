import { MaterialCommunityIcons } from "@expo/vector-icons"
import { StyleSheet } from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import type { ActionCardProps } from "./ActionCardList.model"

const getStyles = (theme: Theme) =>
  ({
    button: {
      width: theme.actionCardSize,
      gap: 20,
      display: "flex",
      alignItems: "center",
      position: "relative",
    },
    buttonWithOverlay: {
      opacity: 1,
    },
    typography: {
      fontSize: theme.fontSize.medium,
      fontWeight: "bold",
    },
    overlay: {
      borderRadius: theme.borderRadius,
      backgroundColor: theme.colors.overlay,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
  } as const)

export const ActionCard = ({
  hidden,
  icon,
  label,
  displayOverlay,
  disabled,
  overlayIcon,
  onClick,
}: ActionCardProps) => {
  const theme = useTheme()
  const styles = useStyles(getStyles)

  const buttonStyle = StyleSheet.flatten([
    styles.button,
    displayOverlay && styles.buttonWithOverlay,
  ])

  if (hidden) {
    return null
  }

  return (
    <Button style={buttonStyle} onClick={onClick} disabled={disabled}>
      {displayOverlay && (
        <View style={styles.overlay}>
          {overlayIcon && (
            <MaterialCommunityIcons
              name={overlayIcon}
              size={30}
              color={theme.colors.white}
            />
          )}
        </View>
      )}
      <Typography type="button" style={styles.typography}>
        {label}
      </Typography>
      <MaterialCommunityIcons
        name={icon}
        size={70}
        color={theme.colors.white}
      />
    </Button>
  )
}
