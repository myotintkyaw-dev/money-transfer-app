import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigationItems = [
  { to: "/dashboard", label: "Home", iconClass: "fa-solid fa-house" },
  { to: "/add-logs", label: "Add Logs" },
  { to: "/userlogs", label: "UseLogs" },
];

const recordsItems = [
  { to: "/records/add-logs", label: "Add logs" },
  { to: "/records/use-logs", label: "Use logs" },
];

function getNavItemClass(isActive) {
  return `inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${isActive
    ? "bg-neutral-950 text-white"
    : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950"
    }`;
}

function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [recordsOpen, setRecordsOpen] = useState(false);
  const recordsRef = useRef(null);
  const isRecordsRoute = location.pathname.startsWith("/records");

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!recordsRef.current?.contains(event.target)) {
        setRecordsOpen(false);
      }
    };

    document.addEventListener("mousedown", handlePointerDown);

    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-10 w-full bg-neutral-100 py-4 transition-[padding,background-color] duration-200">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <div className="min-h-10 flex-0" />
        <div className="flex flex-wrap items-center justify-center gap-1">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => getNavItemClass(isActive)}
              aria-label={item.label}
              title={item.label}
            >
              {item.iconClass ? (
                <i
                  aria-hidden="true"
                  className={`${item.iconClass} text-base`}
                />
              ) : (
                item.label
              )}
            </NavLink>
          ))}

          <div ref={recordsRef} className="relative text-sm font-medium">
            <button
              type="button"
              onClick={() => setRecordsOpen((current) => !current)}
              className={`${getNavItemClass(isRecordsRoute)} gap-2`}
              aria-haspopup="menu"
              aria-expanded={recordsOpen}
              aria-label="Records"
              title="Records"
            >
              <span>Records</span>
              <i
                aria-hidden="true"
                className={`fa-solid fa-angle-down text-xs transition-transform ${recordsOpen ? "rotate-180" : ""
                  }`}
              />
            </button>

            {recordsOpen ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-40 rounded-md border border-neutral-200 bg-white p-1 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
                {recordsItems.map((item) => {
                  const isActive = location.pathname === item.to;

                  return (
                    <button
                      key={item.to}
                      type="button"
                      onClick={() => {
                        navigate(item.to);
                        setRecordsOpen(false);
                      }}
                      className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium transition ${isActive
                        ? "bg-neutral-100 text-neutral-950"
                        : "text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                        }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            ) : null}
          </div>

          <button
            type="button"
            onClick={logout}
            aria-label="Logout"
            title="Logout"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-neutral-700 transition hover:bg-neutral-200 hover:text-neutral-950"
          >
            <i
              aria-hidden="true"
              className="fa-solid fa-right-from-bracket text-base"
            />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
