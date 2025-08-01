import { router } from "expo-router"
import { useState } from "react"

import { setOdoReading, type OdoReadingUnit } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"

import { Button } from "@/components/basic/Button"
import { Input } from "@/components/basic/Input"
import { Tab } from "@/components/basic/Tab/Tab"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = () =>
  ({
    button: {
      marginTop: "auto",
    },
    mileageLabel: {
      marginTop: 20,
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
  const answeredValue = useAppSelector(
    (state) => state.answers.odoReading?.value
  )
  const answeredUnit = useAppSelector((state) => state.answers.odoReading?.unit)
  const [unit, setUnit] = useState<OdoReadingUnit>(answeredUnit || "km")
  const [value, setValue] = useState<string>(answeredValue || "")
  const dispatch = useAppDispatch()
  const styles = useStyles(getStyles)

  const onTabChange = (value: string) => setUnit(value as OdoReadingUnit)

  const onConfirmClick = () => {
    if (value !== answeredValue || unit !== answeredUnit) {
      dispatch(setOdoReading({ value, unit }))
    }

    router.push("/reports/check")
  }

  return (
    <View>
      <Typography type="heading">ODO Reading</Typography>
      <Tab options={tabOptions} value={unit} onChange={onTabChange} />
      <Typography type="label" style={styles.mileageLabel}>
        Vehicle mileage
      </Typography>
      <Input type="number" value={value} onChange={setValue} />
      {value && (
        <Button style={styles.button} onClick={onConfirmClick}>
          <Typography type="button">Confirm</Typography>
        </Button>
      )}
    </View>
  )
}
