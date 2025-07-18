import { Stack } from "expo-router"
import { useEffect } from "react"

import { firebaseAuth } from "@/firebase/config"
import { onIdTokenChanged } from "firebase/auth"

import { useAppSelector } from "@/redux/config"
import { handleIDTokenChange } from "@/redux/userSlice"

import { useStyles } from "@/hooks/useStyles"

import { LoadingView } from "@/components/basic/LoadingView"
import { View } from "@/components/basic/View"

import { type Theme } from "@/hooks/useTheme"

import { Auth } from "./Auth"
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
  const styles = useStyles(getStyles)

  useEffect(() => {
    const onIdTokenChangedCleanup = onIdTokenChanged(
      firebaseAuth,
      handleIDTokenChange
    )

    return onIdTokenChangedCleanup
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
        {user.uid ? (
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
            }}
          />
        ) : (
          <Auth />
        )}
      </View>
    </View>
  )
}
