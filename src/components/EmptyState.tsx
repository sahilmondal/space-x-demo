import type { FC, ReactNode } from "react";
import { Text, Button, Group, Paper, createStyles, rem } from "@mantine/core";

const useStyles = createStyles((theme) => ({
  root: {
    padding: Number(theme.spacing.xl) * 1.5,
    borderRadius: theme.radius.md,
    backgroundColor:
      theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
  },

  label: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: rem(220),
    lineHeight: 1,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    color:
      theme.colorScheme === "dark"
        ? theme.colors.dark[4]
        : theme.colors.gray[2],

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(120),
    },
  },

  title: {
    textAlign: "center",
    fontWeight: 900,
    fontSize: rem(32),

    [theme.fn.smallerThan("sm")]: {
      fontSize: rem(24),
    },
  },

  description: {
    maxWidth: rem(500),
    margin: "auto",
    marginTop: theme.spacing.xl,
    marginBottom: `calc(${theme.spacing.xl} * 1.5)`,
    textAlign: "center",
  },
}));

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  primaryAction?: {
    label: string;
    onClick: () => void;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
}

const EmptyState: FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  primaryAction,
  secondaryAction,
}) => {
  const { classes } = useStyles();

  return (
    <Paper withBorder p="xl" radius="md" className={classes.root}>
      {icon && <div className={classes.label}>{icon}</div>}
      <Text className={classes.title}>{title}</Text>
      <Text color="dimmed" size="lg" className={classes.description}>
        {description}
      </Text>
      <Group position="center">
        {primaryAction && (
          <Button variant="filled" size="md" onClick={primaryAction.onClick}>
            {primaryAction.label}
          </Button>
        )}
        {secondaryAction && (
          <Button variant="subtle" size="md" onClick={secondaryAction.onClick}>
            {secondaryAction.label}
          </Button>
        )}
      </Group>
    </Paper>
  );
};

export default EmptyState;
