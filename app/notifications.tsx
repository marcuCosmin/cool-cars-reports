import { NotificationsList } from "@/components/core/NotificationsList/NotificationsList"

import { useStyles } from "@/hooks/useStyles"

import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = () => ({
  headingTypography: {
    marginBottom: 10,
  },
})

const Notifications = () => {
  const styles = useStyles(getStyles)

  return (
    <View>
      <Typography type="heading" style={styles.headingTypography}>
        Notifications
      </Typography>

      <NotificationsList />
    </View>
  )
}

export default Notifications
