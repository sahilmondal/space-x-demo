import type { FC } from "react";
import {
  Group,
  TextInput,
  Select,
  Button,
  Paper,
  Accordion,
  SegmentedControl,
  Chip,
  Box,
  createStyles,
  rem,
} from "@mantine/core";
import {
  IconSearch,
  IconSortAscending,
  IconSortDescending,
  IconFilter,
  IconTable,
  IconGridDots,
  IconX,
} from "@tabler/icons-react";
import { useFilterStore } from "../store/app.store";

const useStyles = createStyles((theme) => ({
  filterContainer: {
    position: "sticky",
    top: 0,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    zIndex: 10,
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    marginBottom: theme.spacing.md,
  },

  filterPaper: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  yearSelect: {
    minWidth: rem(120),
  },
}));

const currentYear = new Date().getFullYear();
const years = Array.from({ length: currentYear - 2005 + 1 }, (_, i) => ({
  value: (2006 + i).toString(),
  label: (2006 + i).toString(),
}));

const LaunchesFilter: FC = () => {
  const { classes } = useStyles();
  const {
    searchTerm,
    sortBy,
    sortDirection,
    viewMode,
    filters,
    setSearchTerm,
    setSortBy,
    setSortDirection,
    setViewMode,
    setFilter,
    resetFilters,
  } = useFilterStore();

  const handleSortDirectionToggle = () => {
    setSortDirection(sortDirection === "asc" ? "desc" : "asc");
  };

  const handleResetFilters = () => {
    resetFilters();
  };

  const hasActiveFilters =
    searchTerm !== "" ||
    filters.success !== null ||
    filters.upcoming !== null ||
    filters.year !== null;

  return (
    <Box className={classes.filterContainer}>
      <Paper p="md" withBorder mb="md">
        <Group position="apart" mb="xs">
          <TextInput
            placeholder="Search launches..."
            icon={<IconSearch size={14} />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.currentTarget.value)}
            style={{ flexGrow: 1 }}
          />

          <Group spacing="xs">
            <SegmentedControl
              value={viewMode}
              onChange={(value: "table" | "grid") => setViewMode(value)}
              data={[
                {
                  value: "table",
                  label: (
                    <Group spacing={5} style={{ flexWrap: "nowrap" }}>
                      <IconTable size={16} />
                      <Box ml={5} className="">
                        Table
                      </Box>
                    </Group>
                  ),
                },
                {
                  value: "grid",
                  label: (
                    <Group spacing={5}>
                      <IconGridDots size={16} />
                      <Box ml={5} className="">
                        Grid
                      </Box>
                    </Group>
                  ),
                },
              ]}
            />
          </Group>
        </Group>

        <Accordion variant="contained">
          <Accordion.Item value="filters">
            <Accordion.Control icon={<IconFilter size={18} />}>
              Filters & Sorting
              {hasActiveFilters && (
                <Chip
                  size="xs"
                  checked={false}
                  ml="xs"
                  variant="filled"
                  color="blue"
                >
                  Active
                </Chip>
              )}
            </Accordion.Control>
            <Accordion.Panel>
              <Group position="apart" align="flex-end">
                <Group align="flex-end">
                  <Select
                    label="Sort by"
                    value={sortBy}
                    onChange={(value) => setSortBy(value || "date_utc")}
                    data={[
                      { value: "date_utc", label: "Launch Date" },
                      { value: "name", label: "Mission Name" },
                      { value: "flight_number", label: "Flight Number" },
                    ]}
                    style={{ width: 200 }}
                  />

                  <Button
                    variant="light"
                    onClick={handleSortDirectionToggle}
                    leftIcon={
                      sortDirection === "asc" ? (
                        <IconSortAscending size={16} />
                      ) : (
                        <IconSortDescending size={16} />
                      )
                    }
                  >
                    {sortDirection === "asc" ? "Ascending" : "Descending"}
                  </Button>
                </Group>

                <Group align="flex-end">
                  <Select
                    label="Launch Status"
                    value={
                      filters.success === null
                        ? ""
                        : filters.success
                        ? "success"
                        : "failure"
                    }
                    onChange={(value) => {
                      if (value === "") {
                        setFilter("success", null);
                      } else {
                        setFilter("success", value === "success");
                      }
                    }}
                    data={[
                      { value: "", label: "All" },
                      { value: "success", label: "Success" },
                      { value: "failure", label: "Failure" },
                    ]}
                    style={{ width: 120 }}
                  />

                  <Select
                    label="Timing"
                    value={
                      filters.upcoming === null
                        ? ""
                        : filters.upcoming
                        ? "upcoming"
                        : "past"
                    }
                    onChange={(value) => {
                      if (value === "") {
                        setFilter("upcoming", null);
                      } else {
                        setFilter("upcoming", value === "upcoming");
                      }
                    }}
                    data={[
                      { value: "", label: "All" },
                      { value: "upcoming", label: "Upcoming" },
                      { value: "past", label: "Past" },
                    ]}
                    style={{ width: 120 }}
                  />

                  <Select
                    label="Year"
                    value={filters.year === null ? "" : filters.year.toString()}
                    onChange={(value: string) => {
                      if (value === "") {
                        setFilter("year", null);
                      } else {
                        setFilter("year", Number.parseInt(value));
                      }
                    }}
                    data={[{ value: "", label: "All" }, ...years]}
                    className={classes.yearSelect}
                  />

                  {hasActiveFilters && (
                    <Button
                      variant="subtle"
                      color="gray"
                      leftIcon={<IconX size={16} />}
                      onClick={handleResetFilters}
                    >
                      Reset
                    </Button>
                  )}
                </Group>
              </Group>
            </Accordion.Panel>
          </Accordion.Item>
        </Accordion>
      </Paper>
    </Box>
  );
};

export default LaunchesFilter;
