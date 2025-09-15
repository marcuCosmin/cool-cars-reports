import { useState } from "react"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

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

const getStyles = (theme: Theme) =>
  ({
    containerView: {
      flex: 0,
      gap: theme.gap,
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
    const date = new Date(selectedYear, selectedMonth, selectedDay)
    const timestamp = date.getTime()

    onChange(timestamp)
    onModalClose()
  }

  return (
    <Modal isOpen={isModalOpen} onClose={onModalClose}>
      <View style={styles.containerView}>
        <Select
          label="Day"
          options={daysOptions}
          value={String(selectedDay)}
          onChange={onDayChange}
        />
        <Select
          label="Month"
          options={monthOptions}
          value={String(selectedMonth)}
          onChange={onMonthChange}
        />
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
