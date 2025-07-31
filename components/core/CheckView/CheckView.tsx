import { useState } from "react"

import { type CheckDoc } from "@/firebase/utils"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { LoadingView } from "@/components/basic/LoadingView"
import { Tab } from "@/components/basic/Tab/Tab"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { parseTimestampForDisplay } from "@/utils/parseTimestampForDisplay"

import { mapAnswersToFaults } from "./mapAnswersToFaults"

import { OdoReadingView } from "./OdoReadingView"
import { QuestionsView } from "./QuestionsView"
import { useCheckFaults } from "./useCheckFaults"

const getStyles = (theme: Theme) =>
  ({
    mainView: {
      gap: theme.gap,
      alignItems: "center",
    },
    headingTypography: {
      marginBottom: 0,
    },
    timestampTypography: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.small,
      fontWeight: "bold",
    },
  } as const)

const tabOptions = [
  {
    value: "interior",
    label: "Interior",
  },
  {
    value: "exterior",
    label: "Exterior",
  },
  {
    value: "odoReading",
    label: "Odo Reading",
  },
]

type CheckViewProps = CheckDoc & {
  checkId: string
  carId: string
}

export const CheckView = ({
  creationTimestamp,
  checkId,
  carId,
  odoReading,
  interior,
  exterior,
}: CheckViewProps) => {
  const { faults, isLoading: isLoadingFaults } = useCheckFaults({
    carId,
    checkId,
  })

  const mappedInterior = mapAnswersToFaults({
    faults,
    answers: interior,
  })
  const mappedExterior = mapAnswersToFaults({
    faults,
    answers: exterior,
  })

  const [tabValue, setTabValue] = useState("interior")
  const styles = useStyles(getStyles)

  const renderTabContent = () => {
    switch (tabValue) {
      case "interior":
        return <QuestionsView answers={mappedInterior} />
      case "exterior":
        return <QuestionsView answers={mappedExterior} />
      case "odoReading":
        return <OdoReadingView odoReading={odoReading} />
    }
  }

  const parsedTimestamp = parseTimestampForDisplay({
    timestamp: creationTimestamp,
  })

  if (isLoadingFaults) {
    return <LoadingView text="Loading check details..." />
  }

  return (
    <View style={styles.mainView}>
      <Typography type="heading" style={styles.headingTypography}>
        Check Details
      </Typography>
      <Typography style={styles.timestampTypography}>
        {parsedTimestamp}
      </Typography>
      <Tab options={tabOptions} value={tabValue} onChange={setTabValue} />

      {renderTabContent()}
    </View>
  )
}
