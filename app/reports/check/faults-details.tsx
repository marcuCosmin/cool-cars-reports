import { router } from "expo-router"

import { setFaultsDetails } from "@/redux/answersSlice"
import { useAppDispatch, useAppSelector } from "@/redux/config"

import { Button } from "@/components/basic/Button"
import { Input } from "@/components/basic/Input"
import { Typography } from "@/components/basic/Typography"
import { View } from "@/components/basic/View"

export default function FaultsDetails() {
  const value = useAppSelector(({ answers }) => answers.faultsDetails)
  const dispatch = useAppDispatch()

  const onChange = (text: string) => dispatch(setFaultsDetails(text))
  const onConfirmClick = () => router.push("/reports/check")

  return (
    <View>
      <Typography type="heading">Faults Details</Typography>

      <Input type="textarea" value={value} onChange={onChange} />

      {value && (
        <Button onClick={onConfirmClick}>
          <Typography type="button">Confirm</Typography>
        </Button>
      )}
    </View>
  )
}
