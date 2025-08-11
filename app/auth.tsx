import { openURL } from "expo-linking"
import { useLocalSearchParams } from "expo-router"
import { useEffect } from "react"

import { signIn } from "@/firebase/utils"

import { useAppSelector } from "@/redux/config"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"
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
  const uid = useAppSelector(({ user }) => user.uid)
  const { authToken } = useLocalSearchParams<LocalSearchParams>()
  const { isLoading, handleAsyncRequest: handleSignIn } =
    useAsyncRequestHandler({
      request: signIn,
    })
  const styles = useStyles(getStyles)

  useEffect(() => {
    if (!authToken) {
      return
    }

    handleSignIn(authToken)
  }, [authToken])

  const onButtonClick = () =>
    openURL(`${process.env.EXPO_PUBLIC_WEB_APP_URL as string}/auth`)

  if (isLoading) {
    return <LoadingView text="Logging in..." />
  }

  return (
    <View style={styles.view}>
      <Typography type="heading">{uid}</Typography>
      <Typography type="heading">Please log in to continue</Typography>
      <Button onClick={onButtonClick}>
        <Typography type="button">
          {process.env.EXPO_PUBLIC_WEB_APP_URL}
        </Typography>
        <Typography type="button">Log in test</Typography>
      </Button>
    </View>
  )
}
