import { Stack } from "expo-router"
import { useEffect } from "react"

import { firebaseAuth } from "@/firebase/config"
import { onIdTokenChanged } from "firebase/auth"

import { useAppDispatch, useAppSelector } from "@/redux/config"
import { clearUserData, initUserData } from "@/redux/userSlice"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { LoadingView } from "@/components/basic/LoadingView"
import { View } from "@/components/basic/View"

import { Header } from "./Header"
import { Toast } from "./Toast"

const getStyles = (theme: Theme) =>
  ({
    container: {
      position: "relative",
    },
    mainView: {
      paddingLeft: theme.mainViewPaddingX,
      paddingRight: theme.mainViewPaddingX,
      paddingBottom: 100,
      paddingTop: 20,
    },
  } as const)

export const Layout = () => {
  const { user, loadingOverlay } = useAppSelector(
    ({ user, loadingOverlay }) => ({ user, loadingOverlay })
  )
  const dispatch = useAppDispatch()
  const styles = useStyles(getStyles)

  useEffect(() => {
    const cancelTokenChangeSubscription = onIdTokenChanged(
      firebaseAuth,
      (user) => {
        if (user) {
          const { uid } = user
          dispatch(initUserData({ uid }))
          return
        }

        dispatch(clearUserData())
      }
    )

    return cancelTokenChangeSubscription
  }, [])

  if (user.isLoading) {
    return <LoadingView />
  }

  return (
    <View style={styles.container}>
      {loadingOverlay.isLoading && (
        <LoadingView overlay text={loadingOverlay.text} />
      )}
      <Toast />
      {user.uid && <Header />}
      <View style={styles.mainView}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        >
          <Stack.Protected guard={!!user.uid}>
            <Stack.Screen name="index" />
            <Stack.Screen name="reports" />
          </Stack.Protected>
          <Stack.Protected guard={!user.uid}>
            <Stack.Screen name="auth" />
          </Stack.Protected>
        </Stack>
      </View>
    </View>
  )
}
