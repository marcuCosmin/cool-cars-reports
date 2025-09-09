import { DatePickerProps } from "./DatePicker.model"

export const getYearsOptions = () => {
  const releaseYear = 2025
  const currentYear = new Date().getFullYear()

  const yearsOptions = []

  for (let year = currentYear; year >= releaseYear; year--) {
    const stringifiedYear = String(year)

    yearsOptions.push({
      value: stringifiedYear,
      label: stringifiedYear,
    })
  }

  return yearsOptions
}

type GetDaysOptions = {
  year: number
  month: number
}

export const getDaysOptions = ({ year, month }: GetDaysOptions) => {
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  const daysOptions = [...Array(daysInMonth).keys()].map((day) => {
    const stringifiedDay = String(day + 1)

    return {
      value: stringifiedDay,
      label: stringifiedDay,
    }
  })

  return daysOptions
}

export const getInitialState = (value: DatePickerProps["value"]) => {
  const date = value ? new Date(value) : new Date()

  const currentDay = date.getDate()
  const currentMonth = date.getMonth()
  const currentYear = date.getFullYear()

  return {
    currentDay,
    currentMonth,
    currentYear,
  }
}
