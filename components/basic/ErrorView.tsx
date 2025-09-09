import { MaterialCommunityIcons } from "@expo/vector-icons"

import { useStyles } from "@/hooks/useStyles"
import { useTheme } from "@/hooks/useTheme"

import { Typography } from "./Typography"
import { View } from "./View"

const getStyles = () =>
  ({
    view: {
      alignItems: "center",
    },
  } as const)

type ErrorViewProps = {
  message: string
}

export const ErrorView = ({ message }: ErrorViewProps) => {
  const theme = useTheme()
  const styles = useStyles(getStyles)

  return (
    <View style={styles.view}>
      <Typography type="heading">{message}</Typography>
      <MaterialCommunityIcons
        name="emoticon-sad"
        size={100}
        color={theme.colors.primary}
      />
    </View>
  )
}
