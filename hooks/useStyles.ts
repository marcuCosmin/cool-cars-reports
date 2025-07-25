import {
  StyleSheet,
  type ImageStyle,
  type TextStyle,
  type ViewStyle,
} from "react-native"

import { useMemo } from "react"

import { useTheme, type Theme } from "./useTheme"

type NamedStyles<T> = { [P in keyof T]: ViewStyle | TextStyle | ImageStyle }

export type GetStyles<T extends NamedStyles<T>> = (theme: Theme) => T

export const useStyles = <T extends NamedStyles<T>>(
  getStyles: GetStyles<T>
) => {
  const theme = useTheme()

  const styleSheet = useMemo(() => {
    const styles = getStyles(theme)
    const styleSheet = StyleSheet.create(styles)

    return styleSheet
  }, [theme])

  return styleSheet
}
