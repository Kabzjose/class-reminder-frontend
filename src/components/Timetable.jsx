import React from "react";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

function Timetable({ classes, onEdit, onDelete }) {
  // Build day map
  const dayMap = DAYS.reduce((acc, day) => {
    acc[day] = [];
    return acc;
  }, {});

  classes.forEach((c) => {
    c.days.forEach((day) => {
      if (dayMap[day]) dayMap[day].push(c);
    });
  });

  // Sort classes in each day by startTime
  DAYS.forEach((day) => {
    dayMap[day].sort((a, b) => a.startTime.localeCompare(b.startTime));
  });

  return (
    <div className="p-6">
      {/* Mobile View: Stack all days */}
      <div className="block lg:hidden space-y-4">
        {DAYS.map((day) => (
          <div 
            key={day} 
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden"
          >
            {/* Day Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4">
              <h3 className="text-center font-bold text-white uppercase tracking-wider text-lg flex items-center justify-center space-x-2">
                <span>📅</span>
                <span>{day}</span>
              </h3>
            </div>
            
            {/* Classes List */}
            <div className="p-4 space-y-3">
              {dayMap[day].length === 0 ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">😴</span>
                    <p className="text-sm text-gray-400 dark:text-gray-500 italic">No classes scheduled</p>
                  </div>
                </div>
              ) : (
                dayMap[day].map((c) => (
                  <ClassCard 
                    key={`${c.id}-${day}`} 
                    classData={c} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop View: Grid layout */}
      <div className="hidden lg:grid grid-cols-5 gap-4">
        {DAYS.map((day) => (
          <div 
            key={day} 
            className="flex flex-col bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 rounded-2xl border-2 border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden min-h-[500px]"
          >
            {/* Day Header */}
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-4 border-b-2 border-indigo-700">
              <h3 className="text-center font-bold text-white uppercase tracking-wider text-sm flex items-center justify-center space-x-2">
                <span>📅</span>
                <span>{day}</span>
              </h3>
            </div>
            
            {/* Classes List */}
            <div className="p-3 flex-1 flex flex-col gap-3">
              {dayMap[day].length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <span className="text-3xl mb-2 block opacity-50">😴</span>
                    <p className="text-xs text-gray-400 dark:text-gray-500 italic">No classes</p>
                  </div>
                </div>
              ) : (
                dayMap[day].map((c) => (
                  <ClassCard 
                    key={`${c.id}-${day}`} 
                    classData={c} 
                    onEdit={onEdit} 
                    onDelete={onDelete} 
                  />
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Separate ClassCard component for reusability
function ClassCard({ classData, onEdit, onDelete }) {
  const c = classData;
  
  return (
    <div className="group bg-white dark:bg-gray-800 border-2 border-blue-100 dark:border-gray-600 rounded-xl p-4 shadow-md hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 relative overflow-hidden">
      {/* Decorative gradient bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
      
      {/* Class Name */}
      <div className="mb-3">
        <h4 className="font-bold text-gray-900 dark:text-white text-base leading-tight line-clamp-2">
          {c.name}
        </h4>
      </div>

      {/* Time & Venue */}
      <div className="space-y-2 mb-3">
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm">⏰</span>
          </div>
          <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold">
            {c.startTime} – {c.endTime || 'N/A'}
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          <div className="w-7 h-7 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
            <span className="text-sm">📍</span>
          </div>
          <p className="text-xs text-gray-600 dark:text-gray-400 font-medium truncate">
            {c.venue || 'No venue'}
          </p>
        </div>
      </div>

      {/* Notes & Materials */}
      {(c.notes || c.materials) && (
        <div className="mb-3 pt-3 border-t border-gray-100 dark:border-gray-700 space-y-2">
          {c.notes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/10 border-l-2 border-yellow-400 p-2 rounded">
              <p className="text-xs text-gray-700 dark:text-gray-300">
                <span className="font-semibold text-yellow-700 dark:text-yellow-400">Note:</span> {c.notes}
              </p>
            </div>
          )}
          {c.materials && (
            <a 
              href={c.materials} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-colors"
            >
              <span className="text-sm">📎</span>
              <span className="font-medium">View Materials</span>
            </a>
          )}
        </div>
      )}
      
      {/* Reminder Badge */}
      {c.reminderMinutes && (
        <div className="mb-3">
          <span className="inline-flex items-center space-x-1 px-2 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold rounded-full">
            <span>🔔</span>
            <span>{c.reminderMinutes} min before</span>
          </span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-2 pt-2 border-t border-gray-100 dark:border-gray-700">
        <button 
          onClick={() => onEdit(c)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gradient-to-r from-indigo-500 to-blue-500 hover:from-indigo-600 hover:to-blue-600 text-white text-xs font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <span>✏️</span>
          <span>Edit</span>
        </button>
        <button 
          onClick={() => onDelete(c.id)}
          className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white text-xs font-semibold rounded-lg transition-all duration-300 shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
        >
          <span>🗑️</span>
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}

export default Timetable;