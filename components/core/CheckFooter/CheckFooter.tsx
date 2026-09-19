import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { BlockingFaultModal } from "./BlockingFaultModal"
import { useCheckSubmission } from "./useCheckSubmission"
import { useMandatoryCheckTimer } from "./useMandatoryCheckTimer"

const getStyles = (theme: Theme) =>
  ({
    view: {
      flex: 0,
    },
    timerView: {
      flex: 0,
      alignItems: "center",
      marginBottom: 10,
    },
    timerLabelTypography: {
      color: theme.colors.text,
    },
    timerValueTypography: {
      fontSize: theme.fontSize.large,
      color: theme.colors.primary,
      fontWeight: "bold",
    },
  }) as const

export const CheckFooter = () => {
  const styles = useStyles(getStyles)

  const { hasElapsed, showRemainingTime, formattedRemainingTime } =
    useMandatoryCheckTimer()

  const {
    isSubmitDisabled,
    isBlockingModalOpen,
    onSubmitClick,
    onBlockingModalClose,
    onBlockingModalConfirm,
  } = useCheckSubmission({ hasMandatoryTimeElapsed: hasElapsed })

  return (
    <View style={styles.view}>
      {showRemainingTime && (
        <View style={styles.timerView}>
          <Typography style={styles.timerLabelTypography}>
            Mandatory check time remaining
          </Typography>
          <Typography style={styles.timerValueTypography}>
            {formattedRemainingTime}
          </Typography>
        </View>
      )}
      <Button onClick={onSubmitClick} disabled={isSubmitDisabled}>
        <Typography type="button">Submit check</Typography>
      </Button>

      <BlockingFaultModal
        isOpen={isBlockingModalOpen}
        onClose={onBlockingModalClose}
        onConfirm={onBlockingModalConfirm}
      />
    </View>
  )
}
