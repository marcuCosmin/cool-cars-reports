import { type ActionDispatch } from "react"

import { type NotificationsFilters as NotificationsFiltersType } from "@/firebase/utils"
import { Timestamp } from "firebase/firestore"

import { useAppSelector } from "@/redux/config"

import { useStyles } from "@/hooks/useStyles"

import { Collapsible } from "@/components/basic/Collapsible"
import { DatePicker } from "@/components/basic/DatePicker/DatePicker"
import { Select } from "@/components/basic/Select"
import { Tab } from "@/components/basic/Tab/Tab"
import { View } from "@/components/basic/View"

import {
  get1MonthTimestamps,
  get1WeekTimestamps,
  get2WeeksTimestamps,
} from "./NotificationsList.utils"

import type { FiltersAction } from "./NotificationsList.model"

const getStyles = () =>
  ({
    view: {
      flex: 0,
      gap: 10,
      flexDirection: "row",
      alignItems: "center",
    },
    collapsible: {
      marginBottom: 20,
    },
    collapsibleContentView: {
      flex: 0,
      gap: 10,
    },
    dateRangeView: {
      flex: 0,
      flexDirection: "row",
      gap: 10,
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
  const carsSelectOptions = useAppSelector((state) =>
    state.cars.carsList.map(({ id }) => ({ value: id }))
  )
  const styles = useStyles(getStyles)

  const timestamps = {
    "all-time": { startTimestamp: null, endTimestamp: null },
    "1-week": get1WeekTimestamps(),
    "2-weeks": get2WeeksTimestamps(),
    "1-month": get1MonthTimestamps(),
  }

  const dateTabValue = Object.keys(timestamps).find((key) => {
    const value = timestamps[key as keyof typeof timestamps]

    if (!filters.startDate || !filters.endDate) {
      return (
        value.endTimestamp === filters.endDate &&
        value.startTimestamp === filters.startDate
      )
    }

    return (
      value.startTimestamp?.isEqual(filters.startDate) &&
      value.endTimestamp?.isEqual(filters.endDate)
    )
  })

  const onTypeChange = (value: string) => {
    dispatchFilters({ type: "SET_TYPE", payload: value })
  }

  const onDateTabChange = (value: string) => {
    const { startTimestamp, endTimestamp } =
      timestamps[value as keyof typeof timestamps]

    dispatchFilters({
      type: "SET_START_DATE",
      payload: startTimestamp,
    })
    dispatchFilters({
      type: "SET_END_DATE",
      payload: endTimestamp,
    })
  }

  const onStartDateChange = (date: Timestamp) =>
    dispatchFilters({ type: "SET_START_DATE", payload: date })
  const onEndDateChange = (date: Timestamp) =>
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
            value={dateTabValue}
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
