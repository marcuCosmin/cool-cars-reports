import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { View } from "@/components/basic/View"

import { Button } from "./Button"

const getStyles = (theme: Theme) =>
  ({
    view: {
      borderWidth: theme.borderWidth,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius,
      height: theme.inputHeight,
      flex: 0,
      flexShrink: 1,
      display: "flex",
      alignSelf: "center",
      alignItems: "center",
      flexDirection: "row",
    },
  } as const)

type Option = {
  value: string
  label: string
}

type TabProps = {
  options: Option[]
  value: string
  onChange: (value: string) => void
}

export const Tab = ({ options, value, onChange }: TabProps) => {
  const styles = useStyles(getStyles)

  return (
    <View style={styles.view}>
      {options.map((option, index) => {
        const isActive = option.value === value
        const onClick = () => onChange(option.value)

        return (
          <Button
            key={index}
            label={option.label}
            isActive={isActive}
            onClick={onClick}
          />
        )
      })}
    </View>
  )
}
