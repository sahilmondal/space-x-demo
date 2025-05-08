import type { FC } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  Image,
  Text,
  Badge,
  Group,
  Button,
  ActionIcon,
  createStyles,
  rem,
  Tooltip,
} from "@mantine/core";
import {
  IconHeart,
  IconHeartFilled,
  IconCalendar,
  IconRocket,
} from "@tabler/icons-react";
import type { Launch } from "../api/spacex";
import { useFavoritesStore, useUIStore } from "../store/app.store";

const useStyles = createStyles((theme) => ({
  card: {
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "transform 200ms ease, box-shadow 200ms ease",

    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows.md,
    },
  },

  imageSection: {
    padding: theme.spacing.md,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderBottom: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
  },

  label: {
    textTransform: "uppercase",
    fontSize: theme.fontSizes.xs,
    fontWeight: 700,
  },
}));

interface LaunchCardProps {
  launch: Launch;
}

const LaunchCard: FC<LaunchCardProps> = ({ launch }) => {
  const { classes } = useStyles();
  const { isFavoriteLaunch, addFavoriteLaunch, removeFavoriteLaunch } =
    useFavoritesStore();
  const { addNotification } = useUIStore();

  const isFavorite = isFavoriteLaunch(launch.id);

  const toggleFavorite = () => {
    if (isFavorite) {
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

  return (
    <Card withBorder radius="md" p="md" className={classes.card}>
      <Card.Section className={classes.imageSection}>
        <Image
          src={launch.links.patch.small || "/placeholder.png"}
          alt={launch.name}
          width={140}
          height={140}
          fit="contain"
        />
      </Card.Section>

      <Card.Section p="md">
        <Group position="apart">
          <Text weight={500} size="md" truncate style={{ width: "70%" }}>
            {launch.name}
          </Text>
          <Tooltip
            label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <ActionIcon
              color="red"
              variant={isFavorite ? "filled" : "light"}
              onClick={toggleFavorite}
            >
              {isFavorite ? (
                <IconHeartFilled size={16} />
              ) : (
                <IconHeart size={16} />
              )}
            </ActionIcon>
          </Tooltip>
        </Group>

        <Group spacing={7} mt={5}>
          <Badge
            color={launch.upcoming ? "blue" : launch.success ? "green" : "red"}
            variant="light"
          >
            {launch.upcoming
              ? "Upcoming"
              : launch.success
              ? "Success"
              : "Failed"}
          </Badge>
          <Badge leftSection={<IconRocket size={10} />} variant="outline">
            Flight #{launch.flight_number}
          </Badge>
        </Group>

        <Group spacing="xs" mt="md">
          <IconCalendar size={14} />
          <Text size="sm" color="dimmed">
            {new Date(launch.date_utc).toLocaleDateString()}
          </Text>
        </Group>

        <Text size="sm" lineClamp={1} mt="sm" mb="md">
          {launch.details || "No details available for this mission."}
        </Text>

        <Button
          component={Link}
          to={`/launches/${launch.id}`}
          variant="light"
          color="blue"
          fullWidth
          mt="md"
          radius="md"
        >
          View Details
        </Button>
      </Card.Section>
    </Card>
  );
};

export default LaunchCard;
