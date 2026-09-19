import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Modal } from "@/components/basic/Modal"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = (theme: Theme) =>
  ({
    containerView: {
      flex: 0,
      gap: theme.gap,
      marginBottom: 20,
    },
    messageTypography: {
      textAlign: "center",
    },
  }) as const

type BlockingFaultModalProps = {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export const BlockingFaultModal = ({
  isOpen,
  onClose,
  onConfirm,
}: BlockingFaultModalProps) => {
  const styles = useStyles(getStyles)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <View style={styles.containerView}>
        <Typography type="heading">Do not drive this vehicle</Typography>
        <Typography style={styles.messageTypography}>
          This check includes a fault that has been marked as blocking. The
          vehicle must not be driven until it has been inspected.
        </Typography>
      </View>

      <Button onClick={onConfirm}>
        <Typography type="button">Submit check</Typography>
      </Button>
    </Modal>
  )
}
