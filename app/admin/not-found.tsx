export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-eo-bg via-white to-eo-sky/30 flex items-center justify-center p-4">
      <div className="text-center max-w-md">
        <h1 className="text-6xl font-brand font-bold text-eo-teal mb-4">404</h1>
        <p className="text-xl text-eo-dark font-sub mb-8">Page not found</p>
        <a
          href="/"
          className="inline-block px-6 py-3 bg-eo-teal hover:bg-eo-dark text-white font-brand font-semibold rounded-lg
                   transition-all duration-200 shadow-brand hover:shadow-glow
                   focus:outline-none focus:ring-2 focus:ring-eo-sky focus:ring-offset-2"
        >
          Return Home
        </a>
      </div>
    </div>
  )
}

