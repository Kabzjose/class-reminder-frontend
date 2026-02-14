export const requestNotificationPermission = async () => {
  if (!("Notification" in window)) {
    console.log("This browser does not support notifications");
    return false;
  }

  // Check if permission is already granted
  if (Notification.permission === "granted") {
    console.log("Notification permission already granted");
    return true;
  }

  // Check if permission is denied
  if (Notification.permission === "denied") {
    console.log("Notification permission was denied");
    alert("Notifications are blocked. Please enable them in your browser settings to receive class reminders.");
    return false;
  }

  // Request permission
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log("Notification permission granted");
      // Optional: Send a test notification
      new Notification("Notifications Enabled!", {
        body: "You'll now receive reminders for your classes",
        tag: "permission-granted"
      });
      return true;
    } else {
      console.log("Notification permission denied");
      return false;
    }
  } catch (error) {
    console.error("Error requesting notification permission:", error);
    return false;
  }
};