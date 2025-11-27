export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="max-w-md text-center px-6">
        <h1 className="text-4xl font-semibold mb-4">
          ECHORA
        </h1>
        <p className="text-gray-300 mb-8">
          Train an AI version of you. Let it talk, sell, and respond
          like you – while you live your life.
        </p>
        <a
          href="/login"
          className="inline-flex items-center justify-center rounded-full px-6 py-3 text-sm font-medium bg-purple-600 hover:bg-purple-500 transition"
        >
          Enter the Echo Chamber
        </a>
      </div>
    </main>
  );
}
