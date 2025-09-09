import { useState, type ActionDispatch } from "react"

import { type NotificationsFilters as NotificationsFiltersType } from "@/firebase/utils"

import { useAppSelector } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Collapsible } from "@/components/basic/Collapsible"
import { DatePicker } from "@/components/basic/DatePicker/DatePicker"
import { Select } from "@/components/basic/Select"
import { Tab } from "@/components/basic/Tab/Tab"
import { View } from "@/components/basic/View"

import {
  get1MonthTimestamps,
  get1WeekTimestamps,
  get2WeeksTimestamps,
  getCarsSelectOptions,
} from "./NotificationsList.utils"

import type { FiltersAction } from "./NotificationsList.model"

const getStyles = (theme: Theme) =>
  ({
    view: {
      gap: theme.gap,
      flex: 0,
      flexDirection: "row",
      alignItems: "center",
    },
    collapsible: {
      marginBottom: 20,
    },
    collapsibleContentView: {
      gap: theme.gap,
      flex: 0,
    },
    dateRangeView: {
      gap: theme.gap,
      flex: 0,
      flexDirection: "row",
    },
  } as const)

type NotificationsFiltersProps = {
  filters: NotificationsFiltersType
  dispatchFilters: ActionDispatch<FiltersAction>
}

export const NotificationsFilters = ({
  filters,
  dispatchFilters,
}: NotificationsFiltersProps) => {
  const [selectedDateTab, setSelectedDateTab] = useState("all-time")
  const carsList = useAppSelector(({ cars }) => cars.carsList)
  const carsSelectOptions = getCarsSelectOptions(carsList)

  const styles = useStyles(getStyles)

  const timestamps = {
    "all-time": { startTimestamp: null, endTimestamp: null },
    "1-week": get1WeekTimestamps(),
    "2-weeks": get2WeeksTimestamps(),
    "1-month": get1MonthTimestamps(),
  }

  const onTypeChange = (value: string) => {
    dispatchFilters({ type: "SET_TYPE", payload: value })
  }

  const onDateTabChange = (value: string) => {
    const { startTimestamp, endTimestamp } =
      timestamps[value as keyof typeof timestamps]

    setSelectedDateTab(value)

    dispatchFilters({
      type: "SET_START_DATE",
      payload: startTimestamp,
    })
    dispatchFilters({
      type: "SET_END_DATE",
      payload: endTimestamp,
    })
  }

  const onStartDateChange = (date: number) =>
    dispatchFilters({ type: "SET_START_DATE", payload: date })
  const onEndDateChange = (date: number) =>
    dispatchFilters({ type: "SET_END_DATE", payload: date })
  const onCarIdChange = (carId: string) =>
    dispatchFilters({ type: "SET_CAR_ID", payload: carId })

  return (
    <View style={styles.view}>
      <Collapsible title="Filters" icon="filter" style={styles.collapsible}>
        <View style={styles.collapsibleContentView}>
          <Select
            showSearch
            options={carsSelectOptions}
            value={filters.carId}
            onChange={onCarIdChange}
          />
          <Tab
            options={[
              { value: "all", label: "All" },
              { value: "check", label: "Checks" },
              { value: "fault", label: "Faults" },
              { value: "incident", label: "Incidents" },
            ]}
            value={filters.type}
            onChange={onTypeChange}
          />

          <Tab
            options={[
              { value: "all-time", label: "All" },
              { value: "1-week", label: "1 week" },
              { value: "2-weeks", label: "2 weeks" },
              { value: "1-month", label: "1 month" },
            ]}
            value={selectedDateTab}
            onChange={onDateTabChange}
          />

          <View style={styles.dateRangeView}>
            <DatePicker
              label="From"
              value={filters.startDate}
              onChange={onStartDateChange}
            />
            <DatePicker
              label="To"
              value={filters.endDate}
              onChange={onEndDateChange}
            />
          </View>
        </View>
      </Collapsible>
    </View>
  )
}
