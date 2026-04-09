import { useEffect, useRef, useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navigationItems = [
  { to: "/dashboard", label: "ပင်မစာမျက်နှာ" },
  { to: "/add-logs", label: "ငွေစာရင်းထည့်ရန်" },
  { to: "/userlogs", label: "အသုံးစရိတ်ထည့်ရန်" },
];

const moreItems = [
  { to: "/initial-amount", label: "အရင်းငွေထည့်ရန်" },
  { action: "logout", label: "အကောင့်မှထွက်ရန်" },
];

const recordsItems = [
  { to: "/records/add-logs", label: "ငွေစာရင်းများ" },
  { to: "/records/use-logs", label: "အသုံးစရိတ်များ" },
];

function getNavItemClass(isActive) {
  return `inline-flex items-center justify-center rounded-full px-4 py-2 text-sm font-medium transition ${isActive
    ? "bg-neutral-950 text-white"
    : "text-neutral-700 hover:bg-neutral-200 hover:text-neutral-950 gap-2"
    }`;
}

function Navbar() {
  const { logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [recordsOpen, setRecordsOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);
  const recordsRef = useRef(null);
  const moreRef = useRef(null);
  const isRecordsRoute = location.pathname.startsWith("/records");

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!recordsRef.current?.contains(event.target)) {
        setRecordsOpen(false);
      }
      if (!moreRef.current?.contains(event.target)) {
        setMoreOpen(false);
      }
    };
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, []);

  return (
    <nav className="sticky top-0 z-10 w-full bg-neutral-100 py-5 transition-[padding,background-color] duration-200">
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-2 px-4 sm:px-6 lg:px-8">
        <div className="min-h-10 flex-0" />
        <div className="flex flex-wrap items-center justify-end gap-2">
          {navigationItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === "/dashboard"}
              className={({ isActive }) => getNavItemClass(isActive)}
              aria-label={item.label}
              title={item.label}
            >
              {item.label}
            </NavLink>
          ))}

          <div ref={recordsRef} className="relative text-sm font-medium">
            <button
              type="button"
              onClick={() => setRecordsOpen((current) => !current)}
              className={`${getNavItemClass(isRecordsRoute)} gap-2`}
              aria-haspopup="menu"
              aria-expanded={recordsOpen}
              aria-label="စာရင်းများ"
              title="စာရင်းများ"
            >
              <span>စာရင်းများ</span>
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

          <div ref={moreRef} className="relative text-sm font-medium">
            <button
              type="button"
              onClick={() => setMoreOpen((current) => !current)}
              className={getNavItemClass(false)}
              aria-haspopup="menu"
              aria-expanded={moreOpen}
              aria-label="နောက်ထပ်"
              title="နောက်ထပ်"
            >
              <span>နောက်ထပ်</span>
              <i
                aria-hidden="true"
                className={`fa-solid fa-angle-down text-xs transition-transform ${moreOpen ? "rotate-180" : ""
                  }`}
              />
            </button>
            {moreOpen ? (
              <div className="absolute right-0 top-[calc(100%+8px)] z-20 min-w-40 rounded-md border border-neutral-200 bg-white p-1 shadow-[0_18px_50px_rgba(0,0,0,0.08)]">
                {moreItems.map((item) => {
                  if (item.to) {
                    return (
                      <button
                        key={item.to}
                        type="button"
                        onClick={() => {
                          navigate(item.to);
                          setMoreOpen(false);
                        }}
                        className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950"
                      >
                        {item.label}
                      </button>
                    );
                  }
                  if (item.action === "logout") {
                    return (
                      <button
                        key={item.action}
                        type="button"
                        onClick={() => {
                          logout();
                          setMoreOpen(false);
                        }}
                        className="flex w-full items-center rounded-md px-3 py-2 text-left text-sm font-medium text-red-500 hover:bg-red-50 hover:text-red-500"
                      >
                        {item.label}
                      </button>
                    );
                  }
                  return null;
                })}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
