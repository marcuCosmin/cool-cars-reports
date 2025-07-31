import { useCallback } from "react"
import { FlatList, type ListRenderItemInfo } from "react-native"

import { type Notification } from "@/firebase/utils"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Typography } from "@/components/basic/Typography"

import { LoadingView } from "@/components/basic/LoadingView"
import { View } from "@/components/basic/View"

import { useInfiniteNotificationsList } from "./useInfiniteNotificationsList"

import { NotificationItem } from "./NotificationItem"
import { NotificationsFilters } from "./NotificationsFilters"

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
  const {
    filters,
    dispatchFilters,
    isInitLoading,
    isFirstTimeLoading,
    notifications,
    loadNextNotificationsChunk,
  } = useInfiniteNotificationsList()

  const styles = useStyles(getStyles)

  const renderItem = useCallback(
    ({ item }: ListRenderItemInfo<Notification>) => (
      <NotificationItem {...item} />
    ),
    []
  )

  if (isFirstTimeLoading) {
    return <LoadingView text="Loading notifications..." />
  }

  return (
    <View>
      <NotificationsFilters
        filters={filters}
        dispatchFilters={dispatchFilters}
      />

      {isInitLoading ? (
        <LoadingView />
      ) : notifications.length ? (
        <FlatList
          contentContainerStyle={styles.flatList}
          data={notifications}
          renderItem={renderItem}
          keyExtractor={keyExtractor}
          onEndReached={loadNextNotificationsChunk}
        />
      ) : (
        <Typography style={styles.noResultsTypography}>
          You currently don&apos;t have any notifications
        </Typography>
      )}
    </View>
  )
}
