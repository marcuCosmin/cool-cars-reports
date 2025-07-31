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
    button: {
      borderRadius: theme.borderRadius,
      borderWidth: theme.borderWidth,
      borderColor: theme.colors.primary,
      backgroundColor: "transparent",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      margin: 5,
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

type PaginationProps = {
  questionIndex: number
  sectionKey: keyof QuestionDoc
  sectionLength: number
}

export const Pagination = ({
  sectionKey,
  sectionLength,
  questionIndex,
}: PaginationProps) => {
  const styles = useStyles(getStlyes)
  const listRef = useRef<ScrollView>(null)

  useEffect(() => {
    if (!listRef.current) {
      return
    }

    listRef.current.scrollTo({
      x: questionIndex * 50,
      animated: false,
    })
  }, [sectionKey, questionIndex])

  return (
    <View style={styles.view}>
      <ScrollView horizontal ref={listRef}>
        {[...Array(sectionLength).keys()].map((index) => {
          const isActive = index === questionIndex

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
            <Button style={mergedButtonStyles} key={index} onClick={onClick}>
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
