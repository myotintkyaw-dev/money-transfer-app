import { useEffect, useState } from "react";
import CustomSelect from "./CustomSelect";
import { formatDateInput } from "../utils/date";
import LoadingSpinner from "./LoadingSpinner";
import {
  formInputClass,
  formLabelClass,
  formSectionClass,
  primaryButtonClass,
  secondaryButtonClass,
} from "./formStyles";

function getDefaultValues() {
  return {
    date: formatDateInput(new Date()),
    sender: "",
    receiver: "",
    type: "send",
    amount: "",
    commission: "",
    note: "",
  };
}

function getEditableDate(dateValue) {
  if (!dateValue) {
    return formatDateInput(new Date());
  }

  if (typeof dateValue === "string") {
    return dateValue;
  }

  return formatDateInput(dateValue.toDate());
}

function getEditableType(typeValue) {
  if (typeValue === "income") {
    return "receive";
  }

  if (typeValue === "expense") {
    return "send";
  }

  return typeValue || "send";
}

const transactionTypeOptions = [
  { value: "send", label: "အထွက်" },
  { value: "receive", label: "အဝင်" },
];

function TransactionForm({ onSubmit, editingTransaction, onCancel }) {
  const [formData, setFormData] = useState(getDefaultValues);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        date: getEditableDate(editingTransaction.date),
        sender: editingTransaction.sender || "",
        receiver: editingTransaction.receiver || "",
        type: getEditableType(editingTransaction.type),
        amount: String(editingTransaction.amount),
        commission: String(editingTransaction.commission ?? ""),
        note: editingTransaction.note || "",
      });
      return;
    }

    setFormData(getDefaultValues());
  }, [editingTransaction]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(formData);
      setFormData(getDefaultValues());
    } catch {
      // The page displays the mutation error; preserve the user's input.
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={formSectionClass}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className={formLabelClass}>
            ရက်
          </span>
          <input
            required
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={formInputClass}
          />
        </label>

        <label className="block">
          <span className={formLabelClass}>
            ပို့သူ
          </span>
          <input
            required
            type="text"
            name="sender"
            value={formData.sender}
            onChange={handleChange}
            className={formInputClass}
          />
        </label>

        <label className="block">
          <span className={formLabelClass}>
            လက်ခံသူ
          </span>
          <input
            required
            type="text"
            name="receiver"
            value={formData.receiver}
            onChange={handleChange}
            className={formInputClass}
          />
        </label>

        <label className="block">
          <span className={formLabelClass}>
            ငွေဝင်/ထွက် အမျိုးအစား
          </span>
          <CustomSelect
            name="type"
            value={formData.type}
            options={transactionTypeOptions}
            hideOptionIcons
            onChange={(value) =>
              setFormData((current) => ({ ...current, type: value }))
            }
          />
        </label>

        <label className="block">
          <span className={formLabelClass}>
            ငွေပမာဏ
          </span>
          <input
            required
            min="0.01"
            step="0.01"
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            className={formInputClass}
          />
        </label>

        <label className="block">
          <span className={formLabelClass}>
            ငွေလွှဲ/ထုတ်ခ
          </span>
          <input
            required
            min="0"
            step="0.01"
            type="number"
            name="commission"
            value={formData.commission}
            onChange={handleChange}
            className={formInputClass}
          />
        </label>

        <label className="block">
          <span className={formLabelClass}>
            မှတ်ချက်
          </span>
          <textarea
            rows={3}
            name="note"
            value={formData.note}
            onChange={handleChange}
            className={formInputClass}
          />
        </label>

        <div className="flex items-end gap-3">
          {editingTransaction ? (
            <button
              type="button"
              onClick={onCancel}
              className={`flex-1 ${secondaryButtonClass}`}
            >
              ပယ်ဖျက်မည်
            </button>
          ) : null}
          <button
            type="submit"
            disabled={submitting}
            className={`${editingTransaction ? "flex-1" : "w-full"} ${primaryButtonClass}`}
          >
            {submitting ? (
              <span className="flex items-center justify-center">
                <LoadingSpinner />
              </span>
            ) : editingTransaction ? (
              "အသစ်ပြင်မည်"
            ) : (
              "ငွေစာရင်းထည့်ပါ"
            )}
          </button>
        </div>
      </form>
    </section>
  );
}

export default TransactionForm;
