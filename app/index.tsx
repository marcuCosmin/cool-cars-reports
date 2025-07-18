import { router } from "expo-router"

import { useEffect } from "react"

import { resetAnswers } from "@/redux/answersSlice"
import { fetchCars, setSelectedCar } from "@/redux/carsSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"

import { Button } from "@/components/basic/Button"
import { Select } from "@/components/basic/Select"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { useStyles } from "@/hooks/useStyles"

const getStyles = () =>
  ({
    button: {
      marginTop: "auto",
    },
  } as const)

export default function Index() {
  const { selectedCar, carsList } = useAppSelector((state) => state.cars)
  const dispatch = useAppDispatch()

  const selectOptions = carsList.map((car) => car.id)

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
      <Select
        label="Select a vehicle"
        options={selectOptions}
        value={selectedCar.id}
        onChange={onSelectChange}
      />

      {selectedCar.id && (
        <Button style={styles.button} onClick={onButtonClick}>
          <Typography type="button">Proceed</Typography>
        </Button>
      )}
    </View>
  )
}
