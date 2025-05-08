import {
  Button,
  Container,
  Text,
  Title,
  Transition,
  useMantineTheme,
} from "@mantine/core";
import { useStyles } from "../../pages/landing/Landing";
import { IconArrowDown } from "@tabler/icons-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useAuthStore } from "../../store/app.store";

const HeroSection = () => {
  const [mounted, setMounted] = useState(false);

  const theme = useMantineTheme();
  const { classes, cx } = useStyles();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToFeatures = () => {
    const featuresSection = document.getElementById("features-section");
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: "smooth" });
    }
  };
  return (
    <div className={classes.hero}>
      <div className={classes.heroOverlay} />
      <Container className={classes.heroContent}>
        <Transition mounted={mounted} transition="fade" duration={800}>
          {(styles) => (
            <div style={styles}>
              <Title className={classes.heroTitle}>
                Discover the{" "}
                <span className={classes.heroHighlight}>Universe</span> of
                SpaceX
              </Title>
              <Text className={classes.heroDescription}>
                Explore detailed information about SpaceX launches, rockets, and
                missions in one comprehensive platform
              </Text>
              <div
                className={classes.heroButtons}
                style={{ marginTop: "40px" }}
              >
                <Button
                  component={Link}
                  to={isAuthenticated ? "/launches?page=2" : "/login"}
                  size="xl"
                  className={classes.heroButton}
                  variant="gradient"
                  gradient={{ from: "blue", to: "cyan" }}
                >
                  {isAuthenticated ? "View Launches" : "Get Started"}
                </Button>
                <Button
                  component={Link}
                  to={isAuthenticated ? "/favorites" : "/register"}
                  size="xl"
                  variant="outline"
                  color="gray.0"
                  className={classes.heroButton}
                >
                  {isAuthenticated ? "My Favorites" : "Create Account"}
                </Button>
              </div>
            </div>
          )}
        </Transition>
      </Container>
      <IconArrowDown
        size={32}
        color={theme.white}
        stroke={1.5}
        className={classes.scrollIndicator}
        onClick={scrollToFeatures}
      />
    </div>
  );
};

export default HeroSection;
