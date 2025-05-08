import { Button, Text, Title } from "@mantine/core";
import { useStyles } from "../../pages/landing/Landing";
import { useAuthStore } from "../../store/app.store";
import { Link } from "react-router-dom";

const CallToAction = () => {
  const { classes, cx } = useStyles();
  const { isAuthenticated } = useAuthStore();

  return (
    <div className={classes.ctaSection}>
      <div className={classes.ctaOverlay} />
      <div className={classes.ctaContent}>
        <Title className={classes.ctaTitle}>Ready to Explore Space?</Title>
        <Text className={classes.ctaDescription}>
          Join our platform to get detailed information about SpaceX launches,
          rockets, and missions. Start your journey into space exploration
          today.
        </Text>
        <Button
          component={Link}
          to={isAuthenticated ? "/launches" : "/register"}
          size="xl"
          className={classes.ctaButton}
          variant="gradient"
          gradient={{ from: "blue", to: "cyan" }}
          style={{ marginTop: 20 }}
        >
          {isAuthenticated ? "View Launches" : "Sign Up Now"}
        </Button>
      </div>
    </div>
  );
};

export default CallToAction;
