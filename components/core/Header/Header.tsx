import { usePathname } from "expo-router"

import { useAppSelector } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Logout } from "@/components/core/Logout"
import { NotificationsLink } from "@/components/core/NotificationsLink/NotificationsLink"

import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { useCarId } from "./useCarId"

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

export const Header = () => {
  const submittedCheckId = useAppSelector(
    ({ submittedCheck }) => submittedCheck.id
  )
  const selectedCarId = useAppSelector(({ cars }) => cars.selectedCar.id)
  const carId = useCarId()

  const pathname = usePathname()
  const isHomePath = pathname === "/"
  const isReportsPath = pathname === "/reports"
  const isCheckPath = pathname === "/reports/check"
  const showReportsLinks = selectedCarId && !isReportsPath

  const styles = useStyles(getStyles)

  return (
    <View style={styles.containerView}>
      <View style={styles.mainView}>
        <NotificationsLink />

        <Typography style={styles.title}>{carId}</Typography>

        <Logout />
      </View>

      {!isHomePath && (
        <View style={styles.linksView}>
          <HeaderLink href="/" icon="home" label="Home" />

          {showReportsLinks && (
            <>
              <HeaderLink href="/reports" icon="file-table" label="Reports" />

              {!isCheckPath && !submittedCheckId && (
                <HeaderLink
                  href="/reports/check"
                  icon="checkbox-multiple-outline"
                  label="Checks"
                />
              )}
            </>
          )}
        </View>
      )}
    </View>
  )
}
