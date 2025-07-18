import { useColorScheme } from "react-native"

const white = "#ffffff"
const black = "#000000"
const primary = "#007bff"
const red = "#ff0000"

const getTheme = (isDarkMode: boolean) => ({
  colors: {
    primary,
    white,
    black,
    red,
    text: isDarkMode ? white : black,
    background: isDarkMode ? black : white,
    overlay: `${black}50`,
  },
  fontSize: 16,
  borderRadius: 8,
  borderWidth: 1,
  inputPadding: 10,
  inputHeight: 60,
  actionCardSize: 150,
  mainViewPaddingX: 10,
})

export type Theme = ReturnType<typeof getTheme>

export const useTheme = () => {
  const themeMode = useColorScheme()
  const isDarkMode = themeMode === "dark"
  const theme = getTheme(isDarkMode)

  return theme
}
