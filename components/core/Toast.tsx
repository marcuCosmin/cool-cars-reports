import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useEffect } from "react"

import { useAppSelector } from "@/redux/config"
import { hideToast } from "@/redux/toastSlice"
import { useDispatch } from "react-redux"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"

const getStyles = (theme: Theme) =>
  ({
    view: {
      borderColor: theme.colors.text,
      borderWidth: theme.borderWidth,
      position: "absolute",
      zIndex: 9999,
      top: 50,
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
  } as const)

export const Toast = () => {
  const theme = useTheme()
  const styles = useStyles(getStyles)
  const { message } = useAppSelector((state) => state.toast)

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
    <Button style={styles.view} onClick={onClick}>
      <Typography type="button">{message}</Typography>
      <MaterialCommunityIcons
        name="information-outline"
        size={30}
        color={theme.colors.white}
      />
    </Button>
  )
}
