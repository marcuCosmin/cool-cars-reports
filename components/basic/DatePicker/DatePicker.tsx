import { useState } from "react"

import { useStyles } from "@/hooks/useStyles"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { parseTimestampForDisplay } from "@/utils/parseTimestampForDisplay"

import { DatePickerModal } from "./DatePickerModal"

import type { DatePickerProps } from "./DatePicker.model"

const getStyles = () =>
  ({
    containerView: {
      flex: 1,
      gap: 10,
    },
    modalButton: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "center",
      alignSelf: "flex-start",
      width: "100%",
    },
  } as const)

export const DatePicker = ({ label, value, onChange }: DatePickerProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const styles = useStyles(getStyles)

  const date = value
    ? parseTimestampForDisplay({ timestamp: value, showTime: false })
    : "N/A"

  const openModal = () => setIsModalOpen(true)
  const onModalClose = () => setIsModalOpen(false)

  return (
    <View style={styles.containerView}>
      <Button style={styles.modalButton} onClick={openModal}>
        <Typography type="button">{label}: </Typography>
        <Typography type="button">{date}</Typography>
      </Button>

      <DatePickerModal
        isModalOpen={isModalOpen}
        onModalClose={onModalClose}
        value={value}
        onChange={onChange}
      />
    </View>
  )
}
