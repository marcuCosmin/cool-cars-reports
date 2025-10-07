type Icons =
  | "car-arrow-left"
  | "car-arrow-right"
  | "car-cog"
  | "speedometer"
  | "playlist-check"
  | "check-circle"
  | "file-document-edit"

export type ActionCardProps = {
  hidden?: boolean
  label: string
  icon: Icons
  displayOverlay?: boolean
  disabled?: boolean
  overlayIcon?: Icons
  onClick: () => void
}
