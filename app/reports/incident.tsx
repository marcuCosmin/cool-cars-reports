import { router } from "expo-router"
import { useState } from "react"

import { postIncident } from "@/api/utils"

import { useAppSelector } from "@/redux/config"

import { useAsyncRequestHandler } from "@/hooks/useAsyncRequestHandler"
import { useStyles } from "@/hooks/useStyles"

import { Button } from "@/components/basic/Button"
import { Input } from "@/components/basic/Input"
import { LoadingView } from "@/components/basic/LoadingView/LoadingView"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

const getStyles = () =>
  ({
    heading: {
      textAlign: "center",
    },
    button: {
      marginTop: "auto",
    },
  } as const)

export default function Incident() {
  const [value, setValue] = useState("")
  const submittedCheckId = useAppSelector(
    ({ submittedCheck }) => submittedCheck.id
  )
  const carId = useAppSelector(({ cars }) => cars.selectedCar.id)

  const { isLoading, handleAsyncRequest: handleIncidentSubmit } =
    useAsyncRequestHandler({
      request: postIncident,
      successMessage: "Incident reported successfully",
    })
  const styles = useStyles(getStyles)

  const onChange = (text: string) => setValue(text)

  const onSubmitClick = async () => {
    const response = await handleIncidentSubmit({
      carId,
      description: value,
      checkId: submittedCheckId,
    })

    if (response) {
      router.dismissTo("/")
    }
  }

  return (
    <View>
      {isLoading && <LoadingView overlay />}
      <Typography type="heading" style={styles.heading}>
        Incident
      </Typography>

      <Input type="textarea" value={value} onChange={onChange} />

      {!!value.length && (
        <Button style={styles.button} onClick={onSubmitClick}>
          <Typography type="button">Report incident</Typography>
        </Button>
      )}
    </View>
  )
}
