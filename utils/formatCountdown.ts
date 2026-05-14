export const formatCountdown = (ms: number) => {
  if (ms <= 0) {
    return "00:00"
  }

  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  const values = hours ? [hours, minutes, seconds] : [minutes, seconds]
  const parsedValues = values.map((number) => String(number).padStart(2, "0"))

  const formattedCountDown = parsedValues.join(":")

  return formattedCountDown
}
