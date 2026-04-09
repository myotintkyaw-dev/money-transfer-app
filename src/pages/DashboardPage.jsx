import { useMemo, useState } from "react";
import FilterBar from "../components/FilterBar";
import { useAuth } from "../context/AuthContext";
import { useInitialAmounts } from "../hooks/useInitialAmounts";
import { useTransactions } from "../hooks/useTransactions";
import { useUseLogs } from "../hooks/useUseLogs";
import { formatCurrency } from "../utils/currency";
import {
  calculateBalanceSummary,
  calculateTransactionMetrics,
  calculateUsedAmount,
} from "../utils/transactions";
import { formatDateInput } from "../utils/date";

function DashboardPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("today");
  const [customDates, setCustomDates] = useState({
    startDate: formatDateInput(new Date()),
    endDate: formatDateInput(new Date()),
  });
  const {
    transactions,
    error,
  } = useTransactions({
    userId: user?.uid ?? null,
    filter,
    customStartDate: customDates.startDate,
    customEndDate: customDates.endDate,
  });
  const {
    initialAmounts,
    error: initialAmountsError,
  } = useInitialAmounts({
    userId: user?.uid ?? null,
    filter,
    customStartDate: customDates.startDate,
    customEndDate: customDates.endDate,
  });
  const {
    useLogs,
    error: useLogsError,
  } = useUseLogs({
    userId: user?.uid ?? null,
    filter,
    customStartDate: customDates.startDate,
    customEndDate: customDates.endDate,
  });

  const transactionMetrics = useMemo(
    () => calculateTransactionMetrics(transactions),
    [transactions],
  );
  const usedAmount = useMemo(() => calculateUsedAmount(useLogs), [useLogs]);
  const initialAmountSummary = useMemo(
    () => calculateBalanceSummary(initialAmounts, transactions, useLogs),
    [initialAmounts, transactions, useLogs],
  );
  const cards = [
    {
      title: "Commission amount",
      value: formatCurrency(transactionMetrics.commissionAmount),
    },
    {
      title: "Times count",
      value: String(transactionMetrics.timesCount),
    },
    {
      title: "Transaction amount",
      value: formatCurrency(transactionMetrics.transactionAmount),
    },
    {
      title: "Used",
      value: formatCurrency(usedAmount),
    },
    {
      title: "Sittwe amount",
      value: formatCurrency(initialAmountSummary.sittweAmount),
    },
    {
      title: "Yangon amount",
      value: formatCurrency(initialAmountSummary.yangonAmount),
    },
    {
      title: "Initial amount",
      value: formatCurrency(initialAmountSummary.initialAmount),
      className: "col-span-2 xl:col-span-2",
    },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-neutral-950">Dashboard</h1>
      <FilterBar
        filter={filter}
        customStartDate={customDates.startDate}
        customEndDate={customDates.endDate}
        onFilterChange={setFilter}
        onCustomDateChange={(key, value) =>
          setCustomDates((current) => ({ ...current, [key]: value }))
        }
      />
      <section className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {cards.map((card) => (
          <article
            key={card.title}
            className={`rounded-md border border-black/8 bg-white p-6 text-neutral-950 shadow-[0_18px_50px_rgba(0,0,0,0.05)] ${card.className || ""}`}
          >
            <p className="text-sm font-semibold text-neutral-500">{card.title}</p>
            <p className="mt-4 text-xl font-semibold text-neutral-950">
              {card.value}
            </p>
          </article>
        ))}
      </section>

      {error || initialAmountsError || useLogsError ? (
        <div className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
          {error || initialAmountsError || useLogsError}
        </div>
      ) : null}
    </div>
  );
}

export default DashboardPage;
