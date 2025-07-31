import { MaterialCommunityIcons } from "@expo/vector-icons"
import { useLocalSearchParams } from "expo-router"
import { useEffect, useState } from "react"
import { ScrollView } from "react-native"

import { getIncident, type IncidentDoc } from "@/firebase/utils"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"
import { useStyles } from "@/hooks/useStyles"
import { useTheme, type Theme } from "@/hooks/useTheme"

import { IssuesStatus } from "@/components/basic/IssuesStatus"
import { LoadingView } from "@/components/basic/LoadingView"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

import { parseTimestampForDisplay } from "@/utils/parseTimestampForDisplay"

const getStyles = (theme: Theme) =>
  ({
    mainView: {
      alignItems: "center",
      gap: 15,
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
    errorView: {
      alignItems: "center",
    },
  } as const)

type LocalSearchParams = {
  carId: string
  incidentId: string
}

const Incident = () => {
  const { carId, incidentId } = useLocalSearchParams<LocalSearchParams>()
  const styles = useStyles(getStyles)
  const theme = useTheme()

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
    return (
      <View style={styles.errorView}>
        <Typography type="heading">Failed to load incident details</Typography>
        <MaterialCommunityIcons
          name="emoticon-sad"
          size={100}
          color={theme.colors.primary}
        />
      </View>
    )
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
