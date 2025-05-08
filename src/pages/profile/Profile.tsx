import type { FC } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Title,
  Text,
  Paper,
  Avatar,
  Group,
  Button,
  Tabs,
  TextInput,
  PasswordInput,
  Switch,
  Divider,
  Box,
  createStyles,
  rem,
} from "@mantine/core";
import { IconUser, IconLock, IconSettings } from "@tabler/icons-react";
import { useAuthStore, useUIStore } from "../../store/app.store";

const useStyles = createStyles((theme) => ({
  container: {
    paddingBottom: rem(80),
  },

  tabIcon: {
    marginRight: theme.spacing.xs,
    display: "flex",
    alignItems: "center",
  },

  section: {
    marginBottom: theme.spacing.xl,
  },
}));

const Profile: FC = () => {
  const { classes } = useStyles();
  const { user, logout, updateUserPreferences } = useAuthStore();
  const { addNotification } = useUIStore();
  const navigate = useNavigate();

  const [username, setUsername] = useState(user?.username || "");
  const [email, setEmail] = useState(user?.email || "");
  const [darkMode, setDarkMode] = useState(
    user?.preferences?.darkMode || false
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleSaveProfile = () => {
    // In a real app, this would call an API to update the user profile
    addNotification({
      message: "Profile updated successfully",
      type: "success",
    });
  };

  const handleSavePreferences = () => {
    updateUserPreferences({ darkMode });
    addNotification({
      message: "Preferences updated successfully",
      type: "success",
    });
  };

  return (
    <Container size="md" className={classes.container}>
      <Paper withBorder p="xl" radius="md" mb="xl">
        <Group>
          <Avatar src={user?.avatar} size={80} radius={80} />
          <div>
            <Title order={2}>{user?.username}</Title>
            <Text color="dimmed">{user?.email}</Text>
          </div>
        </Group>
      </Paper>

      <Tabs defaultValue="profile">
        <Tabs.List mb="xl">
          <Tabs.Tab
            value="profile"
            icon={
              <div className={classes.tabIcon}>
                <IconUser size={16} />
              </div>
            }
          >
            Profile
          </Tabs.Tab>
          <Tabs.Tab
            value="security"
            icon={
              <div className={classes.tabIcon}>
                <IconLock size={16} />
              </div>
            }
          >
            Security
          </Tabs.Tab>
          <Tabs.Tab
            value="preferences"
            icon={
              <div className={classes.tabIcon}>
                <IconSettings size={16} />
              </div>
            }
          >
            Preferences
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="profile">
          <Paper withBorder p="xl" radius="md">
            <Title order={3} mb="lg">
              Profile Information
            </Title>

            <TextInput
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.currentTarget.value)}
              mb="md"
            />

            <TextInput
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
              mb="xl"
            />

            <Group position="right">
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </Group>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="security">
          <Paper withBorder p="xl" radius="md">
            <Title order={3} mb="lg">
              Security Settings
            </Title>

            <Box mb="xl">
              <Title order={4} mb="md">
                Change Password
              </Title>
              <PasswordInput
                label="Current Password"
                placeholder="Enter your current password"
                mb="md"
              />

              <PasswordInput
                label="New Password"
                placeholder="Enter your new password"
                mb="md"
              />

              <PasswordInput
                label="Confirm New Password"
                placeholder="Confirm your new password"
                mb="md"
              />

              <Group position="right">
                <Button>Update Password</Button>
              </Group>
            </Box>

            <Divider my="xl" />

            <Box>
              <Title order={4} mb="md" color="red">
                Danger Zone
              </Title>
              <Text color="dimmed" mb="md">
                Once you delete your account, there is no going back. Please be
                certain.
              </Text>

              <Group position="apart">
                <Button color="red" variant="outline" onClick={handleLogout}>
                  Logout
                </Button>
                <Button color="red">Delete Account</Button>
              </Group>
            </Box>
          </Paper>
        </Tabs.Panel>

        <Tabs.Panel value="preferences">
          <Paper withBorder p="xl" radius="md">
            <Title order={3} mb="lg">
              User Preferences
            </Title>

            <Box mb="xl">
              <Title order={4} mb="md">
                Appearance
              </Title>

              <Switch
                label="Dark Mode"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.currentTarget.checked)}
                mb="md"
              />
            </Box>

            <Divider my="xl" />

            <Box mb="xl">
              <Title order={4} mb="md">
                Notifications
              </Title>

              <Switch label="Email Notifications" defaultChecked mb="md" />

              <Switch label="Launch Reminders" defaultChecked mb="md" />
            </Box>

            <Group position="right">
              <Button onClick={handleSavePreferences}>Save Preferences</Button>
            </Group>
          </Paper>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default Profile;
