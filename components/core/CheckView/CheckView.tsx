import { useMemo, useState } from "react"

import {
  QUESTION_SECTIONS,
  type CheckDoc,
  type QuestionSection,
} from "@/firebase/utils"

import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { LoadingView } from "@/components/basic/LoadingView/LoadingView"
import { Tab } from "@/components/basic/Tab/Tab"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { groupBySection } from "@/utils/groupBySection"
import { parseTimestampForDisplay } from "@/utils/parseTimestampForDisplay"

import { useCheckFaults } from "./useCheckFaults"

import { OdoReadingView } from "./OdoReadingView"
import { QuestionsView } from "./QuestionsView"

import { mapAnswersToFaults } from "./CheckView.utils"

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

const sectionLabels: Record<QuestionSection, string> = {
  interior: "Interior",
  exterior: "Exterior",
  driver: "Driver",
}

const tabOptions = [
  ...QUESTION_SECTIONS.map((section) => ({
    value: section,
    label: sectionLabels[section],
  })),
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
  answers,
}: CheckViewProps) => {
  const { faults, isLoading: isLoadingFaults } = useCheckFaults({
    carId,
    checkId,
  })

  const answersBySection = useMemo(
    () => groupBySection(mapAnswersToFaults({ faults, answers })),
    [answers, faults],
  )

  const [tabValue, setTabValue] = useState<string>("interior")
  const styles = useStyles(getStyles)

  const renderTabContent = () => {
    const section = QUESTION_SECTIONS.find((section) => section === tabValue)

    if (!section) {
      return <OdoReadingView odoReading={odoReading} />
    }

    return <QuestionsView answers={answersBySection[section]} />
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
