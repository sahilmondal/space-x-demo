import type { FC } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Title,
  Text,
  Tabs,
  Grid,
  Center,
  Loader,
  Button,
  createStyles,
  rem,
} from "@mantine/core";
import { IconRocket, IconHeart } from "@tabler/icons-react";
import { fetchLaunches, fetchRocket } from "../../api/spacex";
import { useFavoritesStore } from "../../store/app.store";
import LaunchCard from "../../components/LaunchCard";
import EmptyState from "../../components/EmptyState";

const useStyles = createStyles((theme) => ({
  container: {
    paddingBottom: rem(80),
  },

  tabIcon: {
    marginRight: theme.spacing.xs,
    display: "flex",
    alignItems: "center",
  },
}));

const Favorites: FC = () => {
  const { classes } = useStyles();
  const { favoriteLaunches, favoriteRockets } = useFavoritesStore();

  const { data: allLaunches, isLoading: isLoadingLaunches } = useQuery(
    ["launches"],
    fetchLaunches,
    {
      staleTime: 1000 * 60 * 5, // 5 minutes
    }
  );

  const favoriteLaunchesData =
    allLaunches?.filter((launch) => favoriteLaunches.includes(launch.id)) || [];

  // Fetch favorite rockets
  const favoriteRocketsQueries = favoriteRockets.map((rocketId) => ({
    queryKey: ["rocket", rocketId],
    queryFn: () => fetchRocket(rocketId),
  }));

  const { data: favoriteRocketsData, isLoading: isLoadingRockets } = useQuery(
    ["favoriteRockets", favoriteRockets],
    async () => {
      if (favoriteRockets.length === 0) return [];
      const promises = favoriteRockets.map((id) => fetchRocket(id));
      return Promise.all(promises);
    },
    {
      enabled: favoriteRockets.length > 0,
      staleTime: 1000 * 60 * 5,
    }
  );

  const isLoading =
    isLoadingLaunches || (favoriteRockets.length > 0 && isLoadingRockets);

  return (
    <Container size="xl" className={classes.container}>
      <Title order={2} mb="lg">
        Your Favorites
      </Title>

      {isLoading ? (
        <Center style={{ height: "50vh" }}>
          <Loader size="xl" />
        </Center>
      ) : (
        <Tabs defaultValue="launches">
          <Tabs.List mb="xl">
            <Tabs.Tab
              value="launches"
              icon={
                <div className={classes.tabIcon}>
                  <IconRocket size={16} />
                </div>
              }
            >
              Favorite Launches ({favoriteLaunches.length})
            </Tabs.Tab>
            <Tabs.Tab
              value="rockets"
              icon={
                <div className={classes.tabIcon}>
                  <IconHeart size={16} />
                </div>
              }
            >
              Favorite Rockets ({favoriteRockets.length})
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="launches">
            {favoriteLaunchesData.length > 0 ? (
              <Grid>
                {favoriteLaunchesData.map((launch) => (
                  <Grid.Col key={launch.id} xs={12} sm={6} md={4} lg={3}>
                    <LaunchCard launch={launch} />
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <EmptyState
                title="No favorite launches yet"
                description="You haven't added any launches to your favorites. Browse launches and click the heart icon to add them here."
                primaryAction={{
                  label: "Browse Launches",
                  onClick: () => (window.location.href = "/launches"),
                }}
              />
            )}
          </Tabs.Panel>

          <Tabs.Panel value="rockets">
            {favoriteRocketsData && favoriteRocketsData.length > 0 ? (
              <Grid>
                {favoriteRocketsData.map((rocket) => (
                  <Grid.Col key={rocket.id} xs={12} sm={6}>
                    <div
                      style={{
                        border: "1px solid #e9ecef",
                        borderRadius: "8px",
                        padding: "1rem",
                        height: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                        }}
                      >
                        <div>
                          <Title order={3}>{rocket.name}</Title>
                          <Text color="dimmed">{rocket.company}</Text>
                        </div>
                        <div>
                          <Text
                            weight={700}
                            color={rocket.active ? "green" : "red"}
                          >
                            {rocket.active ? "Active" : "Inactive"}
                          </Text>
                        </div>
                      </div>

                      <Grid mt="md">
                        <Grid.Col span={6}>
                          <img
                            src={rocket.flickr_images[0] || "/placeholder.png"}
                            alt={rocket.name}
                            style={{
                              width: "100%",
                              height: "192px",
                              objectFit: "cover",
                              borderRadius: "8px",
                            }}
                          />
                        </Grid.Col>
                        <Grid.Col span={6}>
                          <Text size="sm" lineClamp={7}>
                            {rocket.description}
                          </Text>
                        </Grid.Col>
                      </Grid>

                      <div style={{ marginTop: "auto", paddingTop: "1rem" }}>
                        <Button
                          component="a"
                          href={rocket.wikipedia}
                          target="_blank"
                          rel="noopener noreferrer"
                          variant="light"
                          fullWidth
                        >
                          Learn More
                        </Button>
                      </div>
                    </div>
                  </Grid.Col>
                ))}
              </Grid>
            ) : (
              <EmptyState
                title="No favorite rockets yet"
                description="You haven't added any rockets to your favorites. View launch details and click the heart icon on a rocket to add it here."
                primaryAction={{
                  label: "Browse Launches",
                  onClick: () => (window.location.href = "/launches"),
                }}
              />
            )}
          </Tabs.Panel>
        </Tabs>
      )}
    </Container>
  );
};

export default Favorites;
