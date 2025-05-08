import type React from "react";

import { type FC, useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Anchor,
  Checkbox,
  Group,
  Divider,
  Box,
  rem,
  createStyles,
} from "@mantine/core";
import { useAuthStore, useUIStore } from "../../store/app.store";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(26),
    fontWeight: 900,
    fontFamily: `${theme.fontFamily}`,
  },

  controls: {
    [theme.fn.smallerThan("xs")]: {
      flexDirection: "column-reverse",
    },
  },

  control: {
    [theme.fn.smallerThan("xs")]: {
      width: "100%",
      textAlign: "center",
    },
  },

  invalidInput: {
    borderColor: theme.colors.red[6],
  },

  socialButton: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.radius.sm,
    border: `${rem(1)} solid ${
      theme.colorScheme === "dark" ? theme.colors.dark[4] : theme.colors.gray[3]
    }`,
    padding: `${rem(8)} ${rem(16)}`,
    color: theme.colorScheme === "dark" ? theme.white : theme.black,
    transition: "background-color 150ms ease, border-color 150ms ease",

    "&:hover": {
      backgroundColor:
        theme.colorScheme === "dark"
          ? theme.colors.dark[5]
          : theme.colors.gray[0],
    },
  },
}));

const Login: FC = () => {
  const { classes } = useStyles();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  const { login, isLoading, error, clearError } = useAuthStore();
  const { addNotification } = useUIStore();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/launches?page=2";

  useEffect(() => {
    clearError();
  }, [clearError]);

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(username, password, rememberMe);
      if (success) {
        addNotification({
          message: `Welcome back, ${username}!`,
          type: "success",
        });
        navigate(from);
      }
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" className={classes.title}>
        Welcome back!
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Don't have an account yet?{" "}
        <Anchor size="sm" component={Link} to="/register">
          Create account
        </Anchor>
      </Text>

      <Paper withBorder shadow="md" p={30} mt={30} radius="md">
        <form onSubmit={handleSubmit}>
          <TextInput
            label="Username"
            placeholder="Your username"
            required
            value={username}
            onChange={(e) => {
              setUsername(e.target.value);
              if (validationErrors.username) {
                setValidationErrors({
                  ...validationErrors,
                  username: undefined,
                });
              }
            }}
            error={validationErrors.username}
            disabled={isLoading}
            classNames={{
              input: validationErrors.username ? classes.invalidInput : "",
            }}
          />

          <PasswordInput
            label="Password"
            placeholder="Your password"
            required
            mt="md"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (validationErrors.password) {
                setValidationErrors({
                  ...validationErrors,
                  password: undefined,
                });
              }
            }}
            error={validationErrors.password}
            disabled={isLoading}
            classNames={{
              input: validationErrors.password ? classes.invalidInput : "",
            }}
          />

          <Group position="apart" mt="lg">
            <Checkbox
              label="Remember me"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.currentTarget.checked)}
            />
            <Anchor component={Link} to="/forgot-password" size="sm">
              Forgot password?
            </Anchor>
          </Group>

          {error && (
            <Text color="red" size="sm" mt="sm">
              {error}
            </Text>
          )}

          <Button
            fullWidth
            mt="xl"
            type="submit"
            loading={isLoading || isSubmitting}
          >
            Sign in
          </Button>

          <Text color="dimmed" size="xs" align="center" mt={5}>
            By continuing, you agree to our{" "}
            <Anchor size="xs" component={Link} to="/terms">
              Terms of Service
            </Anchor>{" "}
            and{" "}
            <Anchor size="xs" component={Link} to="/privacy">
              Privacy Policy
            </Anchor>
            .
          </Text>
        </form>
      </Paper>
    </Container>
  );
};

export default Login;
