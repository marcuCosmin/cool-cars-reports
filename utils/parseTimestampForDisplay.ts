type ParseTimestampForDisplayOptions = {
  timestamp: number
  showTime?: boolean
}

export const parseTimestampForDisplay = ({
  timestamp,
  showTime = true,
}: ParseTimestampForDisplayOptions) => {
  const date = new Date(timestamp)

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }

  if (showTime) {
    options.hour = "2-digit"
    options.minute = "2-digit"
  }

  const parsedTimestamp = date.toLocaleDateString(undefined, options)

  return parsedTimestamp
}
