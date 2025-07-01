import React, { useEffect, useRef, useState } from "react";

const DateInput = ({ value, onChange }) => {
  const initialDate = useRef({
    day: value?.getDate() || "",
    month: value ? value.getMonth() + 1 : "",
    year: value?.getFullYear() || "",
  });

  const [date, setDate] = useState(initialDate.current);
  const monthRef = useRef(null);
  const dayRef = useRef(null);
  const yearRef = useRef(null);

  useEffect(() => {
    if (value) {
      const newDate = {
        day: value.getDate(),
        month: value.getMonth() + 1,
        year: value.getFullYear(),
      };
      setDate(newDate);
      initialDate.current = newDate;
    }
  }, [value]);

  // Validate date values
  const validateDate = (field, val) => {
    if (val === "") return false;

    const numVal = Number(val);
    if (isNaN(numVal)) return false;

    const newState = { ...date, [field]: numVal };

    // Basic validation
    if (
      (field === "day" && (numVal < 1 || numVal > 31)) ||
      (field === "month" && (numVal < 1 || numVal > 12)) ||
      (field === "year" && (numVal < 1000 || numVal > 9999))
    ) {
      return false;
    }

    // Validate actual date
    try {
      const dateObj = new Date(newState.year, newState.month - 1, newState.day);
      return (
        dateObj.getFullYear() === newState.year &&
        dateObj.getMonth() + 1 === newState.month &&
        dateObj.getDate() === newState.day
      );
    } catch {
      return false;
    }
  };

  const handleInputChange = (field) => (e) => {
    const val = e.target.value;
    if (val === "" || /^\d*$/.test(val)) {
      const newDate = { ...date, [field]: val };
      setDate(newDate);

      // Validate when all fields are filled
      if (newDate.day && newDate.month && newDate.year) {
        const numDay = Number(newDate.day);
        const numMonth = Number(newDate.month);
        const numYear = Number(newDate.year);

        if (
          validateDate(field, numDay) &&
          validateDate(field, numMonth) &&
          validateDate(field, numYear)
        ) {
          onChange(new Date(numYear, numMonth - 1, numDay));
          initialDate.current = newDate;
        }
      }
    }
  };

  const handleBlur = (field) => (e) => {
    const val = e.target.value;
    if (val === "") {
      setDate(initialDate.current);
      return;
    }

    const numVal = Number(val);
    if (!validateDate(field, numVal)) {
      setDate(initialDate.current);
    } else {
      const newDate = { ...date, [field]: numVal };
      setDate(newDate);

      if (newDate.day && newDate.month && newDate.year) {
        onChange(new Date(newDate.year, newDate.month - 1, newDate.day));
        initialDate.current = newDate;
      }
    }
  };

  const handleKeyDown = (field) => (e) => {
    // Navigation between fields
    if (e.key === "ArrowRight") {
      if (field === "month") dayRef.current?.focus();
      if (field === "day") yearRef.current?.focus();
    } else if (e.key === "ArrowLeft") {
      if (field === "day") monthRef.current?.focus();
      if (field === "year") dayRef.current?.focus();
    } else if (e.key === "Enter") {
      e.target.blur();
    }
  };

  return (
    <div className="flex border rounded-lg items-center text-sm px-1 h-9">
      <input
        ref={monthRef}
        type="text"
        value={date.month}
        onChange={handleInputChange("month")}
        onKeyDown={handleKeyDown("month")}
        onBlur={handleBlur("month")}
        onFocus={(e) => e.target.select()}
        className="p-0 outline-none w-6 border-none text-center"
        placeholder="M"
        maxLength={2}
      />
      <span className="opacity-20 -mx-px">/</span>
      <input
        ref={dayRef}
        type="text"
        value={date.day}
        onChange={handleInputChange("day")}
        onKeyDown={handleKeyDown("day")}
        onBlur={handleBlur("day")}
        onFocus={(e) => e.target.select()}
        className="p-0 outline-none w-7 border-none text-center"
        placeholder="D"
        maxLength={2}
      />
      <span className="opacity-20 -mx-px">/</span>
      <input
        ref={yearRef}
        type="text"
        value={date.year}
        onChange={handleInputChange("year")}
        onKeyDown={handleKeyDown("year")}
        onBlur={handleBlur("year")}
        onFocus={(e) => e.target.select()}
        className="p-0 outline-none w-12 border-none text-center"
        placeholder="YYYY"
        maxLength={4}
      />
    </div>
  );
};

DateInput.displayName = "DateInput";

export { DateInput };
