import { router } from "expo-router"

import {
  ActionCardList,
  type ActionCardProps,
} from "@/components/basic/ActionCardList/ActionCardList"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const actionCardListItems: ActionCardProps[] = [
  {
    label: "Check",
    icon: "playlist-check",
    onClick: () => {
      router.push("/reports/check")
    },
  },
  // {
  //   label: "Incident",
  //   icon: "car-cog",
  //   onClick: () => {
  //     router.push("/reports/incident")
  //   },
  // },
]

export default function Reports() {
  return (
    <View>
      <Typography type="heading">Reports</Typography>

      <ActionCardList items={actionCardListItems} />
    </View>
  )
}
