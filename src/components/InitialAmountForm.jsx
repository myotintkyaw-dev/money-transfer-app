import { useEffect, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import {
  formInputClass,
  formLabelClass,
  formSectionClass,
  primaryButtonClass,
} from "./formStyles";

function getDefaultValues() {
  return {
    sittweAmount: "",
    yangonAmount: "",
  };
}

function InitialAmountForm({ onSubmit, initialAmount }) {
  const [formData, setFormData] = useState(getDefaultValues);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!initialAmount) {
      setFormData(getDefaultValues());
      return;
    }

    setFormData({
      sittweAmount: String(initialAmount.sittweAmount ?? ""),
      yangonAmount: String(initialAmount.yangonAmount ?? ""),
    });
  }, [initialAmount]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await onSubmit(formData);
      if (!initialAmount) {
        setFormData(getDefaultValues());
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className={formSectionClass}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className={formLabelClass}>
            Sittwe
          </span>
          <input
            required
            min="0"
            step="0.01"
            type="number"
            name="sittweAmount"
            value={formData.sittweAmount}
            onChange={handleChange}
            className={formInputClass}
          />
        </label>

        <label className="block">
          <span className={formLabelClass}>
            Yangon
          </span>
          <input
            required
            min="0"
            step="0.01"
            type="number"
            name="yangonAmount"
            value={formData.yangonAmount}
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
          ) : initialAmount ? (
            "Update initial amount"
          ) : (
            "Set initial amount"
          )}
        </button>
      </form>
    </section>
  );
}

export default InitialAmountForm;
