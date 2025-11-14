import React, { useState, useCallback } from "react";
import type { YearData, DayActivity } from "../utils/activityUtils";
import ActivityPreview from "./ActivityPreview";

interface ActivityGridProps {
  activityData: YearData[];
}

const ActivityGrid: React.FC<ActivityGridProps> = ({ activityData }) => {
  const [hoveredDay, setHoveredDay] = useState<DayActivity | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  const [showMobileModal, setShowMobileModal] = useState(false);

  // Check if device is mobile
  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Track mouse position
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isMobile) {
      setMousePosition({ x: e.clientX, y: e.clientY });
    }
  }, [isMobile]);

  const handleDayHover = useCallback((day: DayActivity | null) => {
    if (!isMobile && day && day.count > 0) {
      setHoveredDay(day);
    } else if (!isMobile) {
      setHoveredDay(null);
    }
  }, [isMobile]);

  const handleDayClick = useCallback((day: DayActivity | null) => {
    if (isMobile && day && day.count > 0) {
      setHoveredDay(day);
      setShowMobileModal(true);
    }
  }, [isMobile]);

  const closeMobileModal = useCallback(() => {
    setShowMobileModal(false);
    setHoveredDay(null);
  }, []);

  // Easter egg class based on post count
  const getEasterEggClass = (count: number): string => {
    if (count === 0) return "";
    if (count === 1) return "";
    if (count === 2) return "pulse-effect thick-border";
    if (count === 3) return "sparkle-effect glow-effect thick-border";
    return "rainbow-border pulse-effect sparkle-effect glow-effect";
  };

  // Day names for labels
  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="activity-grid-container" onMouseMove={handleMouseMove}>
      {activityData.map((yearData) => (
        <div key={yearData.year} className="year-section">
          {/* Year header */}
          <div className="year-header">
            <span className="year-label">{yearData.year}</span>
          </div>

          <div className="grid-wrapper">
            {/* Day labels */}
            <div className="day-labels">
              {dayNames.map((day, index) => (
                <div key={day} className="day-label" style={{ display: index % 2 === 1 ? 'block' : 'none' }}>
                  {day}
                </div>
              ))}
            </div>

            {/* Main grid */}
            <div className="weeks-grid">
              {/* Month labels */}
              <div className="month-labels">
                {yearData.monthLabels.map((label, index) => (
                  <span
                    key={`${label.month}-${index}`}
                    className="month-label"
                    style={{
                      gridColumn: label.weekIndex + 1,
                    }}
                  >
                    {label.month}
                  </span>
                ))}
              </div>

              {/* Grid cells */}
              <div className="cells-grid">
                {yearData.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="week-column">
                    {week.days.map((day, dayIndex) => {
                      const hasActivity = day && day.count > 0;
                      const easterEggClass = day ? getEasterEggClass(day.count) : "";

                      return (
                        <div
                          key={`${weekIndex}-${dayIndex}`}
                          className={`day-cell ${hasActivity ? "active" : "empty"} ${easterEggClass}`}
                          onMouseEnter={() => handleDayHover(day)}
                          onMouseLeave={() => handleDayHover(null)}
                          onClick={() => handleDayClick(day)}
                          data-count={day?.count || 0}
                        >
                          {/* Sparkle icon for 3+ posts */}
                          {day && day.count >= 3 && (
                            <span className="sparkle-icon">✦</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Desktop preview (follows cursor) */}
      {!isMobile && hoveredDay && (
        <ActivityPreview
          day={hoveredDay}
          position={mousePosition}
          isMobile={false}
          onClose={() => {}}
        />
      )}

      {/* Mobile modal */}
      {isMobile && showMobileModal && hoveredDay && (
        <ActivityPreview
          day={hoveredDay}
          position={mousePosition}
          isMobile={true}
          onClose={closeMobileModal}
        />
      )}
    </div>
  );
};

export default ActivityGrid;
