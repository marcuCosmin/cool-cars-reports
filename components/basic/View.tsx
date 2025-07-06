import { type PropsWithChildren } from "react"
import { View as NativeView, StyleSheet, type ViewStyle } from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

const getStyles = (theme: Theme) =>
  ({
    view: {
      backgroundColor: theme.colors.background,
      flex: 1,
    },
  } as const)

type ViewProps = PropsWithChildren<{
  style?: ViewStyle
}>

export const View = ({ children, style }: ViewProps) => {
  const styles = useStyles(getStyles)

  const mergedStyles = StyleSheet.flatten<ViewStyle>([styles.view, style])

  return <NativeView style={mergedStyles}>{children}</NativeView>
}
