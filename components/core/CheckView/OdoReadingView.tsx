import { type OdoReading } from "@/redux/answersSlice"

import { useStyles } from "@/hooks/useStyles"

import { Typography } from "@/components/basic/Typography"

const getStyles = () => ({
  typography: {
    marginTop: 20,
  },
})

type OdoReadingViewProps = {
  odoReading: OdoReading
}

export const OdoReadingView = ({ odoReading }: OdoReadingViewProps) => {
  const { value, unit } = odoReading
  const styles = useStyles(getStyles)

  return (
    <Typography
      style={styles.typography}
      type="heading"
    >{`${value} ${unit}`}</Typography>
  )
}
