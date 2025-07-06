import { ActivityIndicator, StyleSheet } from "react-native"

import { View } from "./View"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"
import { Typography } from "./Typography"

const getStyles = (theme: Theme) =>
  ({
    loadingView: {
      display: "flex",
      justifyContent: "center",
    },
    typographyOverlay: {
      color: theme.colors.white,
    },
    overlay: {
      position: "absolute",
      width: "100%",
      height: "100%",
      zIndex: 9999,
      backgroundColor: "#00000090",
      top: 0,
      left: 0,
    },
  } as const)

type LoadingViewProps = {
  text?: string
  overlay?: boolean
}

export const LoadingView = ({ text, overlay }: LoadingViewProps) => {
  const theme = useTheme()
  const styles = useStyles(getStyles)

  const mergedViewStyles = StyleSheet.flatten([
    styles.loadingView,
    overlay && styles.overlay,
  ])

  const mergedTypographyStyles = StyleSheet.flatten([
    overlay && styles.typographyOverlay,
  ])

  const activityIndicatorColor = overlay
    ? theme.colors.white
    : theme.colors.primary

  return (
    <View style={mergedViewStyles}>
      {text && (
        <Typography type="heading" style={mergedTypographyStyles}>
          {text}
        </Typography>
      )}
      <ActivityIndicator size={100} color={activityIndicatorColor} />
    </View>
  )
}
