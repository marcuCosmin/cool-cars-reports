import { useCallback } from "react"
import { FlatList, type ListRenderItemInfo } from "react-native"

import { type Notification } from "@/firebase/utils"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Typography } from "@/components/basic/Typography"

import { NotificationItem } from "./NotificationItem"
import { useInfiniteNotificationsList } from "./useInfiniteNotificationsList"

const getStyles = (theme: Theme) =>
  ({
    flatList: {
      backgroundColor: theme.colors.background,
      gap: 20,
    },
    noResultsTypography: {
      textAlign: "center",
      marginTop: 20,
    },
  } as const)

const keyExtractor = (item: Notification) => item.id

export const NotificationsList = () => {
  const { notifications, isLoading, loadNotificationsChunk } =
    useInfiniteNotificationsList()

  const styles = useStyles(getStyles)

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Notification>) => (
      <NotificationItem {...item} />
    ),
    []
  )

  if (!notifications.length) {
    return (
      <Typography style={styles.noResultsTypography}>
        You currently don&apos;t have any notifications
      </Typography>
    )
  }

  return (
    <FlatList
      contentContainerStyle={styles.flatList}
      data={notifications}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      //   onEndReached={loadNotificationsChunk}
    />
  )
}
