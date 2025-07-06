import { MaterialCommunityIcons } from "@expo/vector-icons"
import { StyleSheet, type StyleProp, type ViewStyle } from "react-native"

import { firebaseAuth } from "@/firebase/config"
import { signOut } from "firebase/auth"

import { useStyles } from "@/hooks/useStyles"
import { useTheme } from "@/hooks/useTheme"

import { Button } from "@/components/basic/Button"

const getStyles = () => ({
  button: {
    backgroundColor: "transparent",
  },
})

type LogoutProps = {
  style?: StyleProp<ViewStyle>
}

export const Logout = ({ style }: LogoutProps) => {
  const theme = useTheme()
  const styles = useStyles(getStyles)
  const mergedStyles = StyleSheet.flatten([styles.button, style])

  const onClick = () => signOut(firebaseAuth)

  return (
    <Button style={mergedStyles} onClick={onClick}>
      <MaterialCommunityIcons
        name="logout"
        size={35}
        color={theme.colors.text}
      />
    </Button>
  )
}
