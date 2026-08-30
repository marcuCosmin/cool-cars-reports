import { type CheckAnswer, type FaultDoc } from "@/firebase/utils"

export type CheckViewFaults = {
  [description: string]: Omit<FaultDoc, "description">
}

export type AnswerWithFault = CheckAnswer & {
  fault?: Pick<FaultDoc, "status">
}
