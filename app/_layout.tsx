import { store } from "@/redux/config"
import { Provider } from "react-redux"

import { Layout } from "@/components/core/Layout"

export default function RootLayout() {
  return (
    <Provider store={store}>
      <Layout />
    </Provider>
  )
}
