import { type Answer } from "@/redux/answersSlice"

import type { AnswerWithFault, CheckViewFaults } from "./CheckView.model"

type MapAnswersToFaultsProps = {
  answers: Answer[]
  faults: CheckViewFaults
}

export const mapAnswersToFaults = ({
  answers,
  faults,
}: MapAnswersToFaultsProps): AnswerWithFault[] =>
  answers.map((answer) => {
    const { label } = answer

    const fault = faults[label]

    if (!fault) {
      return answer
    }

    return {
      ...answer,
      fault: {
        status: fault.status,
      },
    }
  })
