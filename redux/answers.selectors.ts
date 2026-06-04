import { isAnswerDetailsValid } from "@/components/core/FaultDetails/FaultDetails.utils"

import { type State } from "./config"

export const selectInteriorIsCompleted = ({ answers, questions }: State): boolean => {
  if (questions.interior.length !== answers.interior.length) return false

  return answers.interior.every(({ value, details }) => value || isAnswerDetailsValid(details))
}

export const selectExteriorIsCompleted = ({ answers, questions }: State): boolean => {
  if (questions.exterior.length !== answers.exterior.length) return false

  return answers.exterior.every(({ value, details }) => value || isAnswerDetailsValid(details))
}

export const selectOdoReadingIsCompleted = ({ answers }: State): boolean =>
  answers.odoReading !== null

export const selectAllSectionsAreCompleted = (state: State): boolean =>
  selectInteriorIsCompleted(state) &&
  selectExteriorIsCompleted(state) &&
  selectOdoReadingIsCompleted(state)
