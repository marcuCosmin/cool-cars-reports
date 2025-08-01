type GetTabButtonPositionProps = {
  index: number
  optionsLength: number
}

export const getTabButtonPosition = ({
  index,
  optionsLength,
}: GetTabButtonPositionProps) => {
  if (index === 0) {
    return "first"
  }

  if (index === optionsLength - 1) {
    return "last"
  }

  return "middle"
}
