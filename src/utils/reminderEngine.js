import { getClasses, updateClass } from "./storage";

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export const startReminderEngine = () => {
  setInterval(async () => {
    const now = new Date();
    const today = DAYS[now.getDay()];
    const currentTime = now.getTime();
    const todayDate = now.toISOString().split("T")[0];

    try {
      const classes = await getClasses();

      for (const c of classes) {
        // Skip if class doesn't happen today
        if (!c.days.includes(today)) continue;

        // Skip if already notified today
        if (c.lastNotifiedDate === todayDate) continue;

        const [hours, minutes] = c.startTime.split(":");
        const classStart = new Date(now);
        classStart.setHours(hours, minutes, 0, 0);

        const reminderTime =
          classStart.getTime() - c.reminderMinutes * 60 * 1000;

        // Check if it's time to send reminder
        if (currentTime >= reminderTime && currentTime < classStart.getTime()) {
          // Send notification
          new Notification("Class Reminder 🔔", {
            body: `${c.name} starts at ${c.startTime} in ${c.venue || 'your classroom'}`,
            icon: '📚', // Optional: add an icon
            requireInteraction: true, // Keeps notification visible until user interacts
          });

          // Update this class's lastNotifiedDate via API
          try {
            await updateClass({
              ...c,
              lastNotifiedDate: todayDate
            });
            console.log(`✅ Reminder sent for ${c.name}`);
          } catch (error) {
            console.error(`Failed to update notification status for ${c.name}:`, error);
          }
        }
      }
    } catch (error) {
      console.error('Error in reminder engine:', error);
    }
  }, 60 * 1000); // check every minute
};