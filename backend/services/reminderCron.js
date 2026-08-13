const cron = require("node-cron");
const Task = require("../models/Task");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const { sendMail, reminderEmail } = require("./mailer");

function dateStrOf(d) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: process.env.REMINDER_TIMEZONE || "UTC",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(d);
  const part = (type) => parts.find((value) => value.type === type).value;
  return `${part("year")}-${part("month")}-${part("day")}`;
}

function addDays(dateStr, n) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  d.setUTCDate(d.getUTCDate() + n);
  return dateStrOf(d);
}

function formatDate(dateStr) {
  const d = new Date(`${dateStr}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

async function createReminder(user, item, { type, title, kind, dueDate, dueLabel }) {
  if (!user) return;

  await Notification.create({
    user: user._id,
    type,
    refId: item._id,
    title,
    message: `This ${kind} is ${dueLabel}`,
    dueDate,
  });

  if (user.email) {
    try {
      await sendMail({
        to: user.email,
        subject: `🌿 Questify: "${title}" is ${dueLabel}`,
        html: reminderEmail({ title, kind, dueDate, dueLabel }),
      });
    } catch (err) {
      console.error(`Reminder email failed for ${user.email}:`, err);
    }
  }
}

async function processTasks(tomorrow) {
  const weeklyExpiryStart = addDays(tomorrow, -7);
  const tasks = await Task.find({
    done: false,
    type: "weekly",
    $or: [
      { due: tomorrow },
      { due: "", localDay: weeklyExpiryStart },
    ],
    reminderDates: { $ne: tomorrow },
  }).populate("user", "email username");

  for (const task of tasks) {
    await createReminder(task.user, task, {
      type: "task",
      title: task.title,
      kind: "weekly quest",
      dueDate: formatDate(task.due || tomorrow),
      dueLabel: "due tomorrow",
    });

    task.reminderDates = [...(task.reminderDates || []), tomorrow];
    await task.save();
  }
}

async function processEvents(tomorrow) {
  const events = await Event.find({
    $or: [{ date: tomorrow }, { recurring: "yearly" }],
  }).populate("user", "email username");

  for (const event of events) {
    const isTomorrow =
      event.date === tomorrow ||
      (event.recurring === "yearly" && event.date.slice(5) === tomorrow.slice(5));
    if (!isTomorrow) continue;

    const remindedDates = event.reminderDates || [];
    if (remindedDates.includes(tomorrow)) continue;

    await createReminder(event.user, event, {
      type: "event",
      title: event.title,
      kind: "event",
      dueDate: formatDate(tomorrow),
      dueLabel: "tomorrow",
    });

    event.reminderDates = [...remindedDates, tomorrow];
    await event.save();
  }
}

async function runReminderCheck() {
  const today = dateStrOf(new Date());
  const tomorrow = addDays(today, 1);
  try {
    await processTasks(tomorrow);
    await processEvents(tomorrow);
  } catch (err) {
    console.error("Reminder cron run failed:", err);
  }
}

function startReminderCron() {
  const schedule = process.env.REMINDER_CRON || "0 9 * * *";
  const timezone = process.env.REMINDER_TIMEZONE || "UTC";
  cron.schedule(schedule, runReminderCheck, { timezone });
  console.log(`Reminder cron started (${schedule}, ${timezone})`);
}

module.exports = { startReminderCron, runReminderCheck };
