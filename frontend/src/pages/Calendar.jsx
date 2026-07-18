import { useState, useMemo } from "react";
import { useGame } from "../context/GameStateContext";
import { useTheme } from "./ThemeContext";
import Button from "../components/Button/Button";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { PiFlowerLotusDuotone } from "react-icons/pi";
import { RiSeedlingLine } from "react-icons/ri";

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
  const [timeHour, setTimeHour] = useState("12");
  const [timeMin, setTimeMin] = useState("00");
  const [timePeriod, setTimePeriod] = useState("AM");
  const [chosenColor, setChosenColor] = useState("mint");
  const [formRecurring, setFormRecurring] = useState("none");

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
      days.push({ day: d, dateStr, key: dateStr, isToday: dateStr === todayStr, events: events.filter((e) => e.date === dateStr || (e.recurring === "yearly" && e.date.slice(5) === dateStr.slice(5))) });
    }
    return days;
  }, [year, month, events, todayStr]);

  const upcoming = useMemo(() => {
    const yearStr = String(year);
    return events
      .filter((e) => {
        if (e.date >= todayStr) return true;
        if (e.recurring === "yearly") {
          const md = e.date.slice(5);
          const todayMd = todayStr.slice(5);
          if (md >= todayMd && e.date.slice(0, 4) < yearStr) return true;
        }
        return false;
      })
      .sort((a, b) => {
        const aDate = a.recurring === "yearly" ? `${year}-${a.date.slice(5)}` : a.date;
        const bDate = b.recurring === "yearly" ? `${year}-${b.date.slice(5)}` : b.date;
        return (aDate + (a.time || "")).localeCompare(bDate + (b.time || ""));
      })
      .slice(0, 6);
  }, [events, todayStr, year]);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));
  const goToday = () => setViewDate(new Date());

  const parseTime = (t) => {
    if (!t) return { h: "12", m: "00", p: "AM" };
    const [hh, mm] = t.split(":");
    const hour = parseInt(hh, 10);
    const p = hour >= 12 ? "PM" : "AM";
    const h = hour === 0 ? "12" : hour > 12 ? String(hour - 12) : String(hour);
    return { h, m: mm || "00", p };
  };

  const buildTime = (h, m, p) => {
    let hour = parseInt(h, 10);
    if (p === "PM" && hour !== 12) hour += 12;
    if (p === "AM" && hour === 12) hour = 0;
    return `${String(hour).padStart(2, "0")}:${m}`;
  };

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
    setTimeHour("12");
    setTimeMin("00");
    setTimePeriod("AM");
    setChosenColor("mint");
    setFormRecurring("none");
    setShowAddModal(true);
  };

  const openEditModal = (event) => {
    setEditingEvent(event);
    setFormDate(event.date);
    setFormTitle(event.title);
    const t = parseTime(event.time);
    setTimeHour(t.h);
    setTimeMin(t.m);
    setTimePeriod(t.p);
    setChosenColor(event.color || "mint");
    setFormRecurring(event.recurring || "none");
    setShowDayModal(false);
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formTitle.trim() || !formDate) return;
    if (editingEvent) {
      deleteEvent(editingEvent._id);
    }
    addEvent({ title: formTitle.trim(), date: formDate, time: buildTime(timeHour, timeMin, timePeriod), color: chosenColor, recurring: formRecurring });
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
      <div className="relative flex items-center justify-between mb-6">
        <Button variant="ghost" size="sm" onClick={goToday} className="flex items-center gap-1.5"><PiFlowerLotusDuotone className="w-4 h-4" /> Today</Button>
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-3">
          <button onClick={prevMonth} className="p-2 rounded-xl transition-colors cursor-pointer">
            <IoIosArrowBack className="w-5 h-5 text-secondary hover:text-primary" />
          </button>
          <h1 className="text-xl sm:text-2xl font-semibold text-primary min-w-[180px] text-center flex items-center gap-2">
            <span>🌿</span> {title} <span>🌿</span>
          </h1>
          <button onClick={nextMonth} className="p-2 rounded-xl transition-colors cursor-pointer">
            <IoIosArrowForward className="w-5 h-5 text-secondary hover:text-primary" />
          </button>
        </div>
        <div className="w-[100px]" />
      </div>

      {/* Calendar + Upcoming Layout */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid */}
        <div className="lg:w-[65%] bg-surface border border-border/40 rounded-[var(--radius-xl)] p-3 sm:p-5" style={{ animation: "fadeIn 0.4s ease-out", animationDelay: "0.05s" }}>
          <div className="grid grid-cols-7 gap-3 mb-3">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
              <div key={d} className="text-center text-sm font-medium text-dim py-1">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {calendarDays.map((cell) =>
              cell.empty ? (
              <div key={cell.key} className="aspect-[5/4]" />
            ) : (
              <button
                key={cell.key}
                onClick={() => handleDayClick(cell)}
                className={`aspect-[5/4] rounded-2xl flex flex-col items-center justify-start p-2.5 text-base cursor-pointer transition-all duration-200 border-none ${
                    cell.isToday
                      ? "bg-gradient-to-br from-accent/20 to-accent-alt/20 font-semibold text-primary ring-2 ring-accent/30"
                      : cell.events.length > 0
                        ? "bg-muted/80 hover:bg-muted text-secondary"
                        : "bg-surface hover:bg-muted text-secondary"
                  }`}
                >
                  <span className="flex items-center gap-0.5">
                    {cell.isToday && <RiSeedlingLine className="text-[10px]" />}
                    {cell.day}
                  </span>
                  <div className="flex gap-1 mt-1 flex-wrap justify-center">
                    {cell.events.slice(0, 3).map((ev, i) => (
                      <span key={i} className="text-[10px] leading-none">{COLOR_EMOJI[ev.color] || "🌱"}</span>
                    ))}
                    {cell.events.length > 3 && (
                      <span className="text-[10px] text-dim leading-none">+{cell.events.length - 3}</span>
                    )}
                  </div>
                </button>
              )
            )}
          </div>
        </div>

        {/* Upcoming Events */}
        <section className="lg:w-[35%] bg-surface border border-border/40 rounded-[var(--radius-xl)] p-6" style={{ animation: "fadeIn 0.4s ease-out", animationDelay: "0.1s" }}>
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
      </div>

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
              <span>{editingEvent ? "✏️" : <RiSeedlingLine />}</span>
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
                  <div className="flex gap-1.5">
                    <select value={timeHour} onChange={(e) => setTimeHour(e.target.value)}
                      className="w-16 rounded-xl bg-muted border border-border px-2 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer appearance-none text-center">
                      {["12","1","2","3","4","5","6","7","8","9","10","11"].map((h) => <option key={h} value={h}>{h}</option>)}
                    </select>
                    <span className="text-secondary self-center font-semibold">:</span>
                    <select value={timeMin} onChange={(e) => setTimeMin(e.target.value)}
                      className="w-16 rounded-xl bg-muted border border-border px-2 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer appearance-none text-center">
                      {["00","05","10","15","20","25","30","35","40","45","50","55"].map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={timePeriod} onChange={(e) => setTimePeriod(e.target.value)}
                      className="w-16 rounded-xl bg-muted border border-border px-2 py-2.5 text-sm text-primary focus:outline-none focus:ring-2 focus:ring-accent cursor-pointer appearance-none text-center">
                      <option value="AM">AM</option>
                      <option value="PM">PM</option>
                    </select>
                  </div>
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
              <div className="flex items-center gap-3">
                <button type="button" onClick={() => setFormRecurring(formRecurring === "yearly" ? "none" : "yearly")}
                  className={`relative w-10 h-6 rounded-full transition-colors duration-200 cursor-pointer ${formRecurring === "yearly" ? "bg-accent" : "bg-border"}`}>
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${formRecurring === "yearly" ? "translate-x-4" : ""}`} />
                </button>
                <span className="text-sm text-secondary">Repeat every year</span>
              </div>
              <div className="flex gap-3 mt-2">
                <Button type="button" variant="ghost" className="flex-1" onClick={() => { setShowAddModal(false); setEditingEvent(null); }}>Cancel</Button>
                 <Button type="submit" variant="primary" className="flex-1">{editingEvent ? "Update" : "Plant"} <RiSeedlingLine className="inline" /></Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
