import { useState } from "react";
import FilterBar from "../components/FilterBar";
import UseLogRecordTable from "../components/UseLogRecordTable";
import { useAuth } from "../context/AuthContext";
import { useUseLogs } from "../hooks/useUseLogs";
import { formatDateInput } from "../utils/date";

function UseLogsRecordsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("today");
  const [customDates, setCustomDates] = useState({
    startDate: formatDateInput(new Date()),
    endDate: formatDateInput(new Date()),
  });
  const { useLogs, loading, error } = useUseLogs({
    userId: user?.uid ?? null,
    filter,
    customStartDate: customDates.startDate,
    customEndDate: customDates.endDate,
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-neutral-950">အသုံးစရိတ်များ</h1>
      <FilterBar
        filter={filter}
        customStartDate={customDates.startDate}
        customEndDate={customDates.endDate}
        onFilterChange={setFilter}
        onCustomDateChange={(key, value) =>
          setCustomDates((current) => ({ ...current, [key]: value }))
        }
      />

      {error ? (
        <div className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
          {error}
        </div>
      ) : null}

      <UseLogRecordTable useLogs={useLogs} loading={loading} />
    </div>
  );
}

export default UseLogsRecordsPage;
