import { useState } from "react";
import FilterBar from "../components/FilterBar";
import RecordTable from "../components/RecordTable";
import TransactionForm from "../components/TransactionForm";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../hooks/useTransactions";
import { getTransactionMutationErrorMessage } from "../services/transactions";
import { formatDateInput } from "../utils/date";

function AddLogsRecordsPage() {
  const { user } = useAuth();
  const [filter, setFilter] = useState("today");
  const [customDates, setCustomDates] = useState({
    startDate: formatDateInput(new Date()),
    endDate: formatDateInput(new Date()),
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [actionError, setActionError] = useState("");
  const { transactions, loading, error, editTransaction } = useTransactions({
    userId: user?.uid ?? null,
    filter,
    customStartDate: customDates.startDate,
    customEndDate: customDates.endDate,
  });

  const handleEdit = async (values) => {
    if (!editingTransaction || !user) {
      return;
    }

    setActionError("");

    try {
      await editTransaction(editingTransaction.id, {
        ...values,
        userId: user.uid,
        sender: values.sender.trim(),
        receiver: values.receiver.trim(),
        note: values.note.trim(),
      });
      setEditingTransaction(null);
    } catch (saveError) {
      console.error("Transaction update failed:", saveError);
      setActionError(getTransactionMutationErrorMessage(saveError, "update"));
      throw saveError;
    }
  };

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

      {error || actionError ? (
        <div className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
          {error || actionError}
        </div>
      ) : null}

      {editingTransaction ? (
        <TransactionForm
          onSubmit={handleEdit}
          editingTransaction={editingTransaction}
          onCancel={() => setEditingTransaction(null)}
        />
      ) : null}

      <RecordTable
        transactions={transactions}
        loading={loading}
        onEdit={(transaction) => {
          setActionError("");
          setEditingTransaction(transaction);
        }}
      />
    </div>
  );
}

export default AddLogsRecordsPage;
