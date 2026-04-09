import { useEffect, useId, useRef, useState } from "react";
import { formInputClass, formOptionButtonClass } from "./formStyles";

function CustomSelect({
  options,
  value,
  onChange,
  name,
  hideOptionIcons = false,
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const listboxId = useId();
  const selectedOption =
    options.find((option) => option.value === value) || options[0];

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <input type="hidden" name={name} value={selectedOption.value} />
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        onClick={() => setOpen((current) => !current)}
        className={`${formInputClass} flex items-center justify-between text-left`}
      >
        <span className="text-neutral-950">{selectedOption.label}</span>
        <i
          aria-hidden="true"
          className={`fa-solid fa-angle-down text-sm text-neutral-500 transition-transform ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open ? (
        <div
          id={listboxId}
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-20 w-full rounded-md border border-neutral-200 bg-white p-1 shadow-[0_18px_50px_rgba(0,0,0,0.08)]"
        >
          {options.map((option) => {
            const isSelected = option.value === selectedOption.value;

            return (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={isSelected}
                onClick={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                className={`${formOptionButtonClass} ${
                  isSelected
                    ? "bg-neutral-100 text-neutral-950"
                    : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                }`}
              >
                <span className={hideOptionIcons ? "" : "flex items-center gap-3"}>
                  {!hideOptionIcons ? (
                    <i
                      aria-hidden="true"
                      className={`fa-solid ${
                        isSelected
                          ? "fa-circle-check text-neutral-950"
                          : "fa-circle text-neutral-300"
                      } text-xs`}
                    />
                  ) : null}
                  <span>{option.label}</span>
                </span>
                {!hideOptionIcons ? (
                  <i
                    aria-hidden="true"
                    className="fa-solid fa-angle-right text-xs text-neutral-400"
                  />
                ) : null}
              </button>
            );
          })}
        </div>
      ) : null}
    </div>
  );
}

export default CustomSelect;
