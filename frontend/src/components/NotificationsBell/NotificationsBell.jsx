import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGame } from "../../context/GameStateContext";
import { IoNotifications, IoNotificationsOutline } from "react-icons/io5";
import { RiSeedlingLine } from "react-icons/ri";
import { PiFlowerLotusDuotone } from "react-icons/pi";

const variantStyles = {
  default: {
    button: "text-secondary hover:text-primary hover:bg-muted",
  },
  light: {
    button: "text-white/80 hover:text-white hover:bg-white/10",
  },
};

export default function NotificationsBell({ variant = "default" }) {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useGame();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [perm, setPerm] = useState(() =>
    typeof window !== "undefined" && "Notification" in window
      ? Notification.permission
      : "unsupported"
  );
  const toasted = useRef(new Set());
  const rootRef = useRef(null);
  const s = variantStyles[variant];

  useEffect(() => {
    if (perm !== "granted") return;
    const fresh = notifications.filter(
      (n) => !n.read && !toasted.current.has(n._id)
    );
    fresh.forEach((n) => {
      toasted.current.add(n._id);
      try {
        new Notification(n.title, {
          body: n.message || "Reminder",
        });
      } catch {}
    });
  }, [notifications, perm]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [open]);

  const enableDesktop = async () => {
    if (!("Notification" in window)) return;
    const result = await Notification.requestPermission();
    setPerm(result);
  };

  const goTo = (n) => {
    markNotificationRead(n._id);
    setOpen(false);
    navigate(n.type === "event" ? "/calendar" : "/quests");
  };

  const dateLabel = (dueDate) => {
    if (!dueDate) return "";
    const d = new Date(dueDate + "T00:00:00");
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <div className="relative shrink-0" ref={rootRef}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Notifications"
        className={`relative p-2 rounded-xl transition-colors cursor-pointer ${s.button}`}
      >
        {unreadCount > 0 ? (
          <IoNotifications className="w-5 h-5" />
        ) : (
          <IoNotificationsOutline className="w-5 h-5" />
        )}
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 rounded-full bg-coral text-white text-[10px] font-bold flex items-center justify-center">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] bg-surface border border-border/50 rounded-2xl shadow-[var(--shadow-lg)] z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border/40">
            <h3 className="text-sm font-semibold text-primary flex items-center gap-2">
              <IoNotificationsOutline className="w-4 h-4 text-accent" />
              Reminders
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllNotificationsRead}
                className="text-[11px] font-semibold text-accent hover:text-accent-hover cursor-pointer transition-colors"
              >
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[320px] overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <PiFlowerLotusDuotone className="w-8 h-8 text-dim mx-auto mb-2" />
                <p className="text-xs text-dim font-semibold">No reminders yet</p>
                <p className="text-[11px] text-secondary mt-1">
                  Set a due date on a quest or plant an event to get notified.
                </p>
              </div>
            ) : (
              notifications.map((n) => (
                <button
                  key={n._id}
                  onClick={() => goTo(n)}
                  className={`w-full text-left flex items-start gap-3 px-4 py-3 border-b border-border/30 transition-colors cursor-pointer hover:bg-muted/60 ${
                    n.read ? "" : "bg-accent/[0.05]"
                  }`}
                >
                  <span className="mt-0.5 shrink-0">
                    {n.type === "event" ? (
                      <PiFlowerLotusDuotone className="w-4 h-4 text-pink-400" />
                    ) : (
                      <RiSeedlingLine className="w-4 h-4 text-green-500" />
                    )}
                  </span>
                  <span className="flex-1 min-w-0">
                    <span
                      className={`block text-sm truncate ${
                        n.read ? "text-secondary" : "text-primary font-semibold"
                      }`}
                    >
                      {n.title}
                    </span>
                    <span className="block text-[11px] text-dim">
                      {n.message}
                      {dateLabel(n.dueDate) ? ` · ${dateLabel(n.dueDate)}` : ""}
                    </span>
                  </span>
                  {!n.read && (
                    <span className="mt-1.5 shrink-0 w-2 h-2 rounded-full bg-accent" />
                  )}
                </button>
              ))
            )}
          </div>

          {"Notification" in window && perm !== "granted" && (
            <div className="px-4 py-3 border-t border-border/40">
              {perm === "denied" ? (
                <p className="text-[11px] text-dim">
                  Desktop alerts are blocked in your browser settings.
                </p>
              ) : (
                <button
                  onClick={enableDesktop}
                  className="w-full text-[11px] font-semibold text-accent hover:text-accent-hover py-1 cursor-pointer transition-colors"
                >
                  Enable desktop alerts
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
