import { router } from "expo-router"
import { useState } from "react"

import {
  selectAllSectionsAreCompleted,
  selectHasBlockingFault,
} from "@/redux/answers.selectors"
import { submitAnswers } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"
import { setSubmittedCheckId } from "@/redux/submittedCheckSlice"

type UseCheckSubmissionProps = {
  hasMandatoryTimeElapsed: boolean
}

export const useCheckSubmission = ({
  hasMandatoryTimeElapsed,
}: UseCheckSubmissionProps) => {
  const dispatch = useAppDispatch()

  const allSectionsAreCompleted = useAppSelector(selectAllSectionsAreCompleted)
  const hasBlockingFault = useAppSelector(selectHasBlockingFault)

  const [isBlockingModalOpen, setIsBlockingModalOpen] = useState(false)

  const isSubmitDisabled = !allSectionsAreCompleted || !hasMandatoryTimeElapsed

  const submitCheck = async () => {
    const result = await dispatch(submitAnswers())

    if (result.meta.requestStatus === "rejected") {
      return
    }

    const checkId = result.payload as string

    dispatch(setSubmittedCheckId(checkId))

    router.dismissTo("/")
  }

  const onSubmitClick = () => {
    if (hasBlockingFault) {
      setIsBlockingModalOpen(true)
      return
    }

    submitCheck()
  }

  const onBlockingModalClose = () => setIsBlockingModalOpen(false)

  const onBlockingModalConfirm = () => {
    setIsBlockingModalOpen(false)
    submitCheck()
  }

  return {
    isSubmitDisabled,
    isBlockingModalOpen,
    onSubmitClick,
    onBlockingModalClose,
    onBlockingModalConfirm,
  }
}
