import { useState } from "react";
import TransactionForm from "../components/TransactionForm";
import { useAuth } from "../context/AuthContext";
import { useTransactions } from "../hooks/useTransactions";
import { getTransactionMutationErrorMessage } from "../services/transactions";

function AddLogsPage() {
  const { user } = useAuth();
  const { createTransaction, editTransaction } = useTransactions({
    userId: user?.uid ?? null,
    filter: "last30",
    customStartDate: "",
    customEndDate: "",
  });
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [actionError, setActionError] = useState("");

  const handleTransactionSubmit = async (values) => {
    setActionError("");

    const payload = {
      ...values,
      userId: user.uid,
      sender: values.sender.trim(),
      receiver: values.receiver.trim(),
      note: values.note.trim(),
    };

    try {
      if (editingTransaction) {
        await editTransaction(editingTransaction.id, payload);
        setEditingTransaction(null);
      } else {
        await createTransaction(payload);
      }
    } catch (error) {
      console.error("Transaction save failed:", error);
      setActionError(getTransactionMutationErrorMessage(error, "save"));
      throw error;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-neutral-950">ငွေစာရင်းထည့်ရန်</h1>
      {actionError ? (
        <div className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
          {actionError}
        </div>
      ) : null}
      <TransactionForm
        onSubmit={handleTransactionSubmit}
        editingTransaction={editingTransaction}
        onCancel={() => setEditingTransaction(null)}
      />
    </div>
  );
}

export default AddLogsPage;
