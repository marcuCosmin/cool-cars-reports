import { type CheckAnswer } from "@/firebase/utils"

import type { AnswerWithFault, CheckViewFaults } from "./CheckView.model"

type MapAnswersToFaultsProps = {
  answers: CheckAnswer[]
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
