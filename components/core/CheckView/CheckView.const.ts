import { type MaterialCommunityIcons } from "@expo/vector-icons"

import { type CheckAnswer } from "@/firebase/utils"

import { type Theme } from "@/hooks/useTheme"

type AnswerIconName = React.ComponentProps<typeof MaterialCommunityIcons>["name"]

export const ANSWER_ICONS: Record<
  `${CheckAnswer["value"]}`,
  { name: AnswerIconName; colorKey: keyof Theme["colors"] }
> = {
  true: { name: "check-circle", colorKey: "primary" },
  false: { name: "close-circle", colorKey: "text" },
  "not-applicable": { name: "minus-circle", colorKey: "placeholder" },
}
