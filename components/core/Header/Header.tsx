import { usePathname, useSegments } from "expo-router"

import { useAppSelector } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Logout } from "@/components/core/Logout"
import { NotificationsLink } from "@/components/core/NotificationsLink/NotificationsLink"

import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { HeaderLink } from "./HeaderLink"

const getStyles = (theme: Theme) =>
  ({
    containerView: {
      display: "flex",
      alignItems: "center",
      flex: 0,
      paddingTop: 50,
      paddingBottom: 0,
      padding: 20,
    },
    mainView: {
      flex: 0,
      flexDirection: "row",
      alignItems: "center",
    },
    title: {
      color: theme.colors.text,
      textAlign: "center",
      fontWeight: "bold",
      flex: 1,
    },
    linksView: {
      display: "flex",
      flexDirection: "row",
      flex: 0,
      width: "auto",
    },
  } as const)

const linksConfig = {
  "/reports": {
    label: "Reports",
    icon: "file-table",
  },
  "/reports/check": {
    label: "Checks",
    icon: "checkbox-multiple-outline",
  },
} as const

export const Header = () => {
  const styles = useStyles(getStyles)
  const selectedCarId = useAppSelector(({ cars }) => cars.selectedCar.id)

  const pathname = usePathname()
  const isHome = pathname === "/"
  const segments = useSegments()

  const carIdSegmentIndex = segments.findIndex((segment) =>
    segment.startsWith("[carId]")
  )
  const carIdUrlParam = pathname.split("/")[carIdSegmentIndex + 1]

  const displayedReportsCarId = pathname.startsWith("/reports")
    ? selectedCarId
    : null
  const displayedCarId = carIdUrlParam || displayedReportsCarId

  const slicedSegments = segments.slice(0, -1)

  return (
    <View style={styles.containerView}>
      <View style={styles.mainView}>
        <NotificationsLink />

        <Typography style={styles.title}>{displayedCarId}</Typography>

        <Logout />
      </View>

      <View style={styles.linksView}>
        {!isHome && <HeaderLink href="/" icon="home" label="Home" />}
        {slicedSegments.map((segment, index) => {
          if (segment === "_sitemap") {
            return null
          }

          const href = `/${slicedSegments.slice(0, index + 1).join("/")}`

          const config = linksConfig[href as keyof typeof linksConfig]

          if (!config) {
            return null
          }

          return (
            <HeaderLink
              href={href}
              key={segment}
              icon={config.icon}
              label={config.label}
            />
          )
        })}
      </View>
    </View>
  )
}
