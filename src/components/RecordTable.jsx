import { useMemo } from "react";
import { formatCurrency } from "../utils/currency";
import { formatDisplayDate } from "../utils/date";
import LoadingSpinner from "./LoadingSpinner";

function getDisplayType(type) {
  if (type === "income" || type === "receive") {
    return "အဝင်";
  }

  return "အထွက်";
}

function getTimestampValue(timestamp) {
  if (!timestamp) {
    return 0;
  }

  if (typeof timestamp.toMillis === "function") {
    return timestamp.toMillis();
  }

  if (timestamp instanceof Date) {
    return timestamp.getTime();
  }

  return 0;
}

function RecordTable({ transactions, loading, onEdit }) {
  const addLogTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.source !== "useLog"),
    [transactions],
  );
  const sortedTransactions = useMemo(
    () =>
      [...addLogTransactions].sort((left, right) => {
        const dateDifference =
          getTimestampValue(right.date) - getTimestampValue(left.date);

        if (dateDifference !== 0) {
          return dateDifference;
        }

        const createdAtDifference =
          getTimestampValue(right.createdAt) - getTimestampValue(left.createdAt);

        if (createdAtDifference !== 0) {
          return createdAtDifference;
        }

        return right.id.localeCompare(left.id);
      }),
    [addLogTransactions],
  );

  return (
    <section className="rounded-md border border-black/8 bg-white p-6 shadow-[0_18px_50px_rgba(0,0,0,0.06)]">
      {loading ? (
        <div className="rounded-md border border-dashed border-neutral-200 px-4 py-10 text-center text-sm text-neutral-500">
          <div className="flex justify-center">
            <LoadingSpinner
              sizeClass="h-6 w-6"
              colorClass="border-neutral-300 border-t-neutral-950"
            />
          </div>
        </div>
      ) : addLogTransactions.length === 0 ? (
        <div className="rounded-md border border-dashed border-neutral-200 px-4 py-10 text-center text-sm text-neutral-500">
          No add logs records found for the selected filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-neutral-200">
          <table className="min-w-300 table-fixed divide-y divide-neutral-200 bg-white text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="w-10 px-4 py-3 font-semibold">ရက်</th>
                <th className="w-7.5 px-4 py-3 font-semibold">ငွေလွှဲ/ထုတ်</th>
                <th className="w-20 px-4 py-3 font-semibold">ငွေပမာဏ</th>
                <th className="w-25 px-4 py-3 font-semibold">ငွေလွှဲထုတ်ခ</th>
                <th className="w-30 px-4 py-3 font-semibold">ပို့သူ</th>
                <th className="w-30 px-4 py-3 font-semibold">လက်ခံသူ</th>
                <th className="w-35 px-4 py-3 font-semibold">မှတ်ချက်</th>
                <th className="w-20 px-4 py-3 font-semibold">လုပ်ဆောင်ချက်</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sortedTransactions.map((transaction) => (
                <tr key={transaction.id} className="text-neutral-700">
                  <td className="px-4 py-4 w-10 whitespace-nowrap">
                    {formatDisplayDate(transaction.date)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`rounded-md border px-3 py-1 text-xs font-semibold ${transaction.type === "receive" ||
                        transaction.type === "income"
                        ? "border-neutral-300 bg-neutral-100 text-neutral-900"
                        : "border-neutral-200 bg-white text-neutral-600"
                        }`}
                    >
                      {getDisplayType(transaction.type)}
                    </span>
                  </td>
                  <td className="px-4 py-4 font-semibold whitespace-nowrap text-neutral-950">
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-4 py-4 font-semibold whitespace-nowrap text-neutral-950">
                    {formatCurrency(transaction.commission || 0)}
                  </td>
                  <td className="px-4 py-4">{transaction.sender || "-"}</td>
                  <td className="px-4 py-4">{transaction.receiver || "-"}</td>
                  <td className="px-4 py-4">
                    {transaction.note || "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => onEdit(transaction)}
                      className="rounded-4xl border border-neutral-300 px-3 ms-5 py-1.5 text-xs font-semibold text-neutral-700 transition hover:border-neutral-950 hover:bg-neutral-950 hover:text-white focus:outline-none focus:ring-2 focus:ring-neutral-400"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default RecordTable;
