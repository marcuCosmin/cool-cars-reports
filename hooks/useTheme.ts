import { useMemo } from "react"
import { useColorScheme } from "react-native"

const white = "#ffffff"
const black = "#000000"
const primary = "#007bff"
const red = "#ff0000"

const getTheme = (isDarkMode: boolean) => {
  const textColor = isDarkMode ? white : black

  return {
    colors: {
      primary,
      white,
      black,
      red,
      text: textColor,
      background: isDarkMode ? black : white,
      overlay: `${black}50`,
      placeholder: `${textColor}50`,
    },
    fontSize: {
      small: 12,
      medium: 16,
      large: 24,
    },
    gap: 10,
    borderRadius: 8,
    borderWidth: 1,
    inputPadding: 10,
    actionCardSize: 150,
    mainViewPaddingX: 10,
  }
}

export type Theme = ReturnType<typeof getTheme>

export const useTheme = () => {
  const themeMode = useColorScheme()
  const isDarkMode = themeMode === "dark"
  const theme = useMemo(() => getTheme(isDarkMode), [isDarkMode])

  return theme
}
