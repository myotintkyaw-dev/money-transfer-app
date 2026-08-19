import { useEffect, useRef, useState } from "react";
import CustomSelect from "./CustomSelect";
import LoadingSpinner from "./LoadingSpinner";
import {
  formInputClass,
  formLabelClass,
  formSectionClass,
  primaryButtonClass,
} from "./formStyles";

const useLogTypeOptions = [
  { value: "in", label: "အဝင်" },
  { value: "out", label: "အထွက်" },
];

const useLogLocationOptions = [
  { value: "sittwe", label: "စစ်တွေ" },
  { value: "yangon", label: "ရန်ကုန်" },
];

function getDefaultValues() {
  return {
    amount: "",
    type: "out",
    location: "sittwe",
    note: "",
  };
}

function UseLogForm({ onSubmit }) {
  const [formData, setFormData] = useState(getDefaultValues);
  const [submitting, setSubmitting] = useState(false);
  const [showSavedState, setShowSavedState] = useState(false);
  const successTimeoutRef = useRef(null);

  useEffect(() => {
    return () => {
      if (successTimeoutRef.current) {
        window.clearTimeout(successTimeoutRef.current);
      }
    };
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setShowSavedState(false);

    try {
      await onSubmit(formData);
      setFormData(getDefaultValues());
      setShowSavedState(true);

      if (successTimeoutRef.current) {
        window.clearTimeout(successTimeoutRef.current);
      }

      successTimeoutRef.current = window.setTimeout(() => {
        setShowSavedState(false);
      }, 2000);
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
            ငွေဝင်/ထွက် အမျိုးအစား
          </span>
          <CustomSelect
            name="type"
            value={formData.type}
            options={useLogTypeOptions}
            hideOptionIcons
            onChange={(value) =>
              setFormData((current) => ({ ...current, type: value }))
            }
          />
        </label>

        <label className="block">
          <span className={formLabelClass}>
            နေရာ
          </span>
          <CustomSelect
            name="location"
            value={formData.location}
            options={useLogLocationOptions}
            hideOptionIcons
            onChange={(value) =>
              setFormData((current) => ({ ...current, location: value }))
            }
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

        <button
          type="submit"
          disabled={submitting}
          className={primaryButtonClass}
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner />
            </span>
          ) : showSavedState ? (
            "Saved"
          ) : (
            "အသုံးစရိတ်ထည့်ပါ"
          )}
        </button>
      </form>
    </section>
  );
}

export default UseLogForm;
