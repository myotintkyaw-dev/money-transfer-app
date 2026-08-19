import { useState } from "react";
import InitialAmountForm from "../components/InitialAmountForm";
import { useAuth } from "../context/AuthContext";
import { useInitialAmounts } from "../hooks/useInitialAmounts";
import { getInitialAmountMutationErrorMessage } from "../services/initialAmounts";
import { formatDateInput } from "../utils/date";

function InitialAmountPage() {
    const { user } = useAuth();
    const [initialAmountError, setInitialAmountError] = useState("");
    const {
        initialAmounts,
        createInitialAmount,
        editInitialAmount,
    } = useInitialAmounts({
        userId: user?.uid ?? null,
    });
    const currentInitialAmount = initialAmounts[0] || null;

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
            throw error;
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <h1 className="text-3xl font-semibold text-neutral-950">အရင်းငွေထည့်ရန်</h1>
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
    );
}

export default InitialAmountPage;
