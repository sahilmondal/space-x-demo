import type React from "react";

import { type FC, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  TextInput,
  PasswordInput,
  Button,
  Paper,
  Title,
  Text,
  Container,
  Anchor,
  Box,
  Progress,
  Popover,
  createStyles,
  rem,
} from "@mantine/core";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useAuthStore, useUIStore } from "../../store/app.store";

const useStyles = createStyles((theme) => ({
  title: {
    fontSize: rem(26),
    fontWeight: 900,
    fontFamily: `${theme.fontFamily}`,
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

function PasswordRequirement({
  meets,
  label,
}: {
  meets: boolean;
  label: string;
}) {
  return (
    <Text
      color={meets ? "teal" : "red"}
      sx={{ display: "flex", alignItems: "center" }}
      mt={7}
      size="sm"
    >
      {meets ? <IconCheck size={14} /> : <IconX size={14} />}{" "}
      <Box ml={10}>{label}</Box>
    </Text>
  );
}

const requirements = [
  { re: /[0-9]/, label: "Includes number" },
  { re: /[a-z]/, label: "Includes lowercase letter" },
  { re: /[A-Z]/, label: "Includes uppercase letter" },
  { re: /[$&+,:;=?@#|'<>.^*()%!-]/, label: "Includes special symbol" },
];

function getStrength(password: string) {
  let multiplier = password.length > 5 ? 0 : 1;

  requirements.forEach((requirement) => {
    if (!requirement.re.test(password)) {
      multiplier += 1;
    }
  });

  return Math.max(100 - (100 / (requirements.length + 1)) * multiplier, 10);
}

const Register: FC = () => {
  const { classes } = useStyles();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [popoverOpened, setPopoverOpened] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    username?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { login, isLoading, error } = useAuthStore();
  const { addNotification } = useUIStore();
  const navigate = useNavigate();

  const validateForm = () => {
    const errors: typeof validationErrors = {};

    if (!username.trim()) {
      errors.username = "Username is required";
    }

    if (!email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid";
    }

    if (!password) {
      errors.password = "Password is required";
    } else if (password.length < 6) {
      errors.password = "Password must be at least 6 characters";
    }

    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const strength = getStrength(password);
  const color = strength === 100 ? "teal" : strength > 50 ? "yellow" : "red";
  const checks = requirements.map((requirement, index) => (
    <PasswordRequirement
      key={index}
      label={requirement.label}
      meets={requirement.re.test(password)}
    />
  ));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const success = await login(username, password);
      if (success) {
        addNotification({
          message: `Welcome to SpaceX Explorer, ${username}!`,
          type: "success",
        });
        navigate("/launches");
      }
    } catch (err) {
      console.error("Registration error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Container size={420} my={40}>
      <Title align="center" className={classes.title}>
        Create an account
      </Title>
      <Text color="dimmed" size="sm" align="center" mt={5}>
        Already have an account?{" "}
        <Anchor size="sm" component={Link} to="/login">
          Sign in
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

          <TextInput
            label="Email"
            placeholder="your.email@example.com"
            required
            mt="md"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (validationErrors.email) {
                setValidationErrors({ ...validationErrors, email: undefined });
              }
            }}
            error={validationErrors.email}
            disabled={isLoading}
            classNames={{
              input: validationErrors.email ? classes.invalidInput : "",
            }}
          />

          <Popover
            opened={popoverOpened}
            position="bottom"
            width="target"
            transitionProps={{ transition: "pop" }}
          >
            <Popover.Target>
              <div
                onFocusCapture={() => setPopoverOpened(true)}
                onBlurCapture={() => setPopoverOpened(false)}
              >
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
                    input: validationErrors.password
                      ? classes.invalidInput
                      : "",
                  }}
                />
              </div>
            </Popover.Target>
            <Popover.Dropdown>
              <Progress color={color} value={strength} size={5} mb="xs" />
              <PasswordRequirement
                label="Includes at least 6 characters"
                meets={password.length > 5}
              />
              {checks}
            </Popover.Dropdown>
          </Popover>

          <PasswordInput
            label="Confirm Password"
            placeholder="Confirm your password"
            required
            mt="md"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              if (validationErrors.confirmPassword) {
                setValidationErrors({
                  ...validationErrors,
                  confirmPassword: undefined,
                });
              }
            }}
            error={validationErrors.confirmPassword}
            disabled={isLoading}
            classNames={{
              input: validationErrors.confirmPassword
                ? classes.invalidInput
                : "",
            }}
          />

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
            Register
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

export default Register;
