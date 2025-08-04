import { Container } from "@mui/material"
import DrugTable from "@/components/DrugTable"

/**
 * Home page component
 * Displays the main drug information table with filtering capabilities
 */
export default function HomePage() {
  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <DrugTable />
    </Container>
  )
}
