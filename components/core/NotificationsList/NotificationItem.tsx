import { router } from "expo-router"

import { markNotificationAsViewed, type Notification } from "@/firebase/utils"

import { useAppSelector } from "@/redux/config"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"
import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { parseTimestampForDisplay } from "@/utils/parseTimestampForDisplay"

import { getNotificationItemConfig } from "./NotificationsList.utils"

const getStyles = (theme: Theme) =>
  ({
    button: {
      backgroundColor: theme.colors.background,
      borderWidth: theme.borderWidth,
      borderColor: theme.colors.primary,
      flex: 0,
      alignItems: "center",
    },
    metadataView: {
      display: "flex",
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      marginBottom: 15,
    },
    metadataTypography: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.small,
      fontWeight: "bold",
    },
  } as const)

export const NotificationItem = ({
  creationTimestamp,
  carId,
  reference,
  type,
  viewed,
  bulkCount,
  id,
}: Notification) => {
  const styles = useStyles(getStyles)
  const uid = useAppSelector(({ user }) => user.uid)
  const { handleAsyncRequest: handleMarkNotificationAsViewed } =
    useAsyncRequestHandler({
      request: markNotificationAsViewed,
    })
  const parsedTimestamp = parseTimestampForDisplay({
    timestamp: creationTimestamp,
  })

  const { message, redirectUrl } = getNotificationItemConfig({
    reference,
    type,
    bulkCount,
    carId,
  })

  const onClick = async () => {
    if (!viewed) {
      await handleMarkNotificationAsViewed({
        uid: uid as string,
        notificationId: id,
      })
    }

    router.push(redirectUrl)
  }

  return (
    <Button style={styles.button} onClick={onClick}>
      <View style={styles.metadataView}>
        <Typography style={styles.metadataTypography}>{carId}</Typography>
        <Typography style={styles.metadataTypography}>
          {parsedTimestamp}
        </Typography>
      </View>

      <Typography style={{ textAlign: "center" }}>{message}</Typography>
    </Button>
  )
}
