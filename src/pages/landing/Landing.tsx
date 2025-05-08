import { type FC } from "react";
import { createStyles, rem, keyframes } from "@mantine/core";

import UpcomingLaunches from "../../components/landingPage/UpcomingLaunches";
import FeatureSection from "../../components/landingPage/featureSection";
import { StatSection } from "../../components/landingPage/StatSection";
import HeroSection from "../../components/landingPage/HeroSection";
import CallToAction from "../../components/landingPage/CallToAction";

const fadeIn = keyframes({
  from: { opacity: 0, transform: "translateY(20px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const float = keyframes({
  "0%": { transform: "translateY(0px)" },
  "50%": { transform: "translateY(-16px)" },
  "100%": { transform: "translateY(0px)" },
});

export const useStyles = createStyles((theme) => ({
  // Hero section
  hero: {
    position: "relative",
    backgroundImage:
      "url(https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1172&q=80)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    minHeight: "90vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: theme.white,
    paddingTop: rem(80),
    paddingBottom: rem(80),
    borderRadius: "10px",
    overflow: "hidden",
  },

  heroOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
  },

  heroContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    maxWidth: rem(800),
  },

  heroTitle: {
    fontSize: rem(60),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: theme.spacing.xl,
    color: theme.white,
    textShadow: "0 2px 10px rgba(0, 0, 0, 0.3)",

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(40),
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(30),
    },
  },

  heroHighlight: {
    color: theme.colors.blue[4],
    textShadow: "0 0 20px rgba(66, 133, 244, 0.7)",
  },

  heroDescription: {
    fontSize: rem(24),
    maxWidth: rem(600),
    margin: "0 auto",
    marginBottom: Number(theme.spacing.xl) * 1.5,
    color: theme.white,
    textShadow: "0 1px 5px rgba(0, 0, 0, 0.5)",

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(20),
    },

    [theme.fn.smallerThan("xs")]: {
      fontSize: rem(16),
    },
  },

  heroButtons: {
    marginTop: Number(theme.spacing.xl) * 1.5,
    display: "flex",
    justifyContent: "center",
    gap: theme.spacing.md,

    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column",
      alignItems: "center",
    },
  },

  heroButton: {
    height: rem(54),
    paddingLeft: rem(32),
    paddingRight: rem(32),
    fontSize: rem(16),
    fontWeight: 600,

    [theme.fn.smallerThan("xs")]: {
      width: "100%",
    },
  },

  scrollIndicator: {
    position: "absolute",
    bottom: rem(16),
    left: "49%",
    transform: "translateX(-50%) !important",
    zIndex: 2,
    cursor: "pointer",
    animation: `${float} 1.5s ease-in-out infinite`,
  },

  // Features section
  section: {
    padding: `${rem(80)} 0`,
  },

  sectionDark: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[6]
        : theme.colors.gray[0],
  },

  sectionTitle: {
    fontSize: rem(36),
    fontWeight: 900,
    lineHeight: 1.1,
    marginBottom: "30px",
    marginTop: "30px",
    textAlign: "center",

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(28),
    },
  },

  featureCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
    transition: "transform 200ms ease, box-shadow 200ms ease",
    boxShadow: theme.shadows.sm,

    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows.md,
    },
  },

  featureIcon: {
    marginBottom: theme.spacing.md,
    backgroundColor: theme.colors.blue[6],
    color: theme.white,
  },

  featureTitle: {
    fontSize: rem(20),
    fontWeight: 700,
    marginBottom: theme.spacing.xs,
  },

  // Launch cards
  launchCard: {
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflow: "hidden",
    transition: "transform 200ms ease, box-shadow 200ms ease",

    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows.md,
    },
  },

  launchImage: {
    height: rem(220),
    position: "relative",
  },

  launchOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundImage:
      "linear-gradient(0deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0) 100%)",
  },

  launchContent: {
    padding: theme.spacing.lg,
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  launchTitle: {
    fontSize: rem(22),
    fontWeight: 700,
    marginBottom: theme.spacing.xs,
  },

  launchBadge: {
    position: "absolute",
    top: "30px",
    right: "30px",
    zIndex: 2,
  },

  // Stats section
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
    gap: theme.spacing.xl,
  },

  statCard: {
    padding: theme.spacing.xl,
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    boxShadow: theme.shadows.sm,
    textAlign: "center",
    transition: "transform 200ms ease",

    "&:hover": {
      transform: "translateY(-5px)",
      boxShadow: theme.shadows.md,
    },
  },

  statValue: {
    fontSize: rem(36),
    fontWeight: 900,
    color: theme.colors.blue[6],
    marginBottom: theme.spacing.xs,
  },

  statLabel: {
    fontSize: rem(16),
    fontWeight: 500,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[1]
        : theme.colors.gray[6],
    textTransform: "uppercase",
  },

  // CTA section
  ctaSection: {
    borderRadius: "0.25rem",
    overflow: "hidden",
    position: "relative",
    padding: `${rem(140)} 0`,
    backgroundImage:
      "url(https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1074&q=80)",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: theme.white,
  },

  ctaOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    zIndex: 1,
  },

  ctaContent: {
    paddingLeft: "20px",
    paddingRight: "20px",
    position: "relative",
    zIndex: 2,
    textAlign: "center",
    maxWidth: rem(800),
    margin: "0 auto",
  },

  ctaTitle: {
    fontSize: rem(42),
    fontWeight: 900,
    marginBottom: theme.spacing.xl,
    color: theme.white,

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(32),
    },
  },

  ctaDescription: {
    fontSize: rem(20),
    marginBottom: Number(theme.spacing.xl) * 2,
    color: theme.white,

    [theme.fn.smallerThan("md")]: {
      fontSize: rem(16),
    },
  },

  ctaButton: {
    height: rem(54),
    paddingLeft: rem(32),
    paddingRight: rem(32),
    fontSize: rem(16),
    fontWeight: 600,
  },

  // Animation classes
  fadeIn: {
    animation: `${fadeIn} 1s ease forwards`,
  },

  fadeInDelay1: {
    animation: `${fadeIn} 1s ease 0.2s forwards`,
    opacity: 0,
  },

  fadeInDelay2: {
    animation: `${fadeIn} 1s ease 0.4s forwards`,
    opacity: 0,
  },

  fadeInDelay3: {
    animation: `${fadeIn} 1s ease 0.6s forwards`,
    opacity: 0,
  },
}));

const Landing: FC = () => {
  return (
    <>
      {/* Hero Section */}
      <HeroSection />
      {/* Features Section */}
      <FeatureSection />

      {/* Upcoming Launches Section */}
      <UpcomingLaunches />
      {/* Stats Section */}
      <StatSection />

      {/* CTA Section */}
      <CallToAction />
    </>
  );
};

export default Landing;
