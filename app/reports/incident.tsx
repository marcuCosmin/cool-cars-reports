import { useState } from "react"
import { KeyboardAvoidingView } from "react-native"

import { useAppSelector } from "@/redux/config"

import { useApi } from "@/hooks/useApi"
import { useStyles } from "@/hooks/useStyles"

import { Button } from "@/components/basic/Button"
import { Input } from "@/components/basic/Input"
import { Typography } from "@/components/basic/Typography"

const getStyles = () =>
  ({
    heading: {
      textAlign: "center",
    },
    buttonsView: {
      display: "flex",
      alignItems: "center",
      gap: 50,
    },
    button: {
      marginTop: 40,
    },
  } as const)

export default function Incident() {
  const [value, setValue] = useState("")
  const { selectedCar } = useAppSelector(({ cars }) => cars)

  const { executeApiRequest } = useApi()
  const styles = useStyles(getStyles)

  const onChange = (text: string) => setValue(text)

  const onSubmitClick = () =>
    executeApiRequest({
      path: "/reports/incidents",
      method: "POST",
      payload: {
        incident: value,
        carId: selectedCar.id,
      },
    })

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "black" }}
      behavior="height"
      keyboardVerticalOffset={100}
    >
      <Typography type="heading" style={styles.heading}>
        Incident
      </Typography>

      <Input type="textarea" value={value} onChange={onChange} />

      {!!value.length && (
        <Button style={styles.button} onClick={onSubmitClick}>
          <Typography type="button">Report incident</Typography>
        </Button>
      )}
    </KeyboardAvoidingView>
  )
}
