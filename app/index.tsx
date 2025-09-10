import { router } from "expo-router"

import AsyncStorage from "@react-native-async-storage/async-storage"
import { useEffect } from "react"

import { resetAnswers } from "@/redux/answersSlice"
import { fetchCars, setSelectedCar } from "@/redux/carsSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"
import { fetchCheckSubmittedToday } from "@/redux/submittedCheckSlice"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"
import { useStyles } from "@/hooks/useStyles"

import { Button } from "@/components/basic/Button"
import { ErrorView } from "@/components/basic/ErrorView"
import { LoadingView } from "@/components/basic/LoadingView/LoadingView"
import { Select } from "@/components/basic/Select"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = () =>
  ({
    footerView: {
      marginTop: "auto",
      flex: 0,
    },
    loadingView: {
      flex: 0,
    },
  } as const)

export default function Index() {
  const uid = useAppSelector(({ user }) => user.uid)
  const carsError = useAppSelector(({ cars }) => cars.error)
  const selectedCar = useAppSelector((state) => state.cars.selectedCar)
  const carsList = useAppSelector((state) => state.cars.carsList)
  const selectOptions = carsList.map((car) => ({ value: car.id }))
  const isCarsLoading = useAppSelector(({ cars }) => cars.isLoading)
  const isSubmittedCheckLoading = useAppSelector(
    ({ submittedCheck }) => submittedCheck.isLoading
  )
  const submittedCheckError = useAppSelector(
    ({ submittedCheck }) => submittedCheck.error
  )

  const styles = useStyles(getStyles)

  const { handleAsyncRequest: onSelectChange } = useAsyncRequestHandler({
    request: async (value: string) => {
      dispatch(setSelectedCar(value))
      dispatch(resetAnswers())

      await AsyncStorage.setItem("selectedCarId", value)
    },
  })
  const { handleAsyncRequest: loadStoredCarId } = useAsyncRequestHandler({
    request: async () => {
      const storedCarId = await AsyncStorage.getItem("selectedCarId")

      if (!storedCarId) {
        return
      }

      dispatch(setSelectedCar(storedCarId))
    },
  })

  const dispatch = useAppDispatch()

  useEffect(() => {
    ;(async () => {
      await dispatch(fetchCars())
      await loadStoredCarId()
    })()
  }, [])

  useEffect(() => {
    if (!selectedCar.id) {
      return
    }

    dispatch(fetchCheckSubmittedToday({ carId: selectedCar.id, uid }))
  }, [selectedCar.id])

  const onButtonClick = () => router.push("/reports")

  return (
    <View>
      <Typography type="heading">Cool Cars South Coast</Typography>

      {carsError || submittedCheckError ? (
        <ErrorView message={carsError || submittedCheckError} />
      ) : (
        <Select
          label="Select a vehicle"
          showSearch
          options={selectOptions}
          value={selectedCar.id}
          onChange={onSelectChange}
        />
      )}

      <View style={styles.footerView}>
        {isSubmittedCheckLoading || isCarsLoading ? (
          <LoadingView size="small" style={styles.loadingView} />
        ) : (
          selectedCar.id && (
            <Button onClick={onButtonClick}>
              <Typography type="button">Proceed</Typography>
            </Button>
          )
        )}
      </View>
    </View>
  )
}
