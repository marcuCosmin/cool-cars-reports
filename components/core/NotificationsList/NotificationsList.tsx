import { useCallback } from "react"
import { FlatList, type ListRenderItemInfo } from "react-native"

import { type Notification } from "@/firebase/utils"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Typography } from "@/components/basic/Typography"

import { useInfiniteNotificationsList } from "./useInfiniteNotificationsList"

import { Collapsible } from "@/components/basic/Collapsible/Collapsible"
import { View } from "@/components/basic/View"

import { LoadingView } from "@/components/basic/LoadingView"
import { NotificationItem } from "./NotificationItem"

const getStyles = (theme: Theme) =>
  ({
    collapsible: {
      marginBottom: 20,
    },
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
  const { isLoadingFirstChunk, notifications, loadNotificationsChunk } =
    useInfiniteNotificationsList()

  const styles = useStyles(getStyles)

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Notification>) => (
      <NotificationItem {...item} />
    ),
    []
  )

  if (isLoadingFirstChunk) {
    return <LoadingView text="Loading notifications..." />
  }

  if (!notifications.length) {
    return (
      <Typography style={styles.noResultsTypography}>
        You currently don&apos;t have any notifications
      </Typography>
    )
  }

  return (
    <View>
      <Collapsible style={styles.collapsible} id="parent">
        <Collapsible id="child">
          <Typography>This is my text</Typography>
          <Typography>This is my text</Typography>
          <Typography>This is my text</Typography>
        </Collapsible>
      </Collapsible>

      <FlatList
        contentContainerStyle={styles.flatList}
        data={notifications}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        onEndReached={loadNotificationsChunk}
      />
    </View>
  )
}
