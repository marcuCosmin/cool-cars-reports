import { router } from "expo-router"

import { useEffect } from "react"

import { resetAnswers } from "@/redux/answersSlice"
import { fetchCars, setSelectedCar } from "@/redux/carsSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"

import { Button } from "@/components/basic/Button"
import { Select } from "@/components/basic/Select"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = () =>
  ({
    button: {
      marginTop: "auto",
    },
  } as const)

export default function Index() {
  const carsError = useAppSelector(({ cars }) => cars.error)
  const selectedCar = useAppSelector((state) => state.cars.selectedCar)
  const carsList = useAppSelector((state) => state.cars.carsList)
  const selectOptions = carsList.map((car) => ({ value: car.id }))

  const dispatch = useAppDispatch()

  const styles = useStyles(getStyles)

  useEffect(() => {
    dispatch(fetchCars())
  }, [])

  const onButtonClick = () => router.push("/reports")

  const onSelectChange = (value: string) => {
    dispatch(setSelectedCar(value))
    dispatch(resetAnswers())
  }

  return (
    <View>
      <Typography type="heading">Cool Cars South Coast</Typography>

      {carsError ? (
        <Typography>{carsError}</Typography>
      ) : (
        <Select
          label="Select a vehicle"
          showSearch
          options={selectOptions}
          value={selectedCar.id}
          onChange={onSelectChange}
        />
      )}

      {selectedCar.id && (
        <Button style={styles.button} onClick={onButtonClick}>
          <Typography type="button">Proceed</Typography>
        </Button>
      )}
    </View>
  )
}
