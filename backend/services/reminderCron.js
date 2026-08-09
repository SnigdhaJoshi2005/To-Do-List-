const cron = require("node-cron");
const Task = require("../models/Task");
const Event = require("../models/Event");
const Notification = require("../models/Notification");
const { sendMail, reminderEmail } = require("./mailer");

function dateStrOf(d) {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
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

async function processTasks(today, tomorrow) {
  const tasks = await Task.find({
    done: false,
    due: { $in: [today, tomorrow] },
    reminderDates: { $ne: today },
  }).populate("user", "email username");

  for (const task of tasks) {
    let dueLabel;
    if (task.due === today) dueLabel = "due today";
    else if (task.due === tomorrow) dueLabel = "due tomorrow";
    else continue;

    await createReminder(task.user, task, {
      type: "task",
      title: task.title,
      kind: task.type === "weekly" ? "weekly quest" : "quest",
      dueDate: formatDate(task.due),
      dueLabel,
    });

    task.reminderDates = [...(task.reminderDates || []), today];
    await task.save();
  }
}

async function processEvents(today, tomorrow) {
  const events = await Event.find({
    $or: [{ date: { $in: [today, tomorrow] } }, { recurring: "yearly" }],
  }).populate("user", "email username");

  for (const event of events) {
    let triggerDate = null;
    if (event.date === today || event.date === tomorrow) {
      triggerDate = event.date;
    } else if (event.recurring === "yearly") {
      if (event.date.slice(5) === today.slice(5)) triggerDate = today;
      else if (event.date.slice(5) === tomorrow.slice(5))
        triggerDate = tomorrow;
    }
    if (!triggerDate) continue;

    const remindedDates = event.reminderDates || [];
    if (remindedDates.includes(triggerDate)) continue;

    const dueLabel =
      triggerDate === today ? "due today" : "due tomorrow";
    await createReminder(event.user, event, {
      type: "event",
      title: event.title,
      kind: "event",
      dueDate: formatDate(triggerDate),
      dueLabel,
    });

    event.reminderDates = [...remindedDates, triggerDate];
    await event.save();
  }
}

async function runReminderCheck() {
  const today = dateStrOf(new Date());
  const tomorrow = addDays(today, 1);
  try {
    await processTasks(today, tomorrow);
    await processEvents(today, tomorrow);
  } catch (err) {
    console.error("Reminder cron run failed:", err);
  }
}

function startReminderCron() {
  const every = process.env.REMINDER_CRON || "*/15 * * * *";
  cron.schedule(every, runReminderCheck);
  console.log(`Reminder cron started (${every})`);
}

module.exports = { startReminderCron, runReminderCheck };
