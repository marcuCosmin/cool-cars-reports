import { router } from "expo-router"
import { useState } from "react"

import { setOdoReading, type OdoReadingUnit } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Input } from "@/components/basic/Input"
import { Tab } from "@/components/basic/Tab"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = (theme: Theme) =>
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
  const answers = useAppSelector((state) => state.answers)
  const [unit, setUnit] = useState<OdoReadingUnit>(
    answers?.odoReading?.unit || "km"
  )
  const [value, setValue] = useState<string>(answers?.odoReading?.value || "")
  const dispatch = useAppDispatch()
  const styles = useStyles(getStyles)

  const onTabChange = (value: string) => setUnit(value as OdoReadingUnit)

  const onConfirmClick = () => {
    if (
      value !== answers?.odoReading?.value ||
      unit !== answers?.odoReading?.unit
    ) {
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
