import { type FC, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useSearchParams, useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Table,
  Group,
  Text,
  Badge,
  Image,
  ActionIcon,
  Grid,
  Tooltip,
  Pagination,
  Box,
  createStyles,
  rem,
} from "@mantine/core";
import { IconEye, IconHeart, IconHeartFilled } from "@tabler/icons-react";
import { fetchLaunches } from "../../api/spacex";
import {
  useFilterStore,
  useFavoritesStore,
  useUIStore,
} from "../../store/app.store";
import LaunchesFilter from "../../components/LaunchesFilter";
import LaunchCard from "../../components/LaunchCard";
import LaunchesSkeletonLoader from "../../components/LaunchesSkeletonLoader";
import EmptyState from "../../components/EmptyState";

const useStyles = createStyles((theme) => ({
  container: {
    paddingBottom: rem(80),
  },

  tableRow: {
    cursor: "pointer",
    transition: "background-color 150ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[1],
    },
  },

  paginationContainer: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: theme.spacing.xl,

    [theme.fn.smallerThan("sm")]: {
      flexDirection: "column",
      alignItems: "center",
      gap: theme.spacing.md,
    },
  },
  tableResponsive: {
    overflowX: "auto",

    // [theme.fn.smallerThan("md")]: {
    border: "1px solid ",
    borderColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[5]
        : theme.colors.gray[2],
    borderRadius: theme.radius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.xl,
    marginTop: theme.spacing.xl,
    // },
  },
}));

const ITEMS_PER_PAGE = 12;

const LaunchesList: FC = () => {
  const { classes } = useStyles();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { searchTerm, sortBy, sortDirection, viewMode, filters } =
    useFilterStore();
  const { isFavoriteLaunch, addFavoriteLaunch, removeFavoriteLaunch } =
    useFavoritesStore();
  const { addNotification } = useUIStore();

  // Get page from URL or default to 1
  const currentPage = Number.parseInt(searchParams.get("page") || "2", 10);

  // Fetch all launches
  const {
    data: launches,
    isLoading,
    error,
  } = useQuery(["launches"], fetchLaunches, {
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });

  // Update URL when page changes
  const setPage = (page: number) => {
    searchParams.set("page", page.toString());
    setSearchParams(searchParams);
  };

  // Sync URL parameters with filter store on mount
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      // URL already has page parameter, no need to set it
    } else {
      // Set default page in URL
      setPage(1);
    }
  }, []);

  const toggleFavorite = (id: string, name: string) => {
    if (isFavoriteLaunch(id)) {
      removeFavoriteLaunch(id);
      addNotification({
        message: `${name} removed from favorites`,
        type: "info",
      });
    } else {
      addFavoriteLaunch(id);
      addNotification({
        message: `${name} added to favorites`,
        type: "success",
      });
    }
  };

  const filteredLaunches = useMemo(() => {
    if (!launches) return [];

    let filtered = [...launches];

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (launch) =>
          launch.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (launch.details &&
            launch.details.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    // Apply success filter
    if (filters.success !== null) {
      filtered = filtered.filter(
        (launch) => launch.success === filters.success
      );
    }

    // Apply upcoming filter
    if (filters.upcoming !== null) {
      filtered = filtered.filter(
        (launch) => launch.upcoming === filters.upcoming
      );
    }

    // Apply year filter
    if (filters.year !== null) {
      filtered = filtered.filter((launch) => {
        const launchYear = new Date(launch.date_utc).getFullYear();
        return launchYear === filters.year;
      });
    }

    // Apply sorting
    return filtered.sort((a, b) => {
      if (sortBy === "date_utc") {
        return sortDirection === "asc"
          ? new Date(a.date_utc).getTime() - new Date(b.date_utc).getTime()
          : new Date(b.date_utc).getTime() - new Date(a.date_utc).getTime();
      }

      if (sortBy === "name") {
        return sortDirection === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      }

      if (sortBy === "flight_number") {
        return sortDirection === "asc"
          ? a.flight_number - b.flight_number
          : b.flight_number - a.flight_number;
      }

      return 0;
    });
  }, [launches, searchTerm, sortBy, sortDirection, filters]);

  // Pagination
  const totalPages = Math.ceil(filteredLaunches.length / ITEMS_PER_PAGE);
  const paginatedLaunches = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredLaunches.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredLaunches, currentPage]);

  const handleRowClick = (id: string) => {
    navigate(`/launches/${id}`);
  };

  return (
    <Container size="xl" className={classes.container}>
      <Title order={2} mb="lg">
        SpaceX Launches
      </Title>

      <LaunchesFilter />

      {isLoading ? (
        <LaunchesSkeletonLoader count={ITEMS_PER_PAGE} />
      ) : error ? (
        <EmptyState
          title="Error loading launches"
          description="We couldn't load the launches. Please try again later."
          primaryAction={{
            label: "Try Again",
            onClick: () => window.location.reload(),
          }}
        />
      ) : filteredLaunches.length === 0 ? (
        <EmptyState
          title="No launches found"
          description="We couldn't find any launches matching your criteria. Try adjusting your filters."
          primaryAction={{
            label: "Reset Filters",
            onClick: () => useFilterStore.getState().resetFilters(),
          }}
        />
      ) : viewMode === "table" ? (
        <div className={classes.tableResponsive}>
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>Mission Patch</th>
                <th>Flight #</th>
                <th>Mission Name</th>
                <th>Launch Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedLaunches.map((launch) => (
                <tr
                  key={launch.id}
                  className={classes.tableRow}
                  onClick={() => handleRowClick(launch.id)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <Image
                      src={launch.links.patch.small || "/placeholder.png"}
                      alt={`${launch.name} patch`}
                      width={50}
                      height={50}
                      fit="contain"
                    />
                  </td>
                  <td>{launch.flight_number}</td>
                  <td>{launch.name}</td>
                  <td>{new Date(launch.date_utc).toLocaleDateString()}</td>
                  <td>
                    {launch.upcoming ? (
                      <Badge color="blue">Upcoming</Badge>
                    ) : launch.success ? (
                      <Badge color="green">Success</Badge>
                    ) : (
                      <Badge color="red">Failed</Badge>
                    )}
                  </td>
                  <td onClick={(e) => e.stopPropagation()}>
                    <Group spacing="xs">
                      <Tooltip
                        label={
                          isFavoriteLaunch(launch.id)
                            ? "Remove from favorites"
                            : "Add to favorites"
                        }
                      >
                        <ActionIcon
                          color="red"
                          variant={
                            isFavoriteLaunch(launch.id) ? "filled" : "light"
                          }
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleFavorite(launch.id, launch.name);
                          }}
                        >
                          {isFavoriteLaunch(launch.id) ? (
                            <IconHeartFilled size={16} />
                          ) : (
                            <IconHeart size={16} />
                          )}
                        </ActionIcon>
                      </Tooltip>
                      <Tooltip label="View details">
                        <ActionIcon
                          component={Link}
                          to={`/launches/${launch.id}`}
                          variant="light"
                          color="blue"
                        >
                          <IconEye size={16} />
                        </ActionIcon>
                      </Tooltip>
                    </Group>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Grid>
          {paginatedLaunches.map((launch) => (
            <Grid.Col key={launch.id} xs={12} sm={6} md={4} lg={3}>
              <LaunchCard launch={launch} />
            </Grid.Col>
          ))}
        </Grid>
      )}

      {filteredLaunches.length > 0 && (
        <Box className={classes.paginationContainer}>
          <Text color="dimmed" size="sm">
            Showing {paginatedLaunches.length} of {filteredLaunches.length}{" "}
            launches
          </Text>

          <Pagination
            total={totalPages}
            value={currentPage}
            onChange={setPage}
            withEdges
            boundaries={1}
          />
        </Box>
      )}
    </Container>
  );
};

export default LaunchesList;
