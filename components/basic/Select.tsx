import { useCallback } from "react"
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native"
import { Dropdown } from "react-native-element-dropdown"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Typography } from "./Typography"
import { View } from "./View"

const getStyles = (theme: Theme) =>
  ({
    containerView: {
      flex: 0,
    },
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

export type SelectOption = {
  value: string
  label?: string
}

type SelectProps = {
  style?: StyleProp<ViewStyle>
  options: SelectOption[]
  showSearch?: boolean
  label?: string
  value?: string
  onChange: (value: string) => void
}

export const Select = ({
  label,
  options,
  showSearch,
  value,
  onChange,
  style,
}: SelectProps) => {
  const theme = useTheme()
  const { itemTextStyle, ...styles } = useStyles(getStyles)

  const parsedOptions = options.map(({ value, label }) => ({
    value,
    label: label ?? value,
  }))

  const containerStyles = StyleSheet.flatten<ViewStyle>([
    styles.containerView,
    style,
  ])

  const valueOption = parsedOptions.find((option) => option.value === value)

  const renderItem = useCallback(
    (option: SelectOption, selected?: boolean) => {
      const style = {
        ...itemTextStyle,
        backgroundColor: selected ? theme.colors.primary : undefined,
        color: selected ? theme.colors.white : itemTextStyle.color,
      }

      const label = option.label ?? option.value

      return <Typography style={style}>{label}</Typography>
    },
    [theme]
  )

  const handleChange = ({ value }: SelectOption) => onChange(value)

  return (
    <View style={containerStyles}>
      {label && <Typography type="label">{label}</Typography>}
      <Dropdown
        {...styles}
        labelField="label"
        valueField="label"
        searchField="label"
        searchPlaceholder="Search"
        activeColor={`${theme.colors.primary}50`}
        search={showSearch}
        data={parsedOptions}
        value={valueOption}
        onChange={handleChange}
        autoScroll={false}
        renderItem={renderItem}
      />
    </View>
  )
}
