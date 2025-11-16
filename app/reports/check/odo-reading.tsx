import { MaterialCommunityIcons } from "@expo/vector-icons"
import { router } from "expo-router"

import { useEffect, useState } from "react"

import { getHighestOdoReading } from "@/firebase/utils"

import { setOdoReading, type OdoReadingUnit } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"
import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Input } from "@/components/basic/Input"
import { LoadingView } from "@/components/basic/LoadingView/LoadingView"
import { Modal } from "@/components/basic/Modal"
import { Tab } from "@/components/basic/Tab/Tab"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = (theme: Theme) =>
  ({
    button: {
      marginTop: "auto",
    },
    tab: {
      marginTop: 20,
    },
    modalContentView: {
      gap: 20,
      flex: 0,
    },
    modalButtonsContainer: {
      flex: 0,
      flexDirection: "row",
      justifyContent: "space-around",
    },
    modalButtons: {
      borderColor: theme.colors.primary,
      borderRadius: 100,
      borderWidth: 1,
      backgroundColor: "transparent",
    },
  } as const)

const tabOptions = [
  {
    value: "miles",
    label: "Miles",
  },
  {
    value: "km",
    label: "Kilometers",
  },
]

export default function OdoReading() {
  const answer = useAppSelector((state) => state.answers.odoReading)
  const selectedCarId = useAppSelector(({ cars }) => cars.selectedCar.id)
  const [unit, setUnit] = useState<OdoReadingUnit>(answer?.unit || "km")
  const [value, setValue] = useState<string>(answer?.value || "")
  const dispatch = useAppDispatch()
  const styles = useStyles(getStyles)
  const theme = useTheme()
  const {
    isLoading: isLoadingHighestOdoReading,
    handleAsyncRequest: handleHighestOdoReadingFetch,
  } = useAsyncRequestHandler({
    request: getHighestOdoReading,
  })
  const [highestOdoReading, setHighestOdoReading] = useState<number>(0)
  const isOdoLowerThanPrevious = Number(value) <= highestOdoReading

  const [isModalOpen, setIsModalOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      const highestOdoReading = await handleHighestOdoReadingFetch(
        selectedCarId
      )

      setHighestOdoReading(highestOdoReading || 0)
    })()
  }, [selectedCarId])

  const onModalClose = () => setIsModalOpen(false)

  const onTabChange = (value: string) => setUnit(value as OdoReadingUnit)

  const onConfirm = () => {
    if (value !== answer?.value || unit !== answer?.unit) {
      dispatch(setOdoReading({ value, unit }))
    }

    onModalClose()
    router.push("/reports/check")
  }

  const onConfirmButtonClick = () => {
    if (isOdoLowerThanPrevious) {
      setIsModalOpen(true)
      return
    }

    onConfirm()
  }

  if (isLoadingHighestOdoReading) {
    return <LoadingView />
  }

  return (
    <>
      <Modal isOpen={isModalOpen} onClose={onModalClose}>
        <View style={styles.modalContentView}>
          <Typography>
            The current ODO reading is {value}, which is lower than the previous
            reading of {highestOdoReading}.
          </Typography>
          <Typography>
            Are you sure you want to submit your check with this value?
          </Typography>

          <View style={styles.modalButtonsContainer}>
            <Button style={styles.modalButtons} onClick={onConfirm}>
              <MaterialCommunityIcons
                color={theme.colors.primary}
                name="check"
                size={35}
              />
            </Button>
            <Button style={styles.modalButtons} onClick={onModalClose}>
              <MaterialCommunityIcons
                color={theme.colors.primary}
                name="close"
                size={35}
              />
            </Button>
          </View>
        </View>
      </Modal>

      <View>
        <Typography type="heading">ODO Reading</Typography>
        <Typography type="label">Vehicle mileage</Typography>
        <Input type="number" value={value} onChange={setValue} />
        <Tab
          style={styles.tab}
          options={tabOptions}
          value={unit}
          onChange={onTabChange}
        />
        {value && (
          <Button style={styles.button} onClick={onConfirmButtonClick}>
            <Typography type="button">Confirm</Typography>
          </Button>
        )}
      </View>
    </>
  )
}
