import { router } from "expo-router"

import { useAppSelector } from "@/redux/config"

import {
  ActionCardList,
  type ActionCardProps,
} from "@/components/basic/ActionCardList/ActionCardList"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

export default function Reports() {
  const submittedCheckId = useAppSelector(
    ({ submittedCheck }) => submittedCheck.id
  )

  const actionCardListItems: ActionCardProps[] = [
    {
      label: "Check",
      icon: "playlist-check",
      disabled: !!submittedCheckId,
      overlayIcon: submittedCheckId ? "check-circle" : undefined,
      displayOverlay: !!submittedCheckId,
      onClick: () => {
        router.push("/reports/check")
      },
    },
    {
      label: "Incident",
      icon: "car-cog",
      disabled: !submittedCheckId,
      displayOverlay: !submittedCheckId,
      onClick: () => {
        router.push("/reports/incident")
      },
    },
  ]

  return (
    <View>
      <Typography type="heading">Reports</Typography>

      <ActionCardList items={actionCardListItems} />
    </View>
  )
}
