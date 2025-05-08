import {
  Badge,
  Button,
  Card,
  Center,
  Container,
  Group,
  Image,
  Loader,
  SimpleGrid,
  Text,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconArrowRight,
  IconCalendar,
  IconChevronRight,
} from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { fetchLaunches, Launch } from "../../api/spacex";
import { useAuthStore } from "../../store/app.store";
import { useStyles } from "../../pages/landing/Landing";
import { Link } from "react-router-dom";

interface SimpleLaunch {
  id: string;
  title: string;
  date: string;
  image: string;
}
const ownImages = [
  "https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",

  "https://images.unsplash.com/photo-1457364559154-aa2644600ebb?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",

  "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80",
];

const UpcomingLaunches = () => {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const { isAuthenticated } = useAuthStore();
  const [launches, setLaunches] = useState<SimpleLaunch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadLaunches = async () => {
      try {
        const allLaunches = await fetchLaunches();
        const upcomingLaunches = allLaunches
          .filter((launch) => launch.upcoming)
          .slice(0, 3)
          .map((launch, i) => ({
            id: launch.id,
            title: launch.name,
            date: new Date(launch.date_utc).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
            }),
            image: ownImages[i],
          }));
        setLaunches(upcomingLaunches);
      } catch (error) {
        console.error("Error fetching launches:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLaunches();
  }, []);

  if (loading) {
    return (
      <div className={cx(classes.section, classes.sectionDark)}>
        <Container size="xl">
          <Title className={classes.sectionTitle}>
            Upcoming{" "}
            <span style={{ color: theme.colors.blue[6] }}>Launches</span>
          </Title>
          <Center style={{ minHeight: "300px" }}>
            <Loader size="xl" variant="dots" />
          </Center>
        </Container>
      </div>
    );
  }

  return (
    <div className={cx(classes.section, classes.sectionDark)}>
      <Container size="xl">
        <Title className={classes.sectionTitle}>
          Upcoming <span style={{ color: theme.colors.blue[6] }}>Launches</span>
        </Title>
        <SimpleGrid
          cols={3}
          spacing="xl"
          breakpoints={[
            { maxWidth: "md", cols: 2 },
            { maxWidth: "xs", cols: 1 },
          ]}
        >
          {launches.map((launch) => (
            <Card
              key={launch.id}
              className={classes.launchCard}
              shadow="sm"
              p={0}
              radius="md"
              withBorder
            >
              <Card.Section className={classes.launchImage}>
                <Image src={launch.image} height={220} alt={launch.title} />
                <div className={classes.launchOverlay} />
                <Badge size="lg" color="blue" className={classes.launchBadge}>
                  Upcoming
                </Badge>
              </Card.Section>
              <div className={classes.launchContent}>
                <Text className={classes.launchTitle}>{launch.title}</Text>
                <Group spacing="xs" mb="md">
                  <IconCalendar size={16} color={theme.colors.gray[6]} />
                  <Text size="sm" color="dimmed">
                    {launch.date}
                  </Text>
                </Group>
                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="auto"
                  component={Link}
                  to={isAuthenticated ? `/launches/${launch.id}` : "/login"}
                  rightIcon={<IconChevronRight size={16} />}
                >
                  Learn More
                </Button>
              </div>
            </Card>
          ))}
        </SimpleGrid>
        <Center mt={40}>
          <Button
            component={Link}
            to={isAuthenticated ? "/launches" : "/login"}
            variant="subtle"
            rightIcon={<IconArrowRight size={16} />}
            size="lg"
          >
            View All Launches
          </Button>
        </Center>
      </Container>
    </div>
  );
};

export default UpcomingLaunches;
