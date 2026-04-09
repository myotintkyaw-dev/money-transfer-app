import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import AppShell from "./components/AppShell";
import LoadingSpinner from "./components/LoadingSpinner";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./context/AuthContext";

const AuthPage = lazy(() => import("./pages/AuthPage"));
const DashboardPage = lazy(() => import("./pages/DashboardPage"));
const AddLogsPage = lazy(() => import("./pages/AddLogsPage"));
const UserLogsPage = lazy(() => import("./pages/UserLogsPage"));
const AddLogsRecordsPage = lazy(() => import("./pages/AddLogsRecordsPage"));
const UseLogsRecordsPage = lazy(() => import("./pages/UseLogsRecordsPage"));

function LoadingScreen({ message }) {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3 text-sm text-slate-600">
        <LoadingSpinner
          sizeClass="h-8 w-8"
          colorClass="border-neutral-300 border-t-neutral-950"
        />
        <span>{message}</span>
      </div>
    </div>
  );
}

function App() {
  const { user, authReady } = useAuth();

  if (!authReady) {
    return <LoadingScreen message="" />;
  }

  return (
    <Suspense
      fallback={<LoadingScreen message="" />}
    >
      <Routes>
        <Route
          path="/auth"
          element={user ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="add-logs" element={<AddLogsPage />} />
          <Route path="userlogs" element={<UserLogsPage />} />
          <Route path="records" element={<Navigate to="/records/add-logs" replace />} />
          <Route path="records/add-logs" element={<AddLogsRecordsPage />} />
          <Route path="records/use-logs" element={<UseLogsRecordsPage />} />
        </Route>
        <Route
          path="*"
          element={<Navigate to={user ? "/dashboard" : "/auth"} replace />}
        />
      </Routes>
    </Suspense>
  );
}

export default App;
