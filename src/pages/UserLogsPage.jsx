import { useState } from "react";
import UseLogForm from "../components/UseLogForm";
import { useAuth } from "../context/AuthContext";
import { createUseLog, getUseLogMutationErrorMessage } from "../services/useLogs";
import { formatDateInput } from "../utils/date";

function UserLogsPage() {
  const { user } = useAuth();
  const [actionError, setActionError] = useState("");

  const handleSubmit = async (values) => {
    setActionError("");
    const payload = {
      ...values,
      userId: user.uid,
      date: formatDateInput(new Date()),
    };

    try {
      await createUseLog(payload);
    } catch (error) {
      console.error("Use log save failed:", error);
      setActionError(getUseLogMutationErrorMessage(error));
      throw error;
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-3xl font-semibold text-neutral-950">အသုံးစရိတ်ထည့်ရန်</h1>
      {actionError ? (
        <div className="rounded-md border border-neutral-200 bg-white px-4 py-3 text-sm text-neutral-700 shadow-[0_18px_50px_rgba(0,0,0,0.04)]">
          {actionError}
        </div>
      ) : null}
      <UseLogForm onSubmit={handleSubmit} />

    </div>
  );
}

export default UserLogsPage;
