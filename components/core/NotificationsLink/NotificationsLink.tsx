import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"

import { useUnreadNotificationsCount } from "./useUnreadNotificationsCount"

const getStyles = (theme: Theme) =>
  ({
    button: {
      backgroundColor: "transparent",
      position: "relative",
    },
    typography: {
      backgroundColor: theme.colors.primary,
      borderRadius: theme.borderRadius,
      top: 0,
      right: 0,
      zIndex: 1,
      padding: 2,
      position: "absolute",
      fontSize: theme.fontSize.small,
      textAlign: "center",
      width: "100%",
    },
  } as const)

type NotificationsLinkProps = {
  style?: StyleProp<ViewStyle>
}

export const NotificationsLink = ({ style }: NotificationsLinkProps) => {
  const { unreadNotificationsCount } = useUnreadNotificationsCount()
  const displayedCount =
    unreadNotificationsCount > 99 ? "99+" : unreadNotificationsCount

  const theme = useTheme()
  const styles = useStyles(getStyles)
  const mergedStyles = StyleSheet.flatten([styles.button, style])

  const onClick = () => router.push("/notifications")

  return (
    <Button style={mergedStyles} onClick={onClick}>
      {!!unreadNotificationsCount && (
        <Typography style={styles.typography} type="button">
          {displayedCount}
        </Typography>
      )}
      <MaterialCommunityIcons name="bell" size={35} color={theme.colors.text} />
    </Button>
  )
}
