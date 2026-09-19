import { createSelector } from "@reduxjs/toolkit"

import {
  type CheckAnswer,
  type Question,
  type QuestionSection,
} from "@/firebase/utils"

import { isAnswerDetailsValid } from "@/components/core/FaultDetails/FaultDetails.utils"

import { groupBySection } from "@/utils/groupBySection"

import { type State } from "./config"
import { selectQuestionsBySection } from "./questions.selectors"

export const selectAnswersBySection = createSelector(
  (state: State) => state.answers.items,
  groupBySection,
)

const sectionIsCompleted = (
  questions: Question[],
  answers: CheckAnswer[],
): boolean =>
  questions.length === answers.length &&
  answers.every(({ value, details }) => value || isAnswerDetailsValid(details))

export const selectCompletedSections = createSelector(
  selectQuestionsBySection,
  selectAnswersBySection,
  (questions, answers): Record<QuestionSection, boolean> => ({
    interior: sectionIsCompleted(questions.interior, answers.interior),
    exterior: sectionIsCompleted(questions.exterior, answers.exterior),
    driver: sectionIsCompleted(questions.driver, answers.driver),
  }),
)

export const selectOdoReadingIsCompleted = ({ answers }: State): boolean =>
  answers.odoReading !== null

export const selectAllSectionsAreCompleted = (state: State): boolean =>
  Object.values(selectCompletedSections(state)).every(Boolean) &&
  selectOdoReadingIsCompleted(state)

export const selectHasBlockingFault = ({ answers }: State): boolean =>
  answers.items.some(({ isBlocking, value }) => isBlocking && value === false)
