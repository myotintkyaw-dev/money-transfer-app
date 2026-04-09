import { Timestamp } from "firebase/firestore";

const YANGON_TIME_ZONE = "Asia/Yangon";
const YANGON_OFFSET_MINUTES = 6 * 60 + 30;
const DAY_IN_MILLISECONDS = 24 * 60 * 60 * 1000;

function getYangonDateParts(date) {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: YANGON_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  return formatter
    .formatToParts(date)
    .reduce((parts, part) => {
      if (part.type !== "literal") {
        parts[part.type] = part.value;
      }

      return parts;
    }, {});
}

export function toStartOfDay(date) {
  return parseDateInput(formatDateInput(date));
}

export function toEndExclusiveDay(date) {
  return new Date(date.getTime() + DAY_IN_MILLISECONDS);
}

export function formatDateInput(date) {
  const { year, month, day } = getYangonDateParts(date);
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(dateValue) {
  const date =
    dateValue instanceof Timestamp ? dateValue.toDate() : new Date(dateValue);

  return new Intl.DateTimeFormat("en-US", {
    timeZone: YANGON_TIME_ZONE,
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function parseDateInput(value) {
  if (!value) {
    return null;
  }

  const [year, month, day] = value.split("-").map(Number);
  return new Date(
    Date.UTC(year, month - 1, day) - YANGON_OFFSET_MINUTES * 60 * 1000,
  );
}

export function getDateRange(filterKey, customStartDate, customEndDate) {
  const today = toStartOfDay(new Date());
  const start = new Date(today);

  if (filterKey === "today") {
    return {
      startAt: Timestamp.fromDate(start),
      endBefore: Timestamp.fromDate(toEndExclusiveDay(today)),
    };
  }

  if (filterKey === "last7") {
    start.setDate(today.getDate() - 6);
    return {
      startAt: Timestamp.fromDate(start),
      endBefore: Timestamp.fromDate(toEndExclusiveDay(today)),
    };
  }

  if (filterKey === "last30") {
    start.setDate(today.getDate() - 29);
    return {
      startAt: Timestamp.fromDate(start),
      endBefore: Timestamp.fromDate(toEndExclusiveDay(today)),
    };
  }

  const parsedStart = parseDateInput(customStartDate);
  const parsedEnd = parseDateInput(customEndDate);

  return {
    startAt: parsedStart ? Timestamp.fromDate(parsedStart) : null,
    endBefore: parsedEnd
      ? Timestamp.fromDate(toEndExclusiveDay(parsedEnd))
      : null,
  };
}
