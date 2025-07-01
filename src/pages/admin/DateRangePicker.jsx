/* eslint-disable max-lines */
import React, { useState, useEffect, useRef } from "react";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  CheckIcon,
  Cross1Icon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { DateInput } from "./DateInput";

// Utility function to format dates
const formatDate = (date, locale = "en-us") => {
  if (!date) return "";
  return date.toLocaleDateString(locale, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

// Handle timezones and string dates
const getDateAdjustedForTimezone = (dateInput) => {
  if (!dateInput) return undefined;

  if (typeof dateInput === "string") {
    const date = new Date(dateInput);
    return isNaN(date.getTime()) ? undefined : date;
  }
  return dateInput;
};

// Preset configurations
const PRESETS = [
  { name: "today", label: "Today" },
  { name: "yesterday", label: "Yesterday" },
  { name: "last7", label: "Last 7 days" },
  { name: "last14", label: "Last 14 days" },
  { name: "last30", label: "Last 30 days" },
  { name: "thisWeek", label: "This Week" },
  { name: "lastWeek", label: "Last Week" },
  { name: "thisMonth", label: "This Month" },
  { name: "lastMonth", label: "Last Month" },
];

/** Improved DateRangePicker component */
export const DateRangePicker = ({
  initialDateFrom = new Date(new Date().setHours(0, 0, 0, 0)),
  initialDateTo,
  initialCompareFrom,
  initialCompareTo,
  onUpdate,
  align = "end",
  locale = "en-US",
  showCompare = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [range, setRange] = useState({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : undefined,
  });

  const [rangeCompare, setRangeCompare] = useState(
    initialCompareFrom
      ? {
          from: getDateAdjustedForTimezone(initialCompareFrom),
          to: initialCompareTo
            ? getDateAdjustedForTimezone(initialCompareTo)
            : undefined,
        }
      : undefined
  );

  const openedRangeRef = useRef();
  const openedRangeCompareRef = useRef();
  const [selectedPreset, setSelectedPreset] = useState();
  const [isSmallScreen, setIsSmallScreen] = useState(
    typeof window !== "undefined" ? window.innerWidth < 960 : false
  );

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 960);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Get preset date ranges
  const getPresetRange = (presetName) => {
    const preset = PRESETS.find(({ name }) => name === presetName);
    if (!preset) throw new Error(`Unknown preset: ${presetName}`);

    const from = new Date();
    const to = new Date();

    switch (presetName) {
      case "today":
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "yesterday":
        from.setDate(from.getDate() - 1);
        from.setHours(0, 0, 0, 0);
        to.setDate(to.getDate() - 1);
        to.setHours(23, 59, 59, 999);
        break;
      case "last7":
        from.setDate(from.getDate() - 6);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last14":
        from.setDate(from.getDate() - 13);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "last30":
        from.setDate(from.getDate() - 29);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisWeek":
        from.setDate(from.getDate() - from.getDay());
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastWeek":
        from.setDate(from.getDate() - from.getDay() - 7);
        to.setDate(from.getDate() + 6);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "thisMonth":
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case "lastMonth":
        from.setMonth(from.getMonth() - 1, 1);
        to.setDate(0);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
    }

    return { from, to };
  };

  // Set preset and update range
  const setPreset = (preset) => {
    const range = getPresetRange(preset);
    setRange(range);
    setSelectedPreset(preset);

    if (rangeCompare) {
      setRangeCompare({
        from: new Date(
          range.from.getFullYear() - 1,
          range.from.getMonth(),
          range.from.getDate()
        ),
        to: range.to
          ? new Date(
              range.to.getFullYear() - 1,
              range.to.getMonth(),
              range.to.getDate()
            )
          : undefined,
      });
    }
  };

  // Check if current range matches a preset
  const checkPreset = () => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);

      if (
        range.from?.getTime() === presetRange.from.getTime() &&
        range.to?.getTime() === presetRange.to.getTime()
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }
    setSelectedPreset(undefined);
  };

  // Reset to initial values
  const resetValues = () => {
    setRange({
      from: getDateAdjustedForTimezone(initialDateFrom),
      to: initialDateTo ? getDateAdjustedForTimezone(initialDateTo) : undefined,
    });
    setRangeCompare(
      initialCompareFrom
        ? {
            from: getDateAdjustedForTimezone(initialCompareFrom),
            to: initialCompareTo
              ? getDateAdjustedForTimezone(initialCompareTo)
              : undefined,
          }
        : undefined
    );
  };

  useEffect(() => {
    checkPreset();
  }, [range]);

  // Check if ranges are equal
  const areRangesEqual = (a, b) => {
    if (!a || !b) return a === b;
    return (
      a.from?.getTime() === b.from?.getTime() &&
      a.to?.getTime() === b.to?.getTime()
    );
  };

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;
      openedRangeCompareRef.current = rangeCompare;
    }
  }, [isOpen]);

  //   // Preset button component
  //   const PresetButton = ({ preset, label, isSelected }) => (
  //     <Button
  //       placeholder="Select preset..."
  //       className={cn(
  //         "justify-start w-full",
  //         isSelected && "pointer-events-none bg-accent"
  //       )}
  //       variant="ghost"
  //       onClick={() => setPreset(preset)}
  //     >
  //       <span className={cn("pr-2 opacity-0", isSelected && "opacity-100")}>
  //         <CheckIcon width={18} height={18} />
  //       </span>
  //       {label}
  //     </Button>
  //   );

  // Clear selection
  const clearSelection = () => {
    setRange({ from: undefined, to: undefined });
    setRangeCompare(undefined);
    setSelectedPreset(undefined);
  };

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) resetValues();
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          //   size="lg"
          className="min-w-[150px] border-1 border-black w-full md:w-auto bg-white text-black hover:bg-white rounded-lg px-2 text-sm flex justify-between items-center"
        >
          <div className="text-right min-w-[120px]">
            <div className="py-1">
              {range.from ? (
                <div>
                  {formatDate(range.from, locale)}
                  {range.to ? ` - ${formatDate(range.to, locale)}` : ""}
                </div>
              ) : (
                <div className="text-gray-400">Select date range</div>
              )}
            </div>
            {rangeCompare && (
              <div className="opacity-60 text-xs -mt-1">
                vs. {formatDate(rangeCompare.from, locale)}
                {rangeCompare.to
                  ? ` - ${formatDate(rangeCompare.to, locale)}`
                  : ""}
              </div>
            )}
          </div>
          <div className="pl-2 opacity-60 -mr-0 scale-125">
            {isOpen ? (
              <ChevronUpIcon width={24} />
            ) : (
              <ChevronDownIcon width={24} />
            )}
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto p-0">
        <div className="flex py-2">
          <div className="flex">
            <div className="flex flex-col">
              <div className="flex flex-col lg:flex-row gap-2 px-3 justify-end items-center lg:items-start pb-4 lg:pb-0">
                {showCompare && (
                  <div className="flex items-center space-x-2 pr-4 py-1">
                    <Switch
                      checked={Boolean(rangeCompare)}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setRangeCompare({
                            from: new Date(
                              range.from.getFullYear() - 1,
                              range.from.getMonth(),
                              range.from.getDate()
                            ),
                            to: range.to
                              ? new Date(
                                  range.to.getFullYear() - 1,
                                  range.to.getMonth(),
                                  range.to.getDate()
                                )
                              : new Date(
                                  range.from.getFullYear() - 1,
                                  range.from.getMonth(),
                                  range.from.getDate()
                                ),
                          });
                        } else {
                          setRangeCompare(undefined);
                        }
                      }}
                      id="compare-mode"
                    />
                    <Label htmlFor="compare-mode">Compare</Label>
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex flex-row gap-2 items-end mb-2">
                    <div className="flex gap-2">
                      <DateInput
                        value={range.from}
                        onChange={(date) => {
                          const toDate =
                            range.to && date > range.to ? date : range.to;
                          setRange({ from: date, to: toDate });
                        }}
                      />
                      <div className="py-1">-</div>
                      <DateInput
                        value={range.to}
                        onChange={(date) => {
                          const fromDate =
                            date < range.from ? date : range.from;
                          setRange({ from: fromDate, to: date });
                        }}
                      />
                    </div>
                    <div className="hidden lg:block">
                      <Select value={selectedPreset} onValueChange={setPreset}>
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select preset..." />
                        </SelectTrigger>
                        <SelectContent>
                          {PRESETS.map((preset) => (
                            <SelectItem key={preset.name} value={preset.name}>
                              {preset.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {rangeCompare && (
                    <div className="flex gap-2">
                      <DateInput
                        value={rangeCompare.from}
                        onChange={(date) => {
                          const compareToDate =
                            rangeCompare.to && date > rangeCompare.to
                              ? date
                              : rangeCompare.to;
                          setRangeCompare({
                            from: date,
                            to: compareToDate,
                          });
                        }}
                      />
                      <div className="py-1">-</div>
                      <DateInput
                        value={rangeCompare.to}
                        onChange={(date) => {
                          const compareFromDate =
                            date < rangeCompare.from ? date : rangeCompare.from;
                          setRangeCompare({
                            from: compareFromDate,
                            to: date,
                          });
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
              {isSmallScreen ? (
                <div className="flex flex-col gap-2 px-3 pb-3 w-full">
                  <label className="text-xs font-medium mb-1">From</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 text-sm"
                    value={
                      range.from ? range.from.toISOString().slice(0, 10) : ""
                    }
                    onChange={(e) => {
                      const val = e.target.value
                        ? new Date(e.target.value)
                        : undefined;
                      setRange((r) => ({
                        from: val,
                        to: r.to && val && r.to < val ? val : r.to,
                      }));
                    }}
                    max={
                      range.to ? range.to.toISOString().slice(0, 10) : undefined
                    }
                  />
                  <label className="text-xs font-medium mb-1">To</label>
                  <input
                    type="date"
                    className="border rounded px-2 py-1 text-sm"
                    value={range.to ? range.to.toISOString().slice(0, 10) : ""}
                    onChange={(e) => {
                      const val = e.target.value
                        ? new Date(e.target.value)
                        : undefined;
                      setRange((r) => ({
                        from: r.from,
                        to: val,
                      }));
                    }}
                    min={
                      range.from
                        ? range.from.toISOString().slice(0, 10)
                        : undefined
                    }
                  />
                </div>
              ) : (
                <Calendar
                  mode="range"
                  onSelect={(value) => {
                    if (value?.from) {
                      setRange({
                        from: value.from,
                        to: value.to || value.from,
                      });
                    }
                  }}
                  selected={range}
                  numberOfMonths={isSmallScreen ? 1 : 2}
                  defaultMonth={range.from || new Date()}
                />
              )}
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center py-2 px-3 border-t">
          <Button
            variant="ghost"
            onClick={clearSelection}
            disabled={!range.from && !range.to}
          >
            Clear
          </Button>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              onClick={() => {
                setIsOpen(false);
                resetValues();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false);
                if (
                  !areRangesEqual(range, openedRangeRef.current) ||
                  !areRangesEqual(rangeCompare, openedRangeCompareRef.current)
                ) {
                  onUpdate?.({ range, rangeCompare });
                }
              }}
            >
              Apply
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateRangePicker.displayName = "DateRangePicker";
