import { useStyles } from "@/hooks/useStyles"
import { View } from "../View"

import { ActionCard, type ActionCardProps } from "./ActionCard"

const getStyles = () =>
  ({
    view: {
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 50,
    },
  } as const)

type ActionCardListProps = {
  items: ActionCardProps[]
}
export const ActionCardList = ({ items }: ActionCardListProps) => {
  const styles = useStyles(getStyles)

  return (
    <View style={styles.view}>
      {items.map((item, index) => (
        <ActionCard {...item} key={index} />
      ))}
    </View>
  )
}
export type { ActionCardProps }
