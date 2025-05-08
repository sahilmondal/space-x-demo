import { useEffect } from "react";
import { Notification, Group } from "@mantine/core";
import {
  IconCheck,
  IconX,
  IconInfoCircle,
  IconAlertTriangle,
} from "@tabler/icons-react";
import { useUIStore } from "../store/app.store";

const NotificationIcons = {
  success: <IconCheck size={20} />,
  error: <IconX size={20} />,
  info: <IconInfoCircle size={20} />,
  warning: <IconAlertTriangle size={20} />,
};

const NotificationColors = {
  success: "green",
  error: "red",
  info: "blue",
  warning: "yellow",
};

const Notifications = () => {
  const { notifications, removeNotification } = useUIStore();

  useEffect(() => {
    // Auto-remove notifications after their timeout (default: 4000ms)
    notifications.forEach((notification) => {
      const timeout = notification.timeout || 4000;
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, timeout);

      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  if (notifications.length === 0) return null;

  return (
    <Group
      style={{
        maxWidth: "350px",
        width: "100%",
        position: "fixed",
        top: "20px",
        right: "20px",
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "8px",
      }}
    >
      {notifications.map((notification) => (
        <Notification
          key={notification.id}
          title={
            notification.type.charAt(0).toUpperCase() +
            notification.type.slice(1)
          }
          icon={NotificationIcons[notification.type]}
          color={NotificationColors[notification.type]}
          onClose={() => removeNotification(notification.id)}
          withCloseButton
        >
          {notification.message}
        </Notification>
      ))}
    </Group>
  );
};

export default Notifications;
