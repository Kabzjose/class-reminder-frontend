import { useEffect, useState } from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function ClassForm({ onSave, onUpdate, editingClass }) {
  const DEFAULT_FORM = {
    id: null,
    name: "",
    startTime: "",
    endTime: "",
    days: [],
    venue: "",
    reminderMinutes: 10,
    lastNotifiedDate: null,
    notes: "",
    materials: ""
  };

  const [form, setForm] = useState(DEFAULT_FORM);

  useEffect(() => {
    if (editingClass) {
      // Merge with defaults to ensure no field is undefined (fixes uncontrolled input warning)
      setForm({ ...DEFAULT_FORM, ...editingClass });
    }
  }, [editingClass]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDayToggle = (day) => {
    setForm((prev) => ({
      ...prev,
      days: prev.days.includes(day)
        ? prev.days.filter((d) => d !== day)
        : [...prev.days, day],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name || !form.startTime || !form.days.length) {
      alert("Please fill all required fields (Name, Time, Days).");
      return;
    }

    const payload = editingClass
      ? form
      : { ...form, id: crypto.randomUUID(), lastNotifiedDate: null };

    if (editingClass) {
      onUpdate(payload);
    } else {
      onSave(payload);
    }

    // Reset form
    setForm({
      id: null,
      name: "",
      startTime: "",
      endTime: "",
      days: [],
      venue: "",
      reminderMinutes: 10,
      lastNotifiedDate: null,
      notes: "",
      materials: ""
    });
  };

  const handleCancel = () => {
    setForm({
      id: null,
      name: "",
      startTime: "",
      endTime: "",
      days: [],
      venue: "",
      reminderMinutes: 10,
      lastNotifiedDate: null,
      notes: "",
      materials: ""
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">

      {/* Editing Mode Indicator */}
      {editingClass && (
        <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-900/20 border-l-4 border-orange-500 rounded-lg">
          <div className="flex items-center space-x-2">
            <span className="text-2xl">✏️</span>
            <div>
              <p className="font-semibold text-orange-800 dark:text-orange-300">Editing Mode</p>
              <p className="text-sm text-orange-600 dark:text-orange-400">You're editing: {editingClass.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleCancel}
            className="px-3 py-1 bg-orange-200 dark:bg-orange-800 text-orange-800 dark:text-orange-200 rounded-lg hover:bg-orange-300 dark:hover:bg-orange-700 transition text-sm font-medium"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Course Name */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
            <span>📚</span>
            <span>Course Name</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="name"
            placeholder="e.g. Data Structures & Algorithms"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            value={form.name}
            onChange={handleChange}
          />
        </div>

        {/* Start Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
            <span>🕐</span>
            <span>Start Time</span>
            <span className="text-red-500">*</span>
          </label>
          <input
            type="time"
            name="startTime"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            value={form.startTime}
            onChange={handleChange}
          />
        </div>

        {/* End Time */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
            <span>🕐</span>
            <span>End Time</span>
          </label>
          <input
            type="time"
            name="endTime"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            value={form.endTime}
            onChange={handleChange}
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
            <span>📍</span>
            <span>Venue</span>
          </label>
          <input
            type="text"
            name="venue"
            placeholder="e.g. Room 304, Lab B"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            value={form.venue}
            onChange={handleChange}
          />
        </div>

        {/* Reminder Minutes */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
            <span>⏱️</span>
            <span>Reminder (minutes)</span>
          </label>
          <input
            type="number"
            name="reminderMinutes"
            min="1"
            max="120"
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            value={form.reminderMinutes}
            onChange={handleChange}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            You'll be notified {form.reminderMinutes} min before class
          </p>
        </div>

        {/* Materials Link */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
            <span>🔗</span>
            <span>Materials Link</span>
          </label>
          <input
            type="url"
            name="materials"
            placeholder="https://drive.google.com/..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
            value={form.materials}
            onChange={handleChange}
          />
        </div>

        {/* Notes */}
        <div className="col-span-1 md:col-span-2">
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center space-x-1">
            <span>📝</span>
            <span>Additional Notes</span>
          </label>
          <textarea
            name="notes"
            rows="3"
            placeholder="Any important details, assignments, or reminders..."
            className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 resize-none"
            value={form.notes}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Days Selection */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3 flex items-center space-x-1">
          <span>📅</span>
          <span>Select Days</span>
          <span className="text-red-500">*</span>
        </label>
        <div className="flex flex-wrap gap-3">
          {DAYS.map((day) => {
            const isSelected = form.days.includes(day);
            return (
              <button
                key={day}
                type="button"
                onClick={() => handleDayToggle(day)}
                className={`
                  px-6 py-3 text-sm font-semibold rounded-xl border-2 transition-all duration-300 transform hover:scale-105 
                  ${isSelected
                    ? "bg-gradient-to-r from-blue-600 to-indigo-600 border-blue-600 text-white shadow-lg hover:shadow-xl"
                    : "bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-600 shadow-sm"
                  }
                `}
              >
                <div className="flex items-center space-x-2">
                  <span>{isSelected ? "✓" : ""}</span>
                  <span>{day}</span>
                </div>
              </button>
            );
          })}
        </div>
        {form.days.length === 0 && (
          <p className="text-xs text-red-500 mt-2">Please select at least one day</p>
        )}
      </div>

      {/* Submit Buttons */}
      <div className="flex gap-3 pt-4">
        {editingClass && (
          <button
            type="button"
            onClick={handleCancel}
            className="flex-1 font-bold py-4 px-6 rounded-xl border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-0.5 shadow-md hover:shadow-lg"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          className={`
            ${editingClass ? 'flex-1' : 'w-full'}
            font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 
            ${editingClass
              ? "bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
              : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            }
            text-white
          `}
        >
          <span className="flex items-center justify-center space-x-2">
            <span>{editingClass ? "💾" : "➕"}</span>
            <span>{editingClass ? "Save Changes" : "Add Class"}</span>
          </span>
        </button>
      </div>

    </form>
  );
}

export default ClassForm;