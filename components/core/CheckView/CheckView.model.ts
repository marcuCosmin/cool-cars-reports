import { type FaultDoc } from "@/firebase/utils"

import { type Answer } from "@/redux/answersSlice"

export type CheckViewFaults = {
  [description: string]: Omit<FaultDoc, "description">
}

export type AnswerWithFault = Answer & {
  fault?: Pick<FaultDoc, "status">
}
