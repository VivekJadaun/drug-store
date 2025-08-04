"use client"
import { createTheme } from "@mui/material/styles"

/**
 * Material-UI theme configuration
 */
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
  },
  components: {
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: "#f5f5f5",
          fontWeight: 600,
        },
      },
    },
  },
})

export default theme
