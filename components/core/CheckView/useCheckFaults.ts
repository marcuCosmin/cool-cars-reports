import { useEffect, useState } from "react"

import { FaultDoc, getCheckFaults } from "@/firebase/utils"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"

import type { CheckViewFaults } from "./CheckView.model"

type UseCheckFaultsProps = {
  carId: string
  checkId: string
}

export const useCheckFaults = ({ carId, checkId }: UseCheckFaultsProps) => {
  const [faultsData, setFaultsData] = useState<FaultDoc[]>([])
  const faults = faultsData.reduce((acc, fault) => {
    const { description, ...remainingFaultProps } = fault

    acc[description] = remainingFaultProps

    return acc
  }, {} as CheckViewFaults)
  const { isLoading, handleAsyncRequest: handleGetCheckFaults } =
    useAsyncRequestHandler({
      request: getCheckFaults,
    })

  useEffect(() => {
    const initFaults = async () => {
      const faultsData = await handleGetCheckFaults(checkId)

      if (!faultsData) {
        return
      }

      setFaultsData(faultsData)
    }

    initFaults()
  }, [carId, checkId, handleGetCheckFaults])

  return {
    faults,
    isLoading,
  }
}
