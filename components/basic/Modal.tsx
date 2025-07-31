import { type PropsWithChildren } from "react"
import ReactModal from "react-native-modal"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { View } from "./View"

const getStyles = (theme: Theme) => ({
  view: {
    borderColor: theme.colors.primary,
    borderWidth: theme.borderWidth,
    borderRadius: theme.borderRadius,
    flex: 0,
    padding: 20,
  },
})

type ModalProps = PropsWithChildren<{
  isOpen: boolean
  onClose: () => void
}>

export const Modal = ({ children, isOpen, onClose }: ModalProps) => {
  const styles = useStyles(getStyles)

  return (
    <ReactModal isVisible={isOpen} onBackdropPress={onClose}>
      <View style={styles.view}>{children}</View>
    </ReactModal>
  )
}
