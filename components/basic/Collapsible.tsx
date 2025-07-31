import { MaterialCommunityIcons } from "@expo/vector-icons"
import React, { useState, type PropsWithChildren } from "react"
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native"

import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = (theme: Theme) =>
  ({
    containerView: {
      flex: 1,
    },
    titleButton: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
    titleChevronIcon: {
      marginLeft: "auto",
    },
    contentView: {
      borderWidth: theme.borderWidth,
      borderColor: theme.colors.primary,
      borderBottomLeftRadius: theme.borderRadius,
      borderBottomRightRadius: theme.borderRadius,
      padding: theme.inputPadding,
      flex: 0,
    },
  } as const)

type CollapsibleProps = PropsWithChildren<{
  style?: StyleProp<ViewStyle>
  title: string
  icon?: "filter"
}>

export const Collapsible = ({
  style,
  children,
  title,
  icon,
}: CollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const theme = useTheme()
  const styles = useStyles(getStyles)

  const containerViewStyles = StyleSheet.flatten([styles.containerView, style])
  const titleButtonStyles = StyleSheet.flatten([
    styles.titleButton,
    {
      borderBottomLeftRadius: isOpen ? 0 : theme.borderRadius,
      borderBottomRightRadius: isOpen ? 0 : theme.borderRadius,
    },
  ])

  const onToggle = () => setIsOpen(!isOpen)

  const indicatorIcon = isOpen ? "chevron-up" : "chevron-down"

  return (
    <View style={containerViewStyles}>
      <Button onClick={onToggle} style={titleButtonStyles}>
        {icon && (
          <MaterialCommunityIcons
            name={icon}
            size={24}
            color={theme.colors.white}
          />
        )}
        <Typography>{title}</Typography>
        <MaterialCommunityIcons
          style={styles.titleChevronIcon}
          name={indicatorIcon}
          size={24}
          color={theme.colors.white}
        />
      </Button>

      {isOpen && <View style={styles.contentView}>{children}</View>}
    </View>
  )
}
