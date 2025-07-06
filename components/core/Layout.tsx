import { Stack } from "expo-router"
import { useEffect } from "react"

import { firebaseAuth } from "@/firebase/config"
import { onIdTokenChanged } from "firebase/auth"

import { useAppSelector } from "@/redux/config"
import { handleIDTokenChange } from "@/redux/userSlice"

import { useStyles } from "@/hooks/useStyles"

import { LoadingView } from "@/components/basic/LoadingView"
import { View } from "@/components/basic/View"

import { Header } from "./Header"
import { Toast } from "./Toast"

const getStyles = () => ({
  view: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 100,
    paddingTop: 20,
  },
})

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

  //   if (!user.uid) {
  //     return (
  //       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
  //         <Text>Please log in to continue.</Text>
  //       </View>
  //     )
  //   }

  return (
    <View style={{ position: "relative" }}>
      {loadingOverlay.isLoading && (
        <LoadingView overlay text={loadingOverlay.text} />
      )}
      <Toast />
      <Header />
      <View style={styles.view}>
        <Stack
          screenOptions={{
            headerShown: false,
            animation: "fade",
          }}
        />
      </View>
    </View>
  )
}
