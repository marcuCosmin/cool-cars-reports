import {
  ActivityIndicator,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { loadingViewSize } from "./LoadingView.const"

import type { LoadingViewSize } from "./LoadingView.model"

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
  size?: LoadingViewSize
  style?: StyleProp<ViewStyle>
}

export const LoadingView = ({
  text,
  overlay,
  size = "large",
  style,
}: LoadingViewProps) => {
  const theme = useTheme()
  const styles = useStyles(getStyles)
  const sizeValue = loadingViewSize[size]

  const mergedViewStyles = StyleSheet.flatten([
    styles.loadingView,
    overlay && styles.overlay,
    style,
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
      <ActivityIndicator size={sizeValue} color={activityIndicatorColor} />
    </View>
  )
}
