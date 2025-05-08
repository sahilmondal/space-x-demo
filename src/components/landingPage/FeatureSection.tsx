import {
  Card,
  Container,
  SimpleGrid,
  Text,
  ThemeIcon,
  Title,
  useMantineTheme,
} from "@mantine/core";
import {
  IconRocket,
  IconSatellite,
  IconUsers,
  IconWorld,
} from "@tabler/icons-react";
import { useStyles } from "../../pages/landing/Landing";
const features = [
  {
    icon: IconRocket,
    title: "Explore SpaceX Launches",
    description:
      "Browse through all SpaceX launches with detailed information about each mission, including launch dates, outcomes, and media.",
  },
  {
    icon: IconSatellite,
    title: "Rocket Specifications",
    description:
      "Get comprehensive details about the rockets used in each launch, including technical specifications, performance data, and history.",
  },
  {
    icon: IconUsers,
    title: "Crew Information",
    description:
      "Learn about the astronauts who participated in SpaceX missions, their backgrounds, experience, and roles in each mission.",
  },
  {
    icon: IconWorld,
    title: "Launch Locations",
    description:
      "Discover the various launchpads used for SpaceX missions around the world, with details about their facilities and launch history.",
  },
];
const FeatureSection = () => {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  return (
    <div className={classes.section} id="features-section">
      <Container size="xl">
        <Title className={classes.sectionTitle}>
          Explore the{" "}
          <span style={{ color: theme.colors.blue[6] }}>Features</span>
        </Title>
        <SimpleGrid
          cols={4}
          spacing="xl"
          breakpoints={[
            { maxWidth: "md", cols: 2 },
            { maxWidth: "xs", cols: 1 },
          ]}
        >
          {features.map((feature, index) => (
            <Card
              key={index}
              className={classes.featureCard}
              shadow="sm"
              p="lg"
              radius="md"
              withBorder
            >
              <ThemeIcon size={60} radius="md" className={classes.featureIcon}>
                <feature.icon size={30} stroke={1.5} />
              </ThemeIcon>
              <Text className={classes.featureTitle}>{feature.title}</Text>
              <Text size="sm" color="dimmed" style={{ flex: 1 }}>
                {feature.description}
              </Text>
            </Card>
          ))}
        </SimpleGrid>
      </Container>
    </div>
  );
};

export default FeatureSection;
