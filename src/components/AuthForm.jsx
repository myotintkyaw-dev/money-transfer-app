import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getAuthErrorMessage } from "../services/auth";
import LoadingSpinner from "./LoadingSpinner";
import {
  formInputClass,
  formLabelClass,
  inlineMessageClass,
  primaryButtonClass,
} from "./formStyles";

const initialState = {
  email: "",
  password: "",
};

function AuthForm() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState("login");
  const [formData, setFormData] = useState(initialState);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const isLogin = mode === "login";

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      if (isLogin) {
        await login(formData.email, formData.password);
      } else {
        await register(formData.email, formData.password);
      }

      navigate("/", { replace: true });
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="mb-6 flex text-sm font-medium rounded-md border border-neutral-200 bg-neutral-100 p-1">
        {["login", "register"].map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => {
              setMode(item);
              setError("");
            }}
            className={`flex-1 rounded-md px-4 py-2 text-sm font-medium capitalize transition ${mode === item
              ? "bg-white text-neutral-950 shadow-[0_1px_3px_rgba(0,0,0,0.08)]"
              : "text-neutral-500"
              }`}
          >
            {item === "login" ? "ဝင်ရန်" : "လျှောက်ရန်"}
          </button>
        ))}
      </div>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-neutral-500">
            အီးမေးလ်
          </span>
          <input
            required
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="name@mail.com"
            className={`${formInputClass} ring-0`}
          />
        </label>

        <label className="block">
          <span className={formLabelClass}>
            စကားဝှက်
          </span>
          <input
            required
            minLength={6}
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="စာလုံးရေ ၆ လုံးအနည်းဆုံးထည့်ပါ"
            className={`${formInputClass} ring-0`}
          />
        </label>

        {error ? (
          <div className={inlineMessageClass}>
            {error}
          </div>
        ) : null}

        <button
          type="submit"
          disabled={submitting}
          className={primaryButtonClass}
        >
          {submitting ? (
            <span className="flex items-center justify-center">
              <LoadingSpinner />
            </span>
          ) : isLogin ? (
            "အကောင့်ဝင်ပါ"
          ) : (
            "အကောင့်လျှောက်ပါ"
          )}
        </button>
      </form>
    </div>
  );
}

export default AuthForm;
