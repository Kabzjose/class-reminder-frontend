export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    return false;
  }

  const permission = await Notification.requestPermission();
  return permission === "granted";
};
