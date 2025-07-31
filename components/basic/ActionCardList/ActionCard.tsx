import { MaterialCommunityIcons } from "@expo/vector-icons"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = (theme: Theme) =>
  ({
    button: {
      width: theme.actionCardSize,
      height: theme.actionCardSize,
      gap: 20,
      display: "flex",
      alignItems: "center",
      position: "relative",
    },
    typography: {
      fontSize: 20,
    },
    overlay: {
      height: theme.actionCardSize,
      width: theme.actionCardSize,
      backgroundColor: theme.colors.overlay,
      display: "flex",
      alignItems: "flex-end",
      justifyContent: "flex-end",
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 1,
      padding: 5,
    },
  } as const)

type Icons =
  | "car-arrow-left"
  | "car-arrow-right"
  | "car-cog"
  | "speedometer"
  | "playlist-check"
  | "check-circle"

export type ActionCardProps = {
  label: string
  icon: Icons
  displayOverlay?: boolean
  overlayIcon?: Icons
  onClick: () => void
}

export const ActionCard = ({
  icon,
  label,
  displayOverlay,
  overlayIcon,
  onClick,
}: ActionCardProps) => {
  const theme = useTheme()
  const styles = useStyles(getStyles)

  return (
    <Button style={styles.button} onClick={onClick}>
      {displayOverlay && (
        <View style={styles.overlay}>
          {overlayIcon && (
            <MaterialCommunityIcons
              name={overlayIcon}
              size={30}
              color={theme.colors.white}
            />
          )}
        </View>
      )}
      <Typography type="button" style={styles.typography}>
        {label}
      </Typography>
      <MaterialCommunityIcons
        name={icon}
        size={70}
        color={theme.colors.white}
      />
    </Button>
  )
}
