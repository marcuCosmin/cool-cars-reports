import { useState } from "react"

import { Timestamp } from "firebase/firestore"

import { useStyles } from "@/hooks/useStyles"

import { Button } from "@/components/basic/Button"
import { Modal } from "@/components/basic/Modal"
import { Select } from "@/components/basic/Select"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { monthOptions } from "./DatePicker.const"
import {
  getDaysOptions,
  getInitialState,
  getYearsOptions,
} from "./DatePicker.utils"

import type { DatePickerProps } from "./DatePicker.model"

const getStyles = () =>
  ({
    dayMonthView: {
      flex: 0,
      flexDirection: "row",
      gap: 10,
    },
    yearView: {
      flex: 0,
      marginTop: 10,
    },
    inlineSelect: {
      flex: 1,
    },
    confirmButton: {
      marginTop: 20,
    },
  } as const)

type AdaptSelectedDayBasedOnMonth = {
  month?: number
  year?: number
}

type DatePickerModalProps = Pick<DatePickerProps, "value" | "onChange"> & {
  isModalOpen: boolean
  onModalClose: () => void
}

export const DatePickerModal = ({
  isModalOpen,
  onModalClose,
  value,
  onChange,
}: DatePickerModalProps) => {
  const { currentDay, currentMonth, currentYear } = getInitialState(value)
  const [selectedDay, setSelectedDay] = useState<number>(currentDay)
  const [selectedMonth, setSelectedMonth] = useState<number>(currentMonth)
  const [selectedYear, setSelectedYear] = useState<number>(currentYear)

  const daysOptions = getDaysOptions({
    year: selectedYear,
    month: selectedMonth,
  })
  const yearsOptions = getYearsOptions()

  const styles = useStyles(getStyles)

  const onDayChange = (value: string) => setSelectedDay(Number(value))

  const adaptSelectedDayBasedOnMonth = ({
    year = selectedYear,
    month = selectedMonth,
  }: AdaptSelectedDayBasedOnMonth) => {
    const daysOptions = getDaysOptions({ year, month })

    if (selectedDay > daysOptions.length) {
      setSelectedDay(daysOptions.length)
    }
  }

  const onMonthChange = (value: string) => {
    const month = Number(value)
    setSelectedMonth(month)
    adaptSelectedDayBasedOnMonth({ month })
  }

  const onYearChange = (value: string) => {
    const year = Number(value)
    setSelectedYear(year)
    adaptSelectedDayBasedOnMonth({ year })
  }

  const onConfirmClick = () => {
    const timestamp = Timestamp.fromDate(
      new Date(selectedYear, selectedMonth, selectedDay)
    )
    onChange(timestamp)
    onModalClose()
  }

  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose}>
      <View style={styles.dayMonthView}>
        <Select
          label="Day"
          style={styles.inlineSelect}
          options={daysOptions}
          value={String(selectedDay)}
          onChange={onDayChange}
        />
        <Select
          style={styles.inlineSelect}
          label="Month"
          options={monthOptions}
          value={String(selectedMonth)}
          onChange={onMonthChange}
        />
      </View>
      <View style={styles.yearView}>
        <Select
          label="Year"
          options={yearsOptions}
          value={String(selectedYear)}
          onChange={onYearChange}
        />
      </View>

      <Button style={styles.confirmButton} onClick={onConfirmClick}>
        <Typography type="button">Confirm</Typography>
      </Button>
    </Modal>
  )
}
