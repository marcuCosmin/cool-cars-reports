import { openURL } from "expo-linking"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"

import { firebaseAuth } from "@/firebase/config"
import { signInWithCustomToken } from "firebase/auth"

import { useAppDispatch, useAppSelector } from "@/redux/config"
import { showToast } from "@/redux/toastSlice"

import { useStyles } from "@/hooks/useStyles"

import { Button } from "@/components/basic/Button"
import { LoadingView } from "@/components/basic/LoadingView"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = () =>
  ({
    view: {
      justifyContent: "center",
    },
  } as const)

type LocalSearchParams = {
  authToken?: string
}

export default function Auth() {
  const { uid } = useAppSelector((state) => state.user)
  const { authToken } = useLocalSearchParams<LocalSearchParams>()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState(!!authToken)
  const styles = useStyles(getStyles)

  useEffect(() => {
    if (!authToken) {
      return
    }

    ;(async () => {
      try {
        setLoading(true)
        await signInWithCustomToken(firebaseAuth, authToken)
      } catch (error) {
        let errorMessage = "An error occurred during login"
        if (error instanceof Error) {
          errorMessage = error.message
          return
        }

        dispatch(showToast(errorMessage))
      } finally {
        setLoading(false)
      }
    })()
  }, [authToken])

  const onButtonClick = () =>
    openURL(process.env.EXPO_PUBLIC_WEB_APP_URL as string)

  if (loading) {
    return <LoadingView text="Logging in..." />
  }

  return (
    <View style={styles.view}>
      <Typography type="heading">{uid}</Typography>
      <Typography type="heading">Please log in to continue</Typography>
      <Button onClick={onButtonClick}>
        <Typography type="button">Log in</Typography>
      </Button>
    </View>
  )
}
