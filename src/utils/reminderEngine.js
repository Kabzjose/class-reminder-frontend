import { getClasses, updateClass } from "./storage";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

let reminderInterval = null;

export const startReminderEngine = () => {
  // Prevent multiple instances
  if (reminderInterval) {
    console.log('⚠️ Reminder engine already running');
    return;
  }

  console.log('🔔 Reminder engine started');
  
  // Run immediately on start
  checkForReminders();
  
  // Then run every minute
  reminderInterval = setInterval(checkForReminders, 60 * 1000);
};

export const stopReminderEngine = () => {
  if (reminderInterval) {
    clearInterval(reminderInterval);
    reminderInterval = null;
    console.log('🔕 Reminder engine stopped');
  }
};

const checkForReminders = async () => {
  // Check if notifications are permitted
  if (Notification.permission !== 'granted') {
    console.log('Notifications not permitted');
    return;
  }

  const now = new Date();
  const today = DAYS[now.getDay()];
  const currentTime = now.getTime();
  const todayDate = now.toISOString().split("T")[0];

  try {
    const classes = await getClasses();

    for (const c of classes) {
      // Skip if class doesn't happen today
      if (!c.days || !c.days.includes(today)) continue;

      // Skip if already notified today
      if (c.lastNotifiedDate === todayDate) continue;

      // Parse class start time
      const [hours, minutes] = c.startTime.split(":");
      const classStart = new Date(now);
      classStart.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      // Calculate reminder time
      const reminderMinutes = c.reminderMinutes || 15; // Default to 15 minutes
      const reminderTime = classStart.getTime() - reminderMinutes * 60 * 1000;

      // Check if it's time to send reminder
      if (currentTime >= reminderTime && currentTime < classStart.getTime()) {
        try {
          // Send notification
          const notification = new Notification("Class Reminder", {
            body: `${c.name} starts at ${c.startTime}${c.venue ? ` in ${c.venue}` : ''}`,
            tag: c._id || c.id, // Prevents duplicate notifications
            requireInteraction: false,
            silent: false,
          });

          // Click handler to focus the app
          notification.onclick = () => {
            window.focus();
            notification.close();
          };

          // Update lastNotifiedDate
          await updateClass({
            ...c,
            lastNotifiedDate: todayDate
          });
          
          console.log(`✅ Reminder sent for ${c.name} at ${new Date().toLocaleTimeString()}`);
        } catch (notificationError) {
          console.error(`Failed to send notification for ${c.name}:`, notificationError);
        }
      }
    }
  } catch (error) {
    console.error('Error checking for reminders:', error);
  }
};