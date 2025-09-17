import { MaterialCommunityIcons } from "@expo/vector-icons"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Typography } from "./Typography"
import { View } from "./View"

const getStyles = (theme: Theme) =>
  ({
    view: {
      flexDirection: "row",
      alignItems: "center",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 5,
      marginTop: 5,
      flex: 0,
    },
    typography: {
      fontSize: theme.fontSize.small,
      color: theme.colors.primary,
      textAlign: "center",
      fontWeight: "bold",
    },
  } as const)

const icons = {
  pending: "timelapse",
  resolved: "check-circle",
} as const

type IssueStatusProps = {
  status: "pending" | "resolved"
}

export const IssuesStatus = ({ status }: IssueStatusProps) => {
  const theme = useTheme()
  const styles = useStyles(getStyles)
  const icon = icons[status]

  return (
    <View style={styles.view}>
      <Typography style={styles.typography}>Issue status: {status}</Typography>
      <MaterialCommunityIcons
        name={icon}
        size={15}
        color={theme.colors.primary}
      />
    </View>
  )
}
