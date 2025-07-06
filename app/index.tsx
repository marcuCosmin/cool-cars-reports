import { router } from "expo-router"
import { useEffect, useState } from "react"

import { firestore } from "@/firebase/config"
import { collection, getDocs } from "firebase/firestore"

import { resetAnswers } from "@/redux/answersSlice"
import { useAppSelector } from "@/redux/config"
import { setSelectedCar } from "@/redux/selectedCarSlice"
import { useDispatch } from "react-redux"

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
  const { selectedCar } = useAppSelector((state) => state.selectedCar)
  const dispatch = useDispatch()

  const [selectOptions, setSelectOptions] = useState<string[]>([])

  const styles = useStyles(getStyles)

  useEffect(() => {
    ;(async () => {
      const carsSnapshot = await getDocs(collection(firestore, "cars"))

      const carsIds = carsSnapshot.docs.map((doc) => doc.id)

      setSelectOptions(carsIds)
    })()
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
        value={selectedCar}
        onChange={onSelectChange}
      />

      {selectedCar && (
        <Button style={styles.button} onClick={onButtonClick}>
          <Typography type="button">Proceed</Typography>
        </Button>
      )}
    </View>
  )
}
