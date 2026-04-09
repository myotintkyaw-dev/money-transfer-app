import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

function AppShell() {
  return (
    <main className="min-h-screen pb-4 pt-0">
      <div className="flex w-full flex-col gap-6">
        <Navbar />
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </div>
    </main>
  );
}

export default AppShell;
