import { NotificationsList } from "@/components/core/NotificationsList"

import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const Notifications = () => {
  return (
    <View>
      <Typography type="heading">Notifications</Typography>

      <NotificationsList />
    </View>
  )
}

export default Notifications
