import { FC } from "react";
import { Link } from "react-router-dom";
import {
  Container,
  Group,
  ActionIcon,
  Text,
  Anchor,
  Box,
  SimpleGrid,
  Stack,
  Divider,
} from "@mantine/core";
import {
  IconBrandTwitter,
  IconBrandYoutube,
  IconBrandInstagram,
  IconRocket,
} from "@tabler/icons-react";

const footerLinks = [
  {
    title: "Explore",
    links: [
      { label: "Launches", link: "/launches" },
      { label: "Rockets", link: "/rockets" },
      { label: "Crew", link: "/crew" },
      { label: "Launchpads", link: "/launchpads" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", link: "/about" },
      { label: "Contact", link: "/contact" },
      { label: "Careers", link: "/careers" },
      { label: "Press", link: "/press" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Terms of Service", link: "/terms" },
      { label: "Privacy Policy", link: "/privacy" },
      { label: "Cookie Policy", link: "/cookies" },
    ],
  },
];

const Footer: FC = () => {
  return (
    <Box
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme === "dark"
            ? theme.colors.dark[6]
            : theme.colors.gray[0],
        borderTop: `1px solid ${
          theme.colorScheme === "dark"
            ? theme.colors.dark[5]
            : theme.colors.gray[2]
        }`,
        marginTop: 120,
        paddingTop: Number(theme.spacing.xl) * 2,
        paddingBottom: theme.spacing.xl,
      })}
    >
      <Container style={{ paddingTop: "2rem" }}>
        {/* Logo and description */}
        <Group mb={50} position="center">
          <IconRocket size={28} stroke={1.5} />
          <Text size="xl" weight={700}>
            SpaceX Explorer
          </Text>
        </Group>
        <Text size="sm" color="dimmed" align="center" mb={50}>
          Explore the universe of SpaceX launches, rockets, and missions
        </Text>

        {/* Footer links */}
        <SimpleGrid
          cols={3}
          breakpoints={[{ maxWidth: "sm", cols: 1 }]}
          spacing={50}
        >
          {footerLinks.map((group) => (
            <Stack key={group.title} spacing="xs">
              <Text weight={700}>{group.title}</Text>
              {group.links.map((link, index) => (
                <Anchor
                  component={Link}
                  to={link.link}
                  key={index}
                  size="sm"
                  color="dimmed"
                >
                  {link.label}
                </Anchor>
              ))}
            </Stack>
          ))}
        </SimpleGrid>

        <Divider my={30} />

        {/* Bottom section */}
        <Group
          position="apart"
          sx={(theme) => ({
            [theme.fn.smallerThan("sm")]: {
              flexDirection: "column",
              alignItems: "center",
              gap: theme.spacing.sm,
            },
          })}
        >
          <Text color="dimmed" size="sm">
            © {new Date().getFullYear()} Sahil Mondal. All rights reserved.
          </Text>

          <Group spacing={10}>
            <ActionIcon size="md">
              <IconBrandTwitter size="1.05rem" stroke={1.5} />
            </ActionIcon>
            <ActionIcon size="md">
              <IconBrandYoutube size="1.05rem" stroke={1.5} />
            </ActionIcon>
            <ActionIcon size="md">
              <IconBrandInstagram size="1.05rem" stroke={1.5} />
            </ActionIcon>
          </Group>
        </Group>
      </Container>
    </Box>
  );
};

export default Footer;
