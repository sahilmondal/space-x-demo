import { Container, Paper, Text, Title, useMantineTheme } from "@mantine/core";
import { useStyles } from "../../pages/landing/Landing";

const stats = [
  { value: "140+", label: "Successful Launches" },
  { value: "4", label: "Operational Rockets" },
  { value: "30+", label: "Astronauts Launched" },
  { value: "10+", label: "Countries Served" },
];
export const StatSection = () => {
  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  return (
    <div className={classes.section} style={{ marginBottom: "80px" }}>
      <Container size="xl">
        <Title className={classes.sectionTitle}>
          SpaceX{" "}
          <span style={{ color: theme.colors.blue[6] }}>Achievements</span>
        </Title>
        <div className={classes.statsGrid}>
          {stats.map((stat, index) => (
            <Paper key={index} className={classes.statCard} withBorder>
              <Text className={classes.statValue}>{stat.value}</Text>
              <Text className={classes.statLabel}>{stat.label}</Text>
            </Paper>
          ))}
        </div>
      </Container>
    </div>
  );
};
