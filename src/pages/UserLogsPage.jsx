import { useState } from "react";
import InitialAmountForm from "../components/InitialAmountForm";
import UseLogForm from "../components/UseLogForm";
import { useAuth } from "../context/AuthContext";
import { useInitialAmounts } from "../hooks/useInitialAmounts";
import { getInitialAmountMutationErrorMessage } from "../services/initialAmounts";
import { createUseLog, getUseLogMutationErrorMessage } from "../services/useLogs";
import { formatDateInput } from "../utils/date";

function UserLogsPage() {
  const { user } = useAuth();
  const [actionError, setActionError] = useState("");
  const [initialAmountError, setInitialAmountError] = useState("");
  const { initialAmounts, createInitialAmount, editInitialAmount } = useInitialAmounts({
    userId: user?.uid ?? null,
    filter: "last30",
    customStartDate: "",
    customEndDate: "",
  });
  const currentInitialAmount = initialAmounts[0] || null;

  const handleSubmit = async (values) => {
    setActionError("");
    const payload = {
      ...values,
      userId: user.uid,
      date: formatDateInput(new Date()),
    };

    void createUseLog(payload).catch((error) => {
      console.error("Use log save failed:", error);
      setActionError(getUseLogMutationErrorMessage(error));
    });
  };

  const handleInitialAmountSubmit = async (values) => {
    setInitialAmountError("");

    try {
      const payload = {
        ...values,
        userId: user.uid,
        ...(currentInitialAmount?.date
          ? { date: formatDateInput(currentInitialAmount.date.toDate()) }
          : {}),
      };

      if (currentInitialAmount) {
        await editInitialAmount(currentInitialAmount.id, payload);
      } else {
        await createInitialAmount(payload);
      }
    } catch (error) {
      console.error("Initial amount save failed:", error);
      setInitialAmountError(getInitialAmountMutationErrorMessage(error));
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-neutral-950">Used Logs</h1>
      {actionError ? (
        <div className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
          {actionError}
        </div>
      ) : null}
      <UseLogForm onSubmit={handleSubmit} />

      <div className="flex flex-col gap-6">
        <h2 className="text-3xl font-semibold text-neutral-950">Initial Amount</h2>
        {initialAmountError ? (
          <div className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
            {initialAmountError}
          </div>
        ) : null}
        <InitialAmountForm
          onSubmit={handleInitialAmountSubmit}
          initialAmount={currentInitialAmount}
        />
      </div>
    </div>
  );
}

export default UserLogsPage;
