import type { FC } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  Header as MantineHeader,
  Group,
  Button,
  Container,
  Avatar,
  Menu,
  ActionIcon,
  useMantineColorScheme,
  Burger,
  Drawer,
  Stack,
  Divider,
  Text,
  UnstyledButton,
  Box,
  createStyles,
  rem,
} from "@mantine/core";
import {
  IconUser,
  IconLogout,
  IconHeart,
  IconRocket,
  IconSun,
  IconMoonStars,
  IconSettings,
  IconChevronDown,
} from "@tabler/icons-react";
import { useAuthStore, useUIStore } from "../store/app.store";

const useStyles = createStyles((theme) => ({
  header: {
    borderBottom: `1px solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[7] : theme.white,
  },
  logo: {
    textDecoration: "none",
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    fontWeight: 700,
    fontSize: rem(24),
    display: "flex",
    alignItems: "center",
    gap: theme.spacing.xs,

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(14),
    },
  },
  user: {
    display: "block",
    padding: theme.spacing.xs,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
  userActive: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.colors.dark[8]
        : theme.colors.gray[0],
  },
  mobileNavItem: {
    display: "block",
    width: "100%",
    padding: theme.spacing.md,
    borderRadius: theme.radius.sm,
    color: theme.colorScheme === "dark" ? theme.colors.dark[0] : theme.black,

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[8]
          : theme.colors.gray[0],
    },
  },
  hamburger: {
    [theme.fn.largerThan("md")]: {
      display: "none",
    },
  },
  desktopNav: {
    [theme.fn.smallerThan("md")]: {
      display: "none",
    },
  },
}));

const Header: FC = () => {
  const { classes, cx } = useStyles();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  const { colorScheme, toggleColorScheme } = useMantineColorScheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/login");
    closeMobileMenu();
  };

  const isDark = colorScheme === "dark";

  return (
    <MantineHeader height={70} className={classes.header}>
      <Container size="xl" h="100%">
        <Group position="apart" h="100%">
          <Group>
            <Link to="/" className={classes.logo} onClick={closeMobileMenu}>
              <IconRocket size={28} stroke={1.5} />
              <span>SpaceX Explorer</span>
            </Link>
          </Group>

          {/* Desktop Navigation */}
          <Group spacing="sm" className={classes.desktopNav}>
            {isAuthenticated ? (
              <>
                <Button
                  component={Link}
                  to="/launches"
                  variant={
                    location.pathname.includes("/launches") ? "light" : "subtle"
                  }
                  onClick={closeMobileMenu}
                >
                  Launches
                </Button>
                <Button
                  component={Link}
                  to="/favorites"
                  variant={
                    location.pathname.includes("/favorites")
                      ? "light"
                      : "subtle"
                  }
                  onClick={closeMobileMenu}
                >
                  Favorites
                </Button>
                <Menu position="bottom-end" withArrow shadow="md">
                  <Menu.Target>
                    <UnstyledButton className={classes.user}>
                      <Group spacing="xs">
                        <Avatar src={user?.avatar} radius="xl" size={34} />
                        <Box>
                          <Text
                            weight={500}
                            size="sm"
                            sx={{ lineHeight: 1 }}
                            mr={3}
                          >
                            {user?.username}
                          </Text>
                          <Text color="dimmed" size="xs">
                            {user?.email}
                          </Text>
                        </Box>
                        <IconChevronDown size={16} />
                      </Group>
                    </UnstyledButton>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item
                      icon={<IconUser size={14} />}
                      component={Link}
                      to="/profile"
                    >
                      Profile
                    </Menu.Item>
                    <Menu.Item
                      icon={<IconHeart size={14} />}
                      component={Link}
                      to="/favorites"
                    >
                      Favorites
                    </Menu.Item>

                    <Menu.Divider />
                    <Menu.Item
                      icon={
                        isDark ? (
                          <IconSun size={14} />
                        ) : (
                          <IconMoonStars size={14} />
                        )
                      }
                      onClick={() => toggleColorScheme()}
                    >
                      {isDark ? "Light mode" : "Dark mode"}
                    </Menu.Item>
                    <Menu.Divider />
                    <Menu.Item
                      color="red"
                      icon={<IconLogout size={14} />}
                      onClick={handleLogout}
                    >
                      Logout
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </>
            ) : (
              <>
                <Button
                  component={Link}
                  to="/login"
                  variant="subtle"
                  onClick={closeMobileMenu}
                >
                  Login
                </Button>
                <Button
                  component={Link}
                  to="/register"
                  variant="filled"
                  onClick={closeMobileMenu}
                >
                  Register
                </Button>
                <ActionIcon
                  variant="outline"
                  color={isDark ? "yellow" : "blue"}
                  onClick={() => toggleColorScheme()}
                  title={isDark ? "Light mode" : "Dark mode"}
                >
                  {isDark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
                </ActionIcon>
              </>
            )}
          </Group>

          {/* Mobile Menu Button */}
          <Group className={classes.hamburger}>
            <ActionIcon
              variant="outline"
              color={isDark ? "yellow" : "blue"}
              onClick={() => toggleColorScheme()}
              title={isDark ? "Light mode" : "Dark mode"}
              className="mr-2"
            >
              {isDark ? <IconSun size={18} /> : <IconMoonStars size={18} />}
            </ActionIcon>
            <Burger opened={isMobileMenuOpen} onClick={toggleMobileMenu} />
          </Group>
        </Group>
      </Container>

      {/* Mobile Navigation Drawer */}
      <Drawer
        opened={isMobileMenuOpen}
        onClose={closeMobileMenu}
        title="Menu"
        padding="xl"
        size="xs"
        position="right"
      >
        <Stack spacing="xs">
          {isAuthenticated ? (
            <>
              <Group p="md">
                <Avatar src={user?.avatar} radius="xl" size={40} />
                <Box>
                  <Text weight={500}>{user?.username}</Text>
                  <Text size="xs" color="dimmed">
                    {user?.email}
                  </Text>
                </Box>
              </Group>
              <Divider />
              <UnstyledButton
                className={classes.mobileNavItem}
                component={Link}
                to="/launches"
                onClick={closeMobileMenu}
              >
                <Group>
                  <IconRocket size={16} />
                  <Text>Launches</Text>
                </Group>
              </UnstyledButton>
              <UnstyledButton
                className={classes.mobileNavItem}
                component={Link}
                to="/favorites"
                onClick={closeMobileMenu}
              >
                <Group>
                  <IconHeart size={16} />
                  <Text>Favorites</Text>
                </Group>
              </UnstyledButton>
              <UnstyledButton
                className={classes.mobileNavItem}
                component={Link}
                to="/profile"
                onClick={closeMobileMenu}
              >
                <Group>
                  <IconUser size={16} />
                  <Text>Profile</Text>
                </Group>
              </UnstyledButton>
              <Divider />
              <UnstyledButton
                className={classes.mobileNavItem}
                onClick={handleLogout}
              >
                <Group>
                  <IconLogout size={16} />
                  <Text>Logout</Text>
                </Group>
              </UnstyledButton>
            </>
          ) : (
            <>
              <Button
                component={Link}
                to="/login"
                onClick={closeMobileMenu}
                fullWidth
              >
                Login
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="filled"
                onClick={closeMobileMenu}
                fullWidth
              >
                Register
              </Button>
            </>
          )}
        </Stack>
      </Drawer>
    </MantineHeader>
  );
};

export default Header;
