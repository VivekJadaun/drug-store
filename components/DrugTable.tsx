"use client"

import { useState, useEffect, useMemo } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Box,
  CircularProgress,
  Alert,
  type SelectChangeEvent,
} from "@mui/material"
import type { DrugDisplay } from "@/lib/database"

interface DrugTableProps {
  className?: string
}

/**
 * Main component for displaying drug information in a filterable table
 */
export default function DrugTable({ className }: DrugTableProps) {
  const [drugs, setDrugs] = useState<DrugDisplay[]>([])
  const [companies, setCompanies] = useState<string[]>([])
  const [selectedCompany, setSelectedCompany] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch companies for filter dropdown
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetch("/api/companies")
        const result = await response.json()

        if (result.success) {
          setCompanies(result.data)
        } else {
          throw new Error(result.error || "Failed to fetch companies")
        }
      } catch (err) {
        console.error("Error fetching companies:", err)
        setError("Failed to load companies")
      }
    }

    fetchCompanies()
  }, [])

  // Fetch drugs data when component mounts or filter changes
  useEffect(() => {
    const fetchDrugs = async () => {
      setLoading(true)
      setError(null)

      try {
        const url =
          selectedCompany === "all" ? "/api/drugs" : `/api/drugs?company=${encodeURIComponent(selectedCompany)}`

        const response = await fetch(url)
        const result = await response.json()

        if (result.success) {
          setDrugs(result.data)
        } else {
          throw new Error(result.error || "Failed to fetch drugs")
        }
      } catch (err) {
        console.error("Error fetching drugs:", err)
        setError("Failed to load drug data")
      } finally {
        setLoading(false)
      }
    }

    fetchDrugs()
  }, [selectedCompany])

  // Handle company filter change
  const handleCompanyChange = (event: SelectChangeEvent<string>) => {
    setSelectedCompany(event.target.value)
  }

  // Memoized table rows for performance
  const tableRows = useMemo(() => {
    return drugs.map((drug) => (
      <TableRow key={drug.id} sx={{ "&:nth-of-type(odd)": { backgroundColor: "action.hover" } }}>
        <TableCell>{drug.id}</TableCell>
        <TableCell>{drug.code}</TableCell>
        <TableCell>{drug.name}</TableCell>
        <TableCell>{drug.company}</TableCell>
        <TableCell>{drug.launchDate}</TableCell>
      </TableRow>
    ))
  }, [drugs])

  if (error) {
    return (
      <Box className={className}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      </Box>
    )
  }

  return (
    <Box className={className}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Drug Information Database
      </Typography>

      {/* Company Filter */}
      <Box sx={{ mb: 3, minWidth: 200 }}>
        <FormControl fullWidth>
          <InputLabel id="company-filter-label">Filter by Company</InputLabel>
          <Select
            labelId="company-filter-label"
            id="company-filter"
            value={selectedCompany}
            label="Filter by Company"
            onChange={handleCompanyChange}
            disabled={loading}
          >
            <MenuItem value="all">All Companies</MenuItem>
            {companies.map((company) => (
              <MenuItem key={company} value={company}>
                {company}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Loading State */}
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}

      {/* Data Table */}
      {!loading && (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Showing {drugs.length} drug{drugs.length !== 1 ? "s" : ""}
            {selectedCompany !== "all" && ` from ${selectedCompany}`}
          </Typography>

          <TableContainer component={Paper} sx={{ maxHeight: '65vh' }}>
            <Table stickyHeader aria-label="drug information table">
              <TableHead>
                <TableRow>
                  <TableCell>
                    <strong>ID</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Code</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Name</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Company</strong>
                  </TableCell>
                  <TableCell>
                    <strong>Launch Date</strong>
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>{tableRows}</TableBody>
            </Table>
          </TableContainer>
        </>
      )}
    </Box>
  )
}
