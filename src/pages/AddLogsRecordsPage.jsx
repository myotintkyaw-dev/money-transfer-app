import { useState } from "react";
import FilterBar from "../components/FilterBar";
import RecordTable from "../components/RecordTable";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../hooks/useTransactions";
import { formatDateInput } from "../utils/date";

function AddLogsRecordsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("today");
  const [customDates, setCustomDates] = useState({
    startDate: formatDateInput(new Date()),
    endDate: formatDateInput(new Date()),
  });
  const { transactions, loading, error } = useTransactions({
    userId: user?.uid ?? null,
    filter,
    customStartDate: customDates.startDate,
    customEndDate: customDates.endDate,
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-neutral-950">ငွေစာရင်းများ</h1>
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

      <RecordTable transactions={transactions} loading={loading} />
    </div>
  );
}

export default AddLogsRecordsPage;
