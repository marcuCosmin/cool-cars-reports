import { type QuestionSection } from "@/firebase/utils"

export const groupBySection = <T extends { section: QuestionSection }>(
  items: T[],
): Record<QuestionSection, T[]> => ({
  interior: items.filter(({ section }) => section === "interior"),
  exterior: items.filter(({ section }) => section === "exterior"),
  driver: items.filter(({ section }) => section === "driver"),
})
