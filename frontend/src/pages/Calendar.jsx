import { useState, useMemo } from "react";
import { useGame } from "../context/GameStateContext";
import Button from "../components/Button/Button";
import { useTheme } from "./ThemeContext";

const COLOR_HEX = { mint: "#8FD9BE", sky: "#8FCBE0", pink: "#E8A7C2", lavender: "#C3A9EE" };
const COLOR_EMOJI = { mint: "🌱", sky: "💧", pink: "🌸", lavender: "🌿" };

export default function Calendar() {
  const { events, addEvent, deleteEvent } = useGame();
  const { theme } = useTheme();
  const [viewDate, setViewDate] = useState(new Date());
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDayModal, setShowDayModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [formTitle, setFormTitle] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formTime, setFormTime] = useState("");
  const [chosenColor, setChosenColor] = useState("mint");

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const title = viewDate.toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const todayStr = new Date().toISOString().slice(0, 10);

  const calendarDays = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push({ empty: true, key: `empty-${i}` });
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push({ day: d, dateStr, key: dateStr, isToday: dateStr === todayStr, events: events.filter((e) => e.date === dateStr) });
    }
    return days;
  }, [year, month, events, todayStr]);

  const upcoming = useMemo(() => {
    return events
      .filter((e) => e.date >= todayStr)
      .sort((a, b) => (a.date + (a.time || "")).localeCompare(b.date + (b.time || "")))
      .slice(0, 6);
  }, [events, todayStr]);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date());

  const handleDayClick = (cell) => {
    if (cell.events.length > 0) {
      setSelectedDay({ dateStr: cell.dateStr, day: cell.day, events: cell.events });
      setShowDayModal(true);
    } else {
      openAddModal(cell.dateStr);
    }
  };

  const openAddModal = (dateStr) => {
    setEditingEvent(null);
    setFormDate(dateStr || todayStr);
    setFormTitle("");
    setFormTime("");
    setChosenColor("mint");
    setShowAddModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormDate(event.date);
    setFormTitle(event.title);
    setFormTime(event.time || "");
    setChosenColor(event.color || "mint");
    setShowDayModal(false);
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;
    if (editingEvent) {
      deleteEvent(editingEvent._id);
    }
    addEvent({ title: formTitle.trim(), date: formDate, time: formTime, color: chosenColor });
    setShowAddModal(false);
    setEditingEvent(null);
  };

  const handleDelete = (eventId) => {
    deleteEvent(eventId);
    if (selectedDay) {
      const remaining = selectedDay.events.filter((ev) => ev._id !== eventId);
      if (remaining.length === 0) {
        setShowDayModal(false);
        setSelectedDay(null);
      } else {
        setSelectedDay((prev) => ({ ...prev, events: remaining }));
      }
    }
  };

  const formattedDayDate = (dateStr) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
  };

  return (
    <div className="py-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
      {/* Month Navigation */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-surface hover:bg-muted transition-colors border border-border/50 cursor-pointer">
            <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 6-6 6 6 6" /></svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-primary min-w-[180px] text-center flex items-center gap-2">
            <span>🌿</span> {title} <span>🌿</span>
          </h1>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-surface hover:bg-muted transition-colors border border-border/50 cursor-pointer">
            <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6" /></svg>
          </button>
        </div>
        <Button variant="ghost" size="sm" onClick={goToday}>🌱 Today</Button>
      </div>

      {/* Calendar Grid */}
      <div className="bg-surface border border-border/40 rounded-[var(--radius-xl)] p-4 sm:p-6 max-w-lg mx-auto" style={{ animation: "fadeIn 0.4s ease-out", animationDelay: "0.05s" }}>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-dim py-1">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-2">
          {calendarDays.map((cell) =>
            cell.empty ? (
              <div key={cell.key} className="aspect-square" />
            ) : (
              <button
                key={cell.key}
                onClick={() => handleDayClick(cell)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-start p-1.5 text-sm cursor-pointer transition-all duration-200 border-none ${
                  cell.isToday
                    ? "bg-gradient-to-br from-accent/20 to-accent-alt/20 font-semibold text-primary ring-2 ring-accent/30"
                    : cell.events.length > 0
                      ? "bg-muted/80 hover:bg-muted text-secondary"
                      : "bg-surface hover:bg-muted text-secondary"
                }`}
              >
                <span className="flex items-center gap-0.5">
                  {cell.isToday && <span className="text-[10px]">🌱</span>}
                  {cell.day}
                </span>
                <div className="flex gap-0.5 mt-0.5 flex-wrap justify-center">
                  {cell.events.slice(0, 3).map((ev, i) => (
                    <span key={i} className="text-[8px] leading-none">{COLOR_EMOJI[ev.color] || "🌱"}</span>
                  ))}
                  {cell.events.length > 3 && (
                    <span className="text-[8px] text-dim leading-none">+{cell.events.length - 3}</span>
                  )}
                </div>
              </button>
            )
          )}
        </div>
      </div>

      {/* Upcoming Events */}
      <section className="bg-surface border border-border/40 rounded-[var(--radius-xl)] p-6 mt-6" style={{ animation: "fadeIn 0.4s ease-out", animationDelay: "0.1s" }}>
        <h2 className="font-semibold text-primary mb-4 flex items-center gap-2">
          <span>🌻</span> Upcoming
        </h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-dim text-center py-6">No events scheduled — click a day to plant one 🌱</p>
        ) : (
          <div className="flex flex-col gap-2">
            {upcoming.map((ev) => (
              <div key={ev._id} className="flex items-center gap-3 bg-muted/50 rounded-2xl px-4 py-3">
                <span className="text-base">{COLOR_EMOJI[ev.color] || "🌱"}</span>
                <span className="flex-1 text-sm text-primary">{ev.title}</span>
                <span className="text-xs text-dim">{ev.date}{ev.time ? ` · ${ev.time}` : ""}</span>
                <button onClick={() => handleDelete(ev._id)} className="text-dim hover:text-rose-400 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Day View Modal */}
      {showDayModal && selectedDay && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm p-4" onClick={() => { setShowDayModal(false); setSelectedDay(null); }}>
          <div className="bg-surface rounded-[var(--radius-xl)] p-6 sm:p-7 w-full max-w-sm shadow-[var(--shadow-lg)] border border-border/50 max-h-[80vh] flex flex-col" onClick={(e) => e.stopPropagation()} style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center gap-2 mb-1">
              <span>🌿</span>
              <h3 className="font-semibold text-lg text-primary">{formattedDayDate(selectedDay.dateStr)}</h3>
            </div>
            <p className="text-xs text-dim mb-4">{selectedDay.events.length} event{selectedDay.events.length !== 1 ? "s" : ""} planted</p>

            <div className="flex flex-col gap-2 overflow-y-auto flex-1 mb-4">
              {selectedDay.events.map((ev) => (
                <div key={ev._id} className="flex items-center gap-3 bg-muted/50 rounded-2xl px-4 py-3">
                  <span className="text-base">{COLOR_EMOJI[ev.color] || "🌱"}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-primary font-medium truncate">{ev.title}</p>
                    {ev.time && <p className="text-xs text-dim">{ev.time}</p>}
                  </div>
                  <button onClick={() => openEditModal(ev)} className="text-dim hover:text-accent transition-colors cursor-pointer p-1" title="Edit">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" /></svg>
                  </button>
                  <button onClick={() => handleDelete(ev._id)} className="text-dim hover:text-rose-400 transition-colors cursor-pointer p-1" title="Delete">
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <Button variant="ghost" className="flex-1" onClick={() => { setShowDayModal(false); setSelectedDay(null); }}>Close</Button>
              <Button variant="primary" className="flex-1" onClick={() => openAddModal(selectedDay.dateStr)}>+ Add Event</Button>
            </div>
          </div>
        </div>
      )}

      {/* Add / Edit Event Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm p-4" onClick={() => { setShowAddModal(false); setEditingEvent(null); }}>
          <div className="bg-surface rounded-[var(--radius-xl)] p-6 sm:p-7 w-full max-w-sm shadow-[var(--shadow-lg)] border border-border/50" onClick={(e) => e.stopPropagation()} style={{ animation: "scaleIn 0.3s ease-out" }}>
            <div className="flex items-center gap-2 mb-4">
              <span>{editingEvent ? "✏️" : "🌱"}</span>
              <h3 className="font-semibold text-lg text-primary">{editingEvent ? "Edit Event" : "Plant a New Event"}</h3>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs text-dim mb-1 block">Title</label>
                <input type="text" required placeholder="e.g. Team sync" value={formTitle} onChange={(e) => setFormTitle(e.target.value)}
                  className="w-full rounded-xl bg-muted border border-border px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-dim mb-1 block">Date</label>
                  <input type="date" required value={formDate} onChange={(e) => setFormDate(e.target.value)}
                    className="w-full rounded-xl bg-muted border border-border px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
                <div>
                  <label className="text-xs text-dim mb-1 block">Time (optional)</label>
                  <input type="time" value={formTime} onChange={(e) => setFormTime(e.target.value)}
                    className="w-full rounded-xl bg-muted border border-border px-4 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
              </div>
              <div>
                <label className="text-xs text-dim mb-1 block">Color</label>
                <div className="flex gap-3">
                  {["mint", "sky", "pink", "lavender"].map((c) => (
                    <button key={c} type="button" onClick={() => setChosenColor(c)}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all cursor-pointer ${
                        chosenColor === c ? "bg-accent/10 ring-2 ring-accent" : "hover:bg-muted"
                      }`}
                    >
                      <span className="w-7 h-7 rounded-full" style={{ background: COLOR_HEX[c] }} />
                      <span className="text-[10px] text-dim">{COLOR_EMOJI[c]} {c}</span>
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => { setShowAddModal(false); setEditingEvent(null); }}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1">{editingEvent ? "Update" : "Plant"} 🌱</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
