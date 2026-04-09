import AuthForm from "../components/AuthForm";

function AuthPage() {
  return (
    <main className="flex min-h-screen items-center justify-center px-4 py-8">
      <div className="flex w-full max-w-xl flex-col gap-8">
        <h1 className="text-center text-4xl font-semibold text-neutral-950">
          ငွေလွှဲ / ငွေထုတ်
        </h1>
        <p className="text-center text-sm">မေမေ နဲ့ အန်တီ ရို့အတွက်...</p>
        <div className="overflow-hidden rounded-md border border-neutral-200 bg-white shadow-[0_30px_100px_rgba(0,0,0,0.08)]">
          <section className="bg-white p-6 sm:p-10">
            <AuthForm />
          </section>
        </div>
      </div>
    </main>
  );
}

export default AuthPage;
