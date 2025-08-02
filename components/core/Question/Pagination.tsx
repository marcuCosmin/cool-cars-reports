import { router, type RelativePathString } from "expo-router"
import { ScrollView, StyleSheet } from "react-native"

import { type QuestionDoc } from "@/firebase/utils"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"
import { useEffect, useRef } from "react"

const getStlyes = (theme: Theme) =>
  ({
    view: {
      flex: 0,
      marginTop: "auto",
    },
    scrollContentView: {
      gap: theme.gap,
    },
    button: {
      borderRadius: theme.borderRadius,
      borderWidth: theme.borderWidth,
      borderColor: theme.colors.primary,
      backgroundColor: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: 50,
      height: 50,
    },
    activeButton: {
      backgroundColor: theme.colors.primary,
    },
    typography: {
      color: theme.colors.primary,
    },
    activeTypography: {
      color: theme.colors.white,
    },
  } as const)

type PaginationItem = {
  isActive: boolean
  isDisabled: boolean
}

type PaginationProps = {
  questionIndex: number
  sectionKey: keyof QuestionDoc
  items: PaginationItem[]
}

export const Pagination = ({
  sectionKey,
  items,
  questionIndex,
}: PaginationProps) => {
  const styles = useStyles(getStlyes)
  const listRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (!listRef.current) {
      return
    }

    const itemSize = 50 + styles.scrollContentView.gap

    listRef.current.scrollTo({
      x: questionIndex * itemSize,
      animated: false,
    })
  }, [sectionKey, questionIndex])

  return (
    <View style={styles.view}>
      <ScrollView
        horizontal
        ref={listRef}
        contentContainerStyle={styles.scrollContentView}
      >
        {items.map(({ isActive, isDisabled }, index) => {
          const mergedButtonStyles = StyleSheet.flatten([
            styles.button,
            isActive && styles.activeButton,
          ])
          const mergedTypographyStyles = StyleSheet.flatten([
            styles.typography,
            isActive && styles.activeTypography,
          ])

          const displayedIndex = index + 1

          const onClick = () =>
            router.push(
              `/reports/check/${sectionKey}/${index}` as RelativePathString
            )

          return (
            <Button
              style={mergedButtonStyles}
              key={index}
              onClick={onClick}
              disabled={isDisabled}
            >
              <Typography style={mergedTypographyStyles}>
                {displayedIndex}
              </Typography>
            </Button>
          )
        })}
      </ScrollView>
    </View>
  )
}
