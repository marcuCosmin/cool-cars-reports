import { ScrollView } from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { ActionCard, type ActionCardProps } from "./ActionCard"

const getStyles = (theme: Theme) =>
  ({
    view: {
      paddingBottom: theme.inputPadding,
      display: "flex",
      flexDirection: "row",
      flexWrap: "wrap",
      justifyContent: "center",
      gap: 40,
    },
  } as const)

type ActionCardListProps = {
  items: ActionCardProps[]
}
export const ActionCardList = ({ items }: ActionCardListProps) => {
  const styles = useStyles(getStyles)

  return (
    <ScrollView contentContainerStyle={styles.view}>
      {items.map((item, index) => (
        <ActionCard {...item} key={index} />
      ))}
    </ScrollView>
  )
}
export type { ActionCardProps }
