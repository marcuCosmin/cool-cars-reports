import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router, type RelativePathString } from "expo-router"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"

const getStyles = (theme: Theme) =>
  ({
    button: {
      display: "flex",
      alignItems: "center",
      backgroundColor: "transparent",
      flex: 0,
    },
    typography: {
      color: theme.colors.text,
      fontWeight: "bold",
    },
  } as const)

type HeaderLinkProps = {
  href: string
  label: string
  icon: "home" | "file-table" | "checkbox-multiple-outline"
  onClick?: () => void
}

export const HeaderLink = ({
  href,
  label,
  icon,
  onClick: propsOnClick,
}: HeaderLinkProps) => {
  const styles = useStyles(getStyles)
  const theme = useTheme()

  const onClick = () => {
    if (propsOnClick) {
      propsOnClick()
      return
    }

    router.push(href as RelativePathString)
  }

  return (
    <Button onClick={onClick} style={styles.button}>
      <MaterialCommunityIcons name={icon} size={25} color={theme.colors.text} />
      <Typography style={styles.typography}>{label}</Typography>
    </Button>
  )
}
