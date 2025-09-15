import {
  ScrollView,
  StyleSheet,
  type StyleProp,
  type ViewStyle,
} from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { TabButton } from "./TabButton"

import { getTabButtonPosition } from "./Tab.utils"

const getStyles = (theme: Theme) =>
  ({
    scrollView: {
      flexGrow: 0,
    },
    innerView: {
      borderWidth: theme.borderWidth,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius + theme.borderWidth * 2,
      flex: 0,
      display: "flex",
      margin: "auto",
      flexDirection: "row",
    },
  } as const)

type Option = {
  value: string
  label: string
}

type TabProps = {
  style?: StyleProp<ViewStyle>
  options: Option[]
  value?: string
  onChange: (value: string) => void
}

export const Tab = ({ style, options, value, onChange }: TabProps) => {
  const styles = useStyles(getStyles)

  const mergedStyles = StyleSheet.flatten([styles.innerView, style])

  return (
    <ScrollView
      horizontal
      style={styles.scrollView}
      contentContainerStyle={mergedStyles}
    >
      {options.map((option, index) => {
        const isActive = option.value === value
        const onClick = () => onChange(option.value)

        const position = getTabButtonPosition({
          index,
          optionsLength: options.length,
        })

        return (
          <TabButton
            key={index}
            position={position}
            label={option.label}
            isActive={isActive}
            onClick={onClick}
          />
        )
      })}
    </ScrollView>
  )
}
