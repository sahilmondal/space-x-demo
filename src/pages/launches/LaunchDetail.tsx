import type { FC } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  Container,
  Title,
  Text,
  Group,
  Badge,
  Image,
  Grid,
  Paper,
  Loader,
  Center,
  Button,
  Tabs,
  Card,
  List,
  ThemeIcon,
  Divider,
  Timeline,
  ActionIcon,
  Tooltip,
  Breadcrumbs,
  Anchor,
  Stack,
  SimpleGrid,
  Progress,
  Skeleton,
  createStyles,
  rem,
} from "@mantine/core";
import {
  IconRocket,
  IconCalendar,
  IconLink,
  IconArrowBack,
  IconCheck,
  IconX,
  IconInfoCircle,
  IconPhoto,
  IconChevronRight,
  IconMapPin,
  IconUsers,
  IconPackage,
  IconHeart,
  IconHeartFilled,
  IconShare,
} from "@tabler/icons-react";
import {
  fetchLaunch,
  fetchRocket,
  fetchLaunchpad,
  fetchMultipleCrewMembers,
  fetchMultiplePayloads,
} from "../../api/spacex";
import { useFavoritesStore, useUIStore } from "../../store/app.store";
import EmptyState from "../../components/EmptyState";

const useStyles = createStyles((theme) => ({
  container: {
    paddingBottom: rem(80),
  },

  header: {
    position: "relative",
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: theme.radius.md,
    padding: `${rem(40)} ${rem(20)}`,
    marginBottom: theme.spacing.xl,

    "&::after": {
      content: '""',
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor:
        theme.colorScheme === "dark"
          ? `rgba(0, 0, 0, 0.7)`
          : `rgba(255, 255, 255, 0.8)`,
      borderRadius: theme.radius.md,
      zIndex: 1,
    },
  },

  headerContent: {
    position: "relative",
    zIndex: 2,
  },

  badge: {
    textTransform: "uppercase",
  },

  section: {
    marginBottom: theme.spacing.xl,
  },

  tabIcon: {
    marginRight: theme.spacing.xs,
    display: "flex",
    alignItems: "center",
  },

  crewCard: {
    transition: "transform 200ms ease, box-shadow 200ms ease",

    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows.md,
    },
  },

  galleryImage: {
    borderRadius: theme.radius.md,
    overflow: "hidden",
    height: rem(200),

    "& img": {
      transition: "transform 500ms ease",
    },

    "&:hover img": {
      transform: "scale(1.05)",
    },
  },

  breadcrumbs: {
    marginBottom: theme.spacing.md,
  },

  favoriteButton: {
    position: "absolute",
    top: rem(20),
    right: rem(20),
    zIndex: 10,
  },
}));

const LaunchDetail: FC = () => {
  const { classes } = useStyles();
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const {
    isFavoriteLaunch,
    addFavoriteLaunch,
    removeFavoriteLaunch,
    isFavoriteRocket,
    addFavoriteRocket,
    removeFavoriteRocket,
  } = useFavoritesStore();
  const { addNotification } = useUIStore();

  const {
    data: launch,
    isLoading: isLoadingLaunch,
    error: launchError,
  } = useQuery(["launch", id], () => fetchLaunch(id!), {
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const {
    data: rocket,
    isLoading: isLoadingRocket,
    error: rocketError,
  } = useQuery(["rocket", launch?.rocket], () => fetchRocket(launch!.rocket), {
    enabled: !!launch?.rocket,
    staleTime: 1000 * 60 * 60, // 1 hour
  });

  const { data: launchpad, isLoading: isLoadingLaunchpad } = useQuery(
    ["launchpad", launch?.launchpad],
    () => fetchLaunchpad(launch!.launchpad),
    {
      enabled: !!launch?.launchpad,
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

  const { data: crewMembers, isLoading: isLoadingCrew } = useQuery(
    ["crew", launch?.crew],
    () => fetchMultipleCrewMembers(launch!.crew),
    {
      enabled: !!launch?.crew && launch.crew.length > 0,
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

  const { data: payloads, isLoading: isLoadingPayloads } = useQuery(
    ["payloads", launch?.payloads],
    () => fetchMultiplePayloads(launch!.payloads),
    {
      enabled: !!launch?.payloads && launch.payloads.length > 0,
      staleTime: 1000 * 60 * 60, // 1 hour
    }
  );

  const isLoading = isLoadingLaunch || isLoadingRocket;
  const error = launchError || rocketError;

  const toggleLaunchFavorite = () => {
    if (!launch) return;

    if (isFavoriteLaunch(launch.id)) {
      removeFavoriteLaunch(launch.id);
      addNotification({
        message: `${launch.name} removed from favorites`,
        type: "info",
      });
    } else {
      addFavoriteLaunch(launch.id);
      addNotification({
        message: `${launch.name} added to favorites`,
        type: "success",
      });
    }
  };

  const toggleRocketFavorite = () => {
    if (!rocket) return;

    if (isFavoriteRocket(rocket.id)) {
      removeFavoriteRocket(rocket.id);
      addNotification({
        message: `${rocket.name} removed from favorites`,
        type: "info",
      });
    } else {
      addFavoriteRocket(rocket.id);
      addNotification({
        message: `${rocket.name} added to favorites`,
        type: "success",
      });
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: launch?.name || "SpaceX Launch",
          text: `Check out this SpaceX launch: ${launch?.name}`,
          url: window.location.href,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      addNotification({
        message: "Link copied to clipboard",
        type: "success",
      });
    }
  };

  if (isLoading) {
    return (
      <Container className={classes.container}>
        <Breadcrumbs className={classes.breadcrumbs}>
          <Anchor component={Link} to="/">
            Home
          </Anchor>
          <Anchor component={Link} to="/launches">
            Launches
          </Anchor>
          <Text>Loading...</Text>
        </Breadcrumbs>

        <Skeleton height={300} radius="md" mb="xl" />

        <Grid>
          <Grid.Col xs={12} md={4}>
            <Skeleton height={250} radius="md" />
          </Grid.Col>
          <Grid.Col xs={12} md={8}>
            <Skeleton height={50} width="70%" mb="md" />
            <Skeleton height={20} width="40%" mb="lg" />
            <Skeleton height={100} mb="md" />
            <Group>
              <Skeleton height={36} width={120} radius="md" />
              <Skeleton height={36} width={120} radius="md" />
              <Skeleton height={36} width={120} radius="md" />
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (error || !launch) {
    return (
      <Container className={classes.container}>
        <EmptyState
          title="Launch not found"
          description="We couldn't find the launch you're looking for. It may have been removed or you may have followed a broken link."
          primaryAction={{
            label: "Back to Launches",
            onClick: () => navigate("/launches"),
          }}
        />
      </Container>
    );
  }

  const launchDate = new Date(launch.date_utc);
  const formattedDate = launchDate.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formattedTime = launchDate.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    timeZoneName: "short",
  });

  const hasLaunchImages = launch.links.flickr.original.length > 0;
  const hasRocketImages =
    rocket?.flickr_images.length && rocket?.flickr_images.length > 0;
  const hasLaunchpadImages =
    launchpad?.images.large.length && launchpad?.images.large.length > 0;

  const allImages = [
    ...(hasLaunchImages ? launch.links.flickr.original : []),
    ...(hasRocketImages ? rocket.flickr_images : []),
    ...(hasLaunchpadImages ? launchpad.images.large : []),
  ];

  return (
    <Container size="xl" className={classes.container}>
      <Breadcrumbs className={classes.breadcrumbs}>
        <Anchor component={Link} to="/">
          Home
        </Anchor>
        <Anchor component={Link} to="/launches">
          Launches
        </Anchor>
        <Text>{launch.name}</Text>
      </Breadcrumbs>

      <div
        className={classes.header}
        style={{
          backgroundImage:
            allImages.length > 0 ? `url(${allImages[0]})` : "/placeholder.png",
          backgroundColor: allImages.length > 0 ? undefined : "#f0f0f0",
        }}
      >
        <div className={classes.headerContent}>
          <Group position="apart">
            <Badge
              size="lg"
              color={
                launch.upcoming ? "blue" : launch.success ? "green" : "red"
              }
              className={classes.badge}
            >
              {launch.upcoming
                ? "Upcoming"
                : launch.success
                ? "Success"
                : "Failed"}
            </Badge>

            <Group>
              <Tooltip label="Share">
                <ActionIcon variant="light" color="blue" onClick={handleShare}>
                  <IconShare size={18} />
                </ActionIcon>
              </Tooltip>

              <Tooltip
                label={
                  isFavoriteLaunch(launch.id)
                    ? "Remove from favorites"
                    : "Add to favorites"
                }
              >
                <ActionIcon
                  variant={isFavoriteLaunch(launch.id) ? "filled" : "light"}
                  color="red"
                  onClick={toggleLaunchFavorite}
                >
                  {isFavoriteLaunch(launch.id) ? (
                    <IconHeartFilled size={18} />
                  ) : (
                    <IconHeart size={18} />
                  )}
                </ActionIcon>
              </Tooltip>
            </Group>
          </Group>

          <Title order={1} mt="md" mb="xs">
            {launch.name}
          </Title>

          <Group spacing="xs" mb="md">
            <Badge leftSection={<IconRocket size={14} />}>
              Flight #{launch.flight_number}
            </Badge>
            <Badge leftSection={<IconCalendar size={14} />}>
              {formattedDate}
            </Badge>
          </Group>
        </div>
      </div>

      <Paper withBorder p="xl" radius="md" className={classes.section}>
        <Grid>
          <Grid.Col xs={12} md={4}>
            <Image
              src={launch.links.patch.large || "/placeholder.png"}
              alt={`${launch.name} mission patch`}
              fit="contain"
              height={250}
            />
          </Grid.Col>

          <Grid.Col xs={12} md={8}>
            <Title order={2} mb="xs">
              Mission Overview
            </Title>

            <Text mb="md" size="lg">
              {launch.details || "No details available for this mission."}
            </Text>

            <Group spacing="md" mb="xl">
              <Button
                component={Link}
                to="/launches"
                leftIcon={<IconArrowBack size={16} />}
                variant="outline"
              >
                Back to Launches
              </Button>

              {launch.links.webcast && (
                <Button
                  component="a"
                  href={launch.links.webcast}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<IconLink size={16} />}
                  variant="filled"
                >
                  Watch Webcast
                </Button>
              )}

              {launch.links.article && (
                <Button
                  component="a"
                  href={launch.links.article}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<IconLink size={16} />}
                  variant="light"
                >
                  Read Article
                </Button>
              )}

              {launch.links.wikipedia && (
                <Button
                  component="a"
                  href={launch.links.wikipedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  leftIcon={<IconLink size={16} />}
                  variant="light"
                >
                  Wikipedia
                </Button>
              )}
            </Group>

            <Group position="apart">
              <div>
                <Text size="sm" color="dimmed">
                  Launch Date
                </Text>
                <Text weight={500}>{formattedDate}</Text>
              </div>

              <div>
                <Text size="sm" color="dimmed">
                  Launch Time
                </Text>
                <Text weight={500}>{formattedTime}</Text>
              </div>

              <div>
                <Text size="sm" color="dimmed">
                  Status
                </Text>
                <Text weight={500}>
                  {launch.upcoming
                    ? "Upcoming"
                    : launch.success
                    ? "Successful"
                    : "Failed"}
                </Text>
              </div>
            </Group>
          </Grid.Col>
        </Grid>
      </Paper>

      <Tabs defaultValue="rocket" mt="xl">
        <Tabs.List>
          <Tabs.Tab
            value="rocket"
            icon={
              <div className={classes.tabIcon}>
                <IconRocket size={16} />
              </div>
            }
          >
            Rocket
          </Tabs.Tab>
          <Tabs.Tab
            value="launchpad"
            icon={
              <div className={classes.tabIcon}>
                <IconMapPin size={16} />
              </div>
            }
          >
            Launchpad
          </Tabs.Tab>
          {launch.crew.length > 0 && (
            <Tabs.Tab
              value="crew"
              icon={
                <div className={classes.tabIcon}>
                  <IconUsers size={16} />
                </div>
              }
            >
              Crew
            </Tabs.Tab>
          )}
          {launch.payloads.length > 0 && (
            <Tabs.Tab
              value="payloads"
              icon={
                <div className={classes.tabIcon}>
                  <IconPackage size={16} />
                </div>
              }
            >
              Payloads
            </Tabs.Tab>
          )}
          {allImages.length > 0 && (
            <Tabs.Tab
              value="gallery"
              icon={
                <div className={classes.tabIcon}>
                  <IconPhoto size={16} />
                </div>
              }
            >
              Gallery
            </Tabs.Tab>
          )}
        </Tabs.List>

        <Tabs.Panel value="rocket" pt="xl">
          {isLoadingRocket ? (
            <Center style={{ height: 200 }}>
              <Loader />
            </Center>
          ) : rocket ? (
            <Paper withBorder p="lg" radius="md">
              <Group position="apart" mb="md">
                <Title order={3}>{rocket.name}</Title>
                <Tooltip
                  label={
                    isFavoriteRocket(rocket.id)
                      ? "Remove from favorites"
                      : "Add to favorites"
                  }
                >
                  <ActionIcon
                    variant={isFavoriteRocket(rocket.id) ? "filled" : "light"}
                    color="red"
                    onClick={toggleRocketFavorite}
                  >
                    {isFavoriteRocket(rocket.id) ? (
                      <IconHeartFilled size={18} />
                    ) : (
                      <IconHeart size={18} />
                    )}
                  </ActionIcon>
                </Tooltip>
              </Group>

              <Grid>
                <Grid.Col xs={12} md={6}>
                  <Card withBorder p="lg" radius="md">
                    <Title order={4} mb="md">
                      Specifications
                    </Title>

                    <List spacing="sm">
                      <List.Item
                        icon={
                          <ThemeIcon
                            color={rocket.active ? "green" : "red"}
                            size={24}
                            radius="xl"
                          >
                            {rocket.active ? (
                              <IconCheck size={16} />
                            ) : (
                              <IconX size={16} />
                            )}
                          </ThemeIcon>
                        }
                      >
                        Status: {rocket.active ? "Active" : "Inactive"}
                      </List.Item>

                      <List.Item
                        icon={
                          <ThemeIcon color="blue" size={24} radius="xl">
                            <IconInfoCircle size={16} />
                          </ThemeIcon>
                        }
                      >
                        First Flight: {rocket.first_flight}
                      </List.Item>

                      <List.Item
                        icon={
                          <ThemeIcon color="blue" size={24} radius="xl">
                            <IconInfoCircle size={16} />
                          </ThemeIcon>
                        }
                      >
                        Company: {rocket.company}
                      </List.Item>

                      <List.Item
                        icon={
                          <ThemeIcon color="blue" size={24} radius="xl">
                            <IconInfoCircle size={16} />
                          </ThemeIcon>
                        }
                      >
                        Country: {rocket.country}
                      </List.Item>

                      <List.Item
                        icon={
                          <ThemeIcon color="blue" size={24} radius="xl">
                            <IconInfoCircle size={16} />
                          </ThemeIcon>
                        }
                      >
                        Success Rate: {rocket.success_rate_pct}%
                      </List.Item>

                      <List.Item
                        icon={
                          <ThemeIcon color="blue" size={24} radius="xl">
                            <IconInfoCircle size={16} />
                          </ThemeIcon>
                        }
                      >
                        Cost per Launch: $
                        {rocket.cost_per_launch.toLocaleString()}
                      </List.Item>
                    </List>

                    <Button
                      component="a"
                      href={rocket.wikipedia}
                      target="_blank"
                      rel="noopener noreferrer"
                      variant="light"
                      mt="xl"
                      rightIcon={<IconChevronRight size={16} />}
                      fullWidth
                    >
                      Learn more on Wikipedia
                    </Button>
                  </Card>
                </Grid.Col>

                <Grid.Col xs={12} md={6}>
                  <Card withBorder p="lg" radius="md">
                    <Title order={4} mb="md">
                      Technical Details
                    </Title>

                    <Timeline active={-1} bulletSize={24} lineWidth={2}>
                      <Timeline.Item title="Height">
                        <Text color="dimmed" size="sm">
                          {rocket.height.meters} meters / {rocket.height.feet}{" "}
                          feet
                        </Text>
                      </Timeline.Item>

                      <Timeline.Item title="Diameter">
                        <Text color="dimmed" size="sm">
                          {rocket.diameter.meters} meters /{" "}
                          {rocket.diameter.feet} feet
                        </Text>
                      </Timeline.Item>

                      <Timeline.Item title="Mass">
                        <Text color="dimmed" size="sm">
                          {rocket.mass.kg.toLocaleString()} kg /{" "}
                          {rocket.mass.lb.toLocaleString()} lb
                        </Text>
                      </Timeline.Item>

                      <Timeline.Item title="Stages">
                        <Text color="dimmed" size="sm">
                          {rocket.stages} stages with {rocket.boosters} boosters
                        </Text>
                      </Timeline.Item>
                    </Timeline>
                  </Card>
                </Grid.Col>
              </Grid>

              <Divider my="xl" />

              <Title order={4} mb="md">
                About {rocket.name}
              </Title>
              <Text>{rocket.description}</Text>

              {rocket.flickr_images.length > 0 && (
                <>
                  <Title order={4} mt="xl" mb="md">
                    Images
                  </Title>
                  <SimpleGrid
                    cols={3}
                    breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                  >
                    {rocket.flickr_images.slice(0, 3).map((image, index) => (
                      <Image
                        key={index}
                        src={image || "/placeholder.png"}
                        alt={`${rocket.name} image ${index + 1}`}
                        height={200}
                        radius="md"
                        className={classes.galleryImage}
                      />
                    ))}
                  </SimpleGrid>
                </>
              )}
            </Paper>
          ) : (
            <EmptyState
              title="Rocket information unavailable"
              description="We couldn't load the rocket details for this launch."
              primaryAction={{
                label: "Try Again",
                onClick: () => window.location.reload(),
              }}
            />
          )}
        </Tabs.Panel>

        <Tabs.Panel value="launchpad" pt="xl">
          {isLoadingLaunchpad ? (
            <Center style={{ height: 200 }}>
              <Loader />
            </Center>
          ) : launchpad ? (
            <Paper withBorder p="lg" radius="md">
              <Title order={3} mb="xs">
                {launchpad.name}
              </Title>
              <Text color="dimmed" mb="lg">
                {launchpad.full_name}
              </Text>

              <Grid>
                <Grid.Col xs={12} md={6}>
                  <Card withBorder p="lg" radius="md">
                    <Title order={4} mb="md">
                      Location
                    </Title>
                    <Group mb="md">
                      <IconMapPin size={18} />
                      <Text>
                        {launchpad.locality}, {launchpad.region}
                      </Text>
                    </Group>

                    <Text mb="md">{launchpad.details}</Text>

                    <Group position="apart" mt="xl">
                      <div>
                        <Text size="sm" color="dimmed">
                          Status
                        </Text>
                        <Badge
                          color={
                            launchpad.status === "active" ? "green" : "red"
                          }
                        >
                          {launchpad.status.charAt(0).toUpperCase() +
                            launchpad.status.slice(1)}
                        </Badge>
                      </div>

                      <div>
                        <Text size="sm" color="dimmed">
                          Launch Attempts
                        </Text>
                        <Text weight={500}>{launchpad.launch_attempts}</Text>
                      </div>

                      <div>
                        <Text size="sm" color="dimmed">
                          Launch Successes
                        </Text>
                        <Text weight={500}>{launchpad.launch_successes}</Text>
                      </div>
                    </Group>
                  </Card>
                </Grid.Col>

                <Grid.Col xs={12} md={6}>
                  {launchpad.images.large.length > 0 ? (
                    <Image
                      src={launchpad.images.large[0] || "/placeholder.png"}
                      alt={launchpad.name}
                      height={300}
                      radius="md"
                    />
                  ) : (
                    <Center
                      style={{
                        height: 300,
                        border: "1px dashed #ccc",
                        borderRadius: "8px",
                      }}
                    >
                      <Text color="dimmed">No launchpad images available</Text>
                    </Center>
                  )}

                  <Card withBorder p="md" radius="md" mt="md">
                    <Title order={5} mb="xs">
                      Success Rate
                    </Title>
                    <Progress
                      value={
                        launchpad.launch_attempts > 0
                          ? (launchpad.launch_successes /
                              launchpad.launch_attempts) *
                            100
                          : 0
                      }
                      color={
                        launchpad.launch_attempts > 0
                          ? launchpad.launch_successes /
                              launchpad.launch_attempts >
                            0.7
                            ? "green"
                            : "yellow"
                          : "gray"
                      }
                      size="xl"
                      radius="xl"
                      mb="xs"
                    />
                    <Text align="center" size="sm" color="dimmed">
                      {launchpad.launch_successes} successful launches out of{" "}
                      {launchpad.launch_attempts} attempts
                      {launchpad.launch_attempts > 0 &&
                        ` (${(
                          (launchpad.launch_successes /
                            launchpad.launch_attempts) *
                          100
                        ).toFixed(1)}%)`}
                    </Text>
                  </Card>
                </Grid.Col>
              </Grid>
            </Paper>
          ) : (
            <EmptyState
              title="Launchpad information unavailable"
              description="We couldn't load the launchpad details for this launch."
              primaryAction={{
                label: "Try Again",
                onClick: () => window.location.reload(),
              }}
            />
          )}
        </Tabs.Panel>

        {launch.crew.length > 0 && (
          <Tabs.Panel value="crew" pt="xl">
            {isLoadingCrew ? (
              <Center style={{ height: 200 }}>
                <Loader />
              </Center>
            ) : crewMembers && crewMembers.length > 0 ? (
              <>
                <Title order={3} mb="lg">
                  Mission Crew
                </Title>
                <SimpleGrid
                  cols={4}
                  breakpoints={[
                    { maxWidth: "md", cols: 3 },
                    { maxWidth: "sm", cols: 2 },
                    { maxWidth: "xs", cols: 1 },
                  ]}
                >
                  {crewMembers.map((crew) => (
                    <Card
                      key={crew.id}
                      withBorder
                      p="lg"
                      radius="md"
                      className={classes.crewCard}
                    >
                      <Card.Section>
                        <Image
                          src={crew.image || "/placeholder.png"}
                          height={200}
                          alt={crew.name}
                        />
                      </Card.Section>

                      <Title order={4} mt="md" mb="xs">
                        {crew.name}
                      </Title>
                      <Text color="dimmed" size="sm" mb="md">
                        {crew.agency}
                      </Text>

                      <Group position="apart">
                        <Badge
                          color={crew.status === "active" ? "green" : "red"}
                        >
                          {crew.status.charAt(0).toUpperCase() +
                            crew.status.slice(1)}
                        </Badge>

                        <Text size="sm" color="dimmed">
                          {crew.launches.length}{" "}
                          {crew.launches.length === 1 ? "mission" : "missions"}
                        </Text>
                      </Group>

                      <Button
                        component="a"
                        href={crew.wikipedia}
                        target="_blank"
                        rel="noopener noreferrer"
                        variant="light"
                        mt="md"
                        fullWidth
                      >
                        Wikipedia
                      </Button>
                    </Card>
                  ))}
                </SimpleGrid>
              </>
            ) : (
              <EmptyState
                title="Crew information unavailable"
                description="We couldn't load the crew details for this mission."
                primaryAction={{
                  label: "Try Again",
                  onClick: () => window.location.reload(),
                }}
              />
            )}
          </Tabs.Panel>
        )}

        {launch.payloads.length > 0 && (
          <Tabs.Panel value="payloads" pt="xl">
            {isLoadingPayloads ? (
              <Center style={{ height: 200 }}>
                <Loader />
              </Center>
            ) : payloads && payloads.length > 0 ? (
              <>
                <Title order={3} mb="lg">
                  Mission Payloads
                </Title>
                <SimpleGrid
                  cols={2}
                  breakpoints={[{ maxWidth: "sm", cols: 1 }]}
                >
                  {payloads.map((payload) => (
                    <Card key={payload.id} withBorder p="lg" radius="md">
                      <Title order={4} mb="xs">
                        {payload.name}
                      </Title>
                      <Badge mb="md">{payload.type}</Badge>

                      <Stack spacing="xs">
                        {payload.mass_kg && (
                          <Group>
                            <Text weight={500}>Mass:</Text>
                            <Text>
                              {payload.mass_kg} kg / {payload.mass_lbs} lbs
                            </Text>
                          </Group>
                        )}

                        {payload.orbit && (
                          <Group>
                            <Text weight={500}>Orbit:</Text>
                            <Text>{payload.orbit}</Text>
                          </Group>
                        )}

                        <Group>
                          <Text weight={500}>Customers:</Text>
                          <Text>{payload.customers.join(", ")}</Text>
                        </Group>
                      </Stack>
                    </Card>
                  ))}
                </SimpleGrid>
              </>
            ) : (
              <EmptyState
                title="Payload information unavailable"
                description="We couldn't load the payload details for this mission."
                primaryAction={{
                  label: "Try Again",
                  onClick: () => window.location.reload(),
                }}
              />
            )}
          </Tabs.Panel>
        )}

        {allImages.length > 0 && (
          <Tabs.Panel value="gallery" pt="xl">
            <Title order={3} mb="lg">
              Mission Gallery
            </Title>
            <SimpleGrid
              cols={3}
              breakpoints={[
                { maxWidth: "md", cols: 2 },
                { maxWidth: "sm", cols: 1 },
              ]}
            >
              {allImages.map((image, index) => (
                <Card key={index} p="xs" withBorder>
                  <Card.Section>
                    <Image
                      src={image || "/placeholder.png"}
                      height={250}
                      alt={`Mission image ${index + 1}`}
                      className={classes.galleryImage}
                    />
                  </Card.Section>
                </Card>
              ))}
            </SimpleGrid>
          </Tabs.Panel>
        )}
      </Tabs>
    </Container>
  );
};

export default LaunchDetail;
