import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"

import { CheckDoc, getCheck } from "@/firebase/utils"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"
import { useStyles } from "@/hooks/useStyles"
import { useTheme } from "@/hooks/useTheme"

import { CheckView } from "@/components/core/CheckView/CheckView"

import { LoadingView } from "@/components/basic/LoadingView"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = () =>
  ({
    errorView: {
      alignItems: "center",
    },
  } as const)

type LocalSearchParams = {
  carId: string
  checkId: string
}

const Check = () => {
  const styles = useStyles(getStyles)
  const theme = useTheme()
  const [check, setCheck] = useState<CheckDoc>()
  const { carId, checkId } = useLocalSearchParams<LocalSearchParams>()

  const { isLoading, handleAsyncRequest: handleGetCheck } =
    useAsyncRequestHandler({
      request: getCheck,
      isLoadingByDefault: true,
    })

  useEffect(() => {
    ;(async () => {
      const check = await handleGetCheck({
        carId,
        checkId,
      })

      setCheck(check)
    })()
  }, [carId, checkId])

  if (isLoading) {
    return <LoadingView text="Loading check details..." />
  }

  if (!check) {
    return (
      <View style={styles.errorView}>
        <Typography type="heading">Failed to load check details</Typography>
        <MaterialCommunityIcons
          name="emoticon-sad"
          size={100}
          color={theme.colors.primary}
        />
      </View>
    )
  }

  return <CheckView {...check} checkId={checkId} carId={carId} />
}

export default Check
