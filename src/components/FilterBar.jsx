import { FILTER_OPTIONS } from "../constants/filters";

function FilterBar({
  filter,
  customStartDate,
  customEndDate,
  onFilterChange,
  onCustomDateChange,
}) {
  return (
    <section>
      <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 text-sm font-medium">
            {FILTER_OPTIONS.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => onFilterChange(option.value)}
                className={`inline-flex appearance-none items-center justify-center rounded-full px-4 py-2 leading-5 [font:inherit] ${filter === option.value
                  ? "bg-neutral-950 text-white"
                  : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950"
                  } transition`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {filter === "custom" ? (
          <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center">
            <label className="block flex-1">
              <input
                type="date"
                value={customStartDate}
                onChange={(event) =>
                  onCustomDateChange("startDate", event.target.value)
                }
                className="w-full rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 outline-none ring-1 ring-inset ring-transparent transition focus:bg-neutral-200 focus:text-neutral-950 focus:ring-transparent"
              />
            </label>
            <span className="text-sm text-center font-medium text-neutral-500">to</span>
            <label className="block flex-1">
              <input
                type="date"
                value={customEndDate}
                onChange={(event) =>
                  onCustomDateChange("endDate", event.target.value)
                }
                className="w-full rounded-full bg-neutral-100 px-4 py-2 text-sm font-medium text-neutral-700 outline-none ring-1 ring-inset ring-transparent transition focus:bg-neutral-200 focus:text-neutral-950 focus:ring-transparent"
              />
            </label>
          </div>
        ) : null}
      </div>
    </section>
  );
}

export default FilterBar;
