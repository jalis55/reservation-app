import React from 'react'

const Unauthorized = () => {
  return (
   <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 py-12 text-center sm:px-6 lg:px-8">
      <div className="mx-auto max-w-md">
        {/* Lock icon */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-red-100 text-red-500">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="h-10 w-10"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
            />
          </svg>
        </div>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-800 sm:text-4xl">
          401 – Unauthorized
        </h1>

        <p className="mt-4 text-base text-slate-600 sm:text-lg">
          You don’t have permission to view this page.
        </p>

        {/* Optional actions */}
        <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center rounded-md border border-slate-300 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            ← Go back
          </button>

          <a
            href="/"
            className="inline-flex items-center justify-center rounded-md bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          >
            Take me home
          </a>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-4 left-0 right-0 text-center text-xs text-slate-400">
        © {new Date().getFullYear()} Reserva
      </footer>
    </main>
  )
}

export default Unauthorized
