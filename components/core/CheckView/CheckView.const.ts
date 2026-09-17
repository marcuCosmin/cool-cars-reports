import { type MaterialCommunityIcons } from "@expo/vector-icons"

import { type CheckAnswer } from "@/firebase/utils"

import { type Theme } from "@/hooks/useTheme"

type AnswerIconName = React.ComponentProps<
  typeof MaterialCommunityIcons
>["name"]

type AnswerIconConfig = { colorKey: keyof Theme["colors"] } & (
  | { name: AnswerIconName }
  | { text: string }
)

export const answersIconsConfig: Record<
  `${CheckAnswer["value"]}`,
  AnswerIconConfig
> = {
  true: { name: "check-circle", colorKey: "primary" },
  false: { name: "close-circle", colorKey: "text" },
  "not-applicable": { text: "N/A", colorKey: "placeholder" },
}
