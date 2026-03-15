import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mainContainer flex flex-col items-center justify-center min-h-[calc(100vh-160px)] text-center py-20">
      <div className="relative mb-8">
        <h1 className="text-[8rem] md:text-[12rem] font-extrabold leading-none text-transparent bg-clip-text bg-gradient-to-b from-accent to-dark-accent select-none">
          404
        </h1>
        <div className="absolute inset-0 blur-3xl opacity-20 bg-accent rounded-full" />
      </div>

      <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
        Page not found
      </h2>
      <p className="text-gray-400 max-w-md mb-10 text-lg">
        The page you&apos;re looking for doesn&apos;t exist or has been moved.
      </p>

      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/"
          className="px-8 py-3 rounded-lg bg-gradient-to-r from-dark-accent to-accent text-white font-semibold hover:opacity-90 transition-opacity"
        >
          Back to Home
        </Link>
        <Link
          href="/component"
          className="px-8 py-3 rounded-lg border border-[#333] text-gray-300 font-semibold hover:bg-[#2a2a2a] hover:text-white transition-colors"
        >
          Browse Components
        </Link>
      </div>
    </main>
  );
}
