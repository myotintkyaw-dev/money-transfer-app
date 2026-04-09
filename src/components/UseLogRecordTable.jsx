import { useMemo } from "react";
import { formatCurrency } from "../utils/currency";
import { formatDisplayDate } from "../utils/date";
import LoadingSpinner from "./LoadingSpinner";

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

function getDisplayType(type) {
  return type === "out" ? "Out" : "In";
}

function getDisplayLocation(location) {
  return location === "yangon" ? "Yangon" : "Sittwe";
}

function UseLogRecordTable({ useLogs, loading }) {
  const sortedUseLogs = useMemo(
    () =>
      [...useLogs].sort((left, right) => {
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
    [useLogs],
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
      ) : useLogs.length === 0 ? (
        <div className="rounded-md border border-dashed border-neutral-200 px-4 py-10 text-center text-sm text-neutral-500">
          No use logs found for the selected filter.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-md border border-neutral-200">
          <table className="min-w-220 table-fixed divide-y divide-neutral-200 bg-white text-sm">
            <thead className="bg-neutral-50 text-left text-neutral-500">
              <tr>
                <th className="w-20 px-4 py-3 font-semibold">Date</th>
                <th className="w-12 px-4 py-3 font-semibold">Type</th>
                <th className="w-16 px-4 py-3 font-semibold">Location</th>
                <th className="w-20 px-4 py-3 font-semibold">Amount</th>
                <th className="w-40 px-4 py-3 font-semibold">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {sortedUseLogs.map((useLog) => (
                <tr key={useLog.id} className="text-neutral-700">
                  <td className="px-4 py-4 whitespace-nowrap">
                    {formatDisplayDate(useLog.date)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`rounded-md border px-3 py-1 text-xs font-semibold ${
                        useLog.type === "in"
                          ? "border-neutral-300 bg-neutral-100 text-neutral-900"
                          : "border-neutral-200 bg-white text-neutral-600"
                      }`}
                    >
                      {getDisplayType(useLog.type)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    {getDisplayLocation(useLog.location)}
                  </td>
                  <td className="px-4 py-4 font-semibold whitespace-nowrap text-neutral-950">
                    {formatCurrency(useLog.amount)}
                  </td>
                  <td className="px-4 py-4">{useLog.note || "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default UseLogRecordTable;
