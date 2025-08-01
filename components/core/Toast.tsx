import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useEffect } from "react"
import { ScrollView } from "react-native"

import { useAppSelector } from "@/redux/config"
import { hideToast } from "@/redux/toastSlice"
import { useDispatch } from "react-redux"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = (theme: Theme) =>
  ({
    view: {
      borderColor: theme.colors.text,
      borderWidth: theme.borderWidth,
      borderRadius: theme.borderRadius,
      backgroundColor: theme.colors.primary,
      padding: theme.inputPadding,
      gap: theme.gap,
      position: "absolute",
      maxWidth: "100%",
      maxHeight: 150,
      flex: 1,
      zIndex: 9999,
      top: 50,
      flexWrap: "wrap",
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
    },
    scrollView: {
      flex: 1,
    },
    button: {
      backgroundColor: "transparent",
      padding: 0,
    },
    typography: {
      textAlign: "left",
    },
  } as const)

export const Toast = () => {
  const theme = useTheme()
  const styles = useStyles(getStyles)
  const message = useAppSelector(({ toast }) => toast.message)

  const dispatch = useDispatch()

  const onClick = () => dispatch(hideToast())

  useEffect(() => {
    if (!message) {
      return
    }

    const timeout = setTimeout(() => dispatch(hideToast()), 5000)
    return () => clearTimeout(timeout)
  }, [message])

  if (!message) {
    return null
  }

  return (
    <View style={styles.view}>
      <Button style={styles.button} onClick={onClick}>
        <MaterialCommunityIcons
          name="close-circle"
          size={30}
          color={theme.colors.white}
        />
      </Button>
      <ScrollView style={styles.scrollView}>
        <Typography type="button" style={styles.typography}>
          {message}
        </Typography>
      </ScrollView>
    </View>
  )
}
