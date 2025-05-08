import type { FC } from "react"
import { Outlet } from "react-router-dom"
import { AppShell, MantineProvider, ColorSchemeProvider } from "@mantine/core"
import Header from "./Header"
import Footer from "./Footer"
import Notifications from "./Notifications"
import { useUIStore } from "../store/app.store"

const Layout: FC = () => {
  const { colorScheme, toggleColorScheme } = useUIStore()

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <AppShell
          padding="md"
          header={<Header />}
          footer={<Footer />}
          styles={(theme) => ({
            main: {
              backgroundColor: theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
              minHeight: "calc(100vh - 140px)", 
            },
          })}
        >
          <Notifications />
          <Outlet />
        </AppShell>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default Layout
