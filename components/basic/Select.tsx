import { useCallback } from "react"
import { Dropdown } from "react-native-element-dropdown"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Typography } from "./Typography"

const getStyles = (theme: Theme) =>
  ({
    style: {
      borderRadius: theme.borderRadius,
      borderColor: theme.colors.primary,
      borderWidth: theme.borderWidth,
      padding: theme.inputPadding,
      height: theme.inputHeight,
    },
    selectedTextStyle: {
      color: theme.colors.text,
      fontSize: theme.fontSize.medium,
      textAlign: "center",
    },
    containerStyle: {
      backgroundColor: theme.colors.background,
      borderColor: theme.colors.primary,
      borderWidth: theme.borderWidth,
      borderRadius: theme.borderRadius,
      padding: theme.inputPadding,
    },
    iconStyle: {
      tintColor: theme.colors.text,
    },
    inputSearchStyle: {
      borderRadius: theme.borderRadius,
      color: theme.colors.text,
      borderColor: theme.colors.primary,
    },
    itemTextStyle: {
      color: theme.colors.text,
      fontSize: theme.fontSize.medium,
      padding: theme.inputPadding,
      textAlign: "center",
      border: 0,
    },
  } as const)

type SelectProps = {
  label?: string
  options: string[]
  value?: string
  onChange: (value: string) => void
}

export const Select = ({ label, options, value, onChange }: SelectProps) => {
  const theme = useTheme()
  const { itemTextStyle, ...styles } = useStyles(getStyles)

  const parsedOptions = options.map((option) => ({ value: option }))
  const parsedValue = value ? { value } : undefined
  const parsedOnChange = ({ value }: { value: string }) => onChange(value)

  const search = options.length > 10

  const renderItem = useCallback(
    (item: { value: string }, selected?: boolean) => {
      const style = {
        ...itemTextStyle,
        backgroundColor: selected ? theme.colors.primary : undefined,
        color: selected ? theme.colors.white : itemTextStyle.color,
      }

      return <Typography style={style}>{item.value}</Typography>
    },
    [theme]
  )

  return (
    <>
      {label && <Typography type="label">{label}</Typography>}
      <Dropdown
        {...styles}
        labelField="value"
        valueField="value"
        searchField="value"
        searchPlaceholder="Search"
        activeColor={`${theme.colors.primary}50`}
        search={search}
        data={parsedOptions}
        value={parsedValue}
        onChange={parsedOnChange}
        autoScroll={false}
        renderItem={renderItem}
      />
    </>
  )
}
