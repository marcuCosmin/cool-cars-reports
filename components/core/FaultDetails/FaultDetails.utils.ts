import { DETAILS_MAX_LENGTH, DETAILS_MIN_LENGTH } from "./FaultDetails.const"

export const isAnswerDetailsValid = (details?: string): boolean =>
  !!details &&
  details.length >= DETAILS_MIN_LENGTH &&
  details.length <= DETAILS_MAX_LENGTH
