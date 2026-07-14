import { useState, useMemo } from "react";
import { useGame } from "../context/GameStateContext";
import Button from "../components/Button/Button";

const COLOR_HEX = { mint: "#8FD9BE", sky: "#8FCBE0", pink: "#E8A7C2", lavender: "#C3A9EE" };

export default function Calendar() {
  const { events, addEvent, deleteEvent } = useGame();
  const [viewDate, setViewDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
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
      .sort((a, b) => (a.date + a.time).localeCompare(b.date + b.time))
      .slice(0, 6);
  }, [events, todayStr]);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date());

  const openModalForDate = (dateStr) => {
    setFormDate(dateStr);
    setFormTitle("");
    setFormTime("");
    setChosenColor("mint");
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;
    addEvent({ title: formTitle.trim(), date: formDate, time: formTime, color: chosenColor });
    setShowModal(false);
  };

  return (
    <div className="py-6" style={{ animation: "fadeIn 0.4s ease-out" }}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-xl bg-surface hover:bg-muted transition-colors border border-border/50 cursor-pointer">
            <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 6-6 6 6 6" /></svg>
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-primary min-w-[180px] text-center">{title}</h1>
          <button onClick={nextMonth} className="p-2 rounded-xl bg-surface hover:bg-muted transition-colors border border-border/50 cursor-pointer">
            <svg className="w-5 h-5 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 6 6 6-6 6" /></svg>
          </button>
        </div>
        <Button variant="ghost" size="sm" onClick={goToday}>Today</Button>
      </div>

      <div className="bg-surface border border-border/40 rounded-[var(--radius-xl)] p-4 sm:p-6" style={{ animation: "fadeIn 0.4s ease-out", animationDelay: "0.05s" }}>
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
                onClick={() => openModalForDate(cell.dateStr)}
                className={`aspect-square rounded-2xl flex flex-col items-center justify-start p-1.5 text-sm cursor-pointer transition-all duration-200 border-none ${
                  cell.isToday
                    ? "bg-gradient-to-br from-accent/20 to-accent-alt/20 font-semibold text-primary"
                    : "bg-surface hover:bg-muted text-secondary"
                }`}
              >
                <span>{cell.day}</span>
                <div className="flex gap-0.5 mt-0.5">
                  {cell.events.slice(0, 3).map((ev, i) => (
                    <span key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: COLOR_HEX[ev.color] || COLOR_HEX.mint }} />
                  ))}
                </div>
              </button>
            )
          )}
        </div>
      </div>

      <section className="bg-surface border border-border/40 rounded-[var(--radius-xl)] p-6 mt-6" style={{ animation: "fadeIn 0.4s ease-out", animationDelay: "0.1s" }}>
        <h2 className="font-semibold text-primary mb-4">Upcoming</h2>
        {upcoming.length === 0 ? (
          <p className="text-sm text-dim text-center py-6">No events scheduled — click a day to add one</p>
        ) : (
          <div className="flex flex-col gap-2">
            {upcoming.map((ev) => (
              <div key={ev._id} className="flex items-center gap-3 bg-muted/50 rounded-2xl px-4 py-3">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: COLOR_HEX[ev.color] || COLOR_HEX.mint }} />
                <span className="flex-1 text-sm text-primary">{ev.title}</span>
                <span className="text-xs text-dim">{ev.date}{ev.time ? ` · ${ev.time}` : ""}</span>
                <button onClick={() => deleteEvent(ev._id)} className="text-dim hover:text-rose-400 transition-colors cursor-pointer">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 6l12 12M18 6L6 18" /></svg>
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center backdrop-blur-sm p-4" onClick={() => setShowModal(false)}>
          <div className="bg-surface rounded-[var(--radius-xl)] p-6 sm:p-7 w-full max-w-sm shadow-[var(--shadow-lg)] border border-border/50" onClick={(e) => e.stopPropagation()} style={{ animation: "scaleIn 0.3s ease-out" }}>
            <h3 className="font-semibold text-lg text-primary mb-4">New Event</h3>
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
                <div className="flex gap-2">
                  {["mint", "sky", "pink", "lavender"].map((c) => (
                    <button key={c} type="button" onClick={() => setChosenColor(c)}
                      className={`w-7 h-7 rounded-full transition-transform hover:scale-110 cursor-pointer ${
                        chosenColor === c ? "ring-2 ring-offset-2 ring-accent" : ""
                      }`}
                      style={{ background: COLOR_HEX[c] }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex gap-3 mt-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button type="submit" variant="primary" className="flex-1">Add Event</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
