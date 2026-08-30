import { createSelector } from "@reduxjs/toolkit"

import { groupBySection } from "@/utils/groupBySection"

import { type State } from "./config"

export const selectQuestionsBySection = createSelector(
  (state: State) => state.questions.items,
  groupBySection,
)
