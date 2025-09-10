import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native"

import { getIncident, type IncidentDoc } from "@/firebase/utils"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"
import { useStyles } from "@/hooks/useStyles"
import { type Theme } from "@/hooks/useTheme"

import { ErrorView } from "@/components/basic/ErrorView"
import { IssuesStatus } from "@/components/basic/IssuesStatus"
import { LoadingView } from "@/components/basic/LoadingView/LoadingView"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { parseTimestampForDisplay } from "@/utils/parseTimestampForDisplay"

const getStyles = (theme: Theme) =>
  ({
    mainView: {
      gap: theme.gap,
      alignItems: "center",
      padding: 20,
    },
    headingTypography: {
      marginBottom: 0,
    },
    timestampTypography: {
      color: theme.colors.primary,
      fontSize: theme.fontSize.small,
      fontWeight: "bold",
    },
    statusTypography: {
      fontSize: theme.fontSize.small,
      color: theme.colors.primary,
      fontWeight: "bold",
    },
    descriptionView: {
      borderWidth: theme.borderWidth,
      borderColor: theme.colors.primary,
      borderRadius: theme.borderRadius,
      padding: theme.inputPadding,
      flex: 1,
      flexDirection: "row",
    },
  } as const)

type LocalSearchParams = {
  carId: string
  incidentId: string
}

const Incident = () => {
  const { carId, incidentId } = useLocalSearchParams<LocalSearchParams>()
  const styles = useStyles(getStyles)

  const [incident, setIncident] = useState<IncidentDoc>()

  const { isLoading, handleAsyncRequest: handleGetIncident } =
    useAsyncRequestHandler({
      request: getIncident,
    })

  useEffect(() => {
    ;(async () => {
      const fetchedIncident = await handleGetIncident({
        carId,
        incidentId,
      })

      setIncident(fetchedIncident)
    })()
  }, [carId, incidentId])

  if (isLoading) {
    return <LoadingView text="Loading incident details..." />
  }

  if (!incident) {
    return <ErrorView message="Failed to load incident details" />
  }

  const { creationTimestamp, description, status } = incident

  const parsedTimestamp = parseTimestampForDisplay({
    timestamp: creationTimestamp,
  })

  return (
    <View style={styles.mainView}>
      <Typography type="heading" style={styles.headingTypography}>
        Incident Details
      </Typography>
      <Typography style={styles.timestampTypography}>
        {parsedTimestamp}
      </Typography>

      <IssuesStatus status={status} />

      <View style={styles.descriptionView}>
        <ScrollView>
          <Typography>{description}</Typography>
        </ScrollView>
      </View>
    </View>
  )
}

export default Incident
