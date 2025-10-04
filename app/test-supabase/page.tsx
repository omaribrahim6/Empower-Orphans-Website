import { supabase } from "@/lib/supabase";

export default async function TestSupabasePage() {
  const diagnostics: any = {
    timestamp: new Date().toISOString(),
    supabaseClientExists: !!supabase,
    envVars: {
      hasUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      urlPrefix: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 30),
    },
  };

  // Test hero_slides query
  if (supabase) {
    try {
      const { data: slides, error: slidesError } = await supabase
        .from('hero_slides')
        .select('*')
        .order('order', { ascending: true });

      diagnostics.heroSlides = {
        success: !slidesError,
        error: slidesError ? {
          message: slidesError.message,
          details: slidesError.details,
          hint: slidesError.hint,
          code: slidesError.code,
        } : null,
        count: slides?.length || 0,
        data: slides || [],
      };
    } catch (err: any) {
      diagnostics.heroSlides = {
        success: false,
        error: err.message || String(err),
      };
    }

    // Test events query
    try {
      const { data: events, error: eventsError } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: false });

      diagnostics.events = {
        success: !eventsError,
        error: eventsError ? {
          message: eventsError.message,
          details: eventsError.details,
          hint: eventsError.hint,
          code: eventsError.code,
        } : null,
        count: events?.length || 0,
        data: events || [],
      };
    } catch (err: any) {
      diagnostics.events = {
        success: false,
        error: err.message || String(err),
      };
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-900">
          Supabase Connection Diagnostics
        </h1>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Environment Variables
          </h2>
          <div className="space-y-2">
            <p className="font-mono text-sm">
              <span className="font-semibold">NEXT_PUBLIC_SUPABASE_URL:</span>{" "}
              {diagnostics.envVars.hasUrl ? (
                <span className="text-green-600">✓ Set ({diagnostics.envVars.urlPrefix}...)</span>
              ) : (
                <span className="text-red-600">✗ Missing</span>
              )}
            </p>
            <p className="font-mono text-sm">
              <span className="font-semibold">NEXT_PUBLIC_SUPABASE_ANON_KEY:</span>{" "}
              {diagnostics.envVars.hasKey ? (
                <span className="text-green-600">✓ Set</span>
              ) : (
                <span className="text-red-600">✗ Missing</span>
              )}
            </p>
            <p className="font-mono text-sm">
              <span className="font-semibold">Supabase Client:</span>{" "}
              {diagnostics.supabaseClientExists ? (
                <span className="text-green-600">✓ Initialized</span>
              ) : (
                <span className="text-red-600">✗ Not initialized</span>
              )}
            </p>
          </div>
        </div>

        {diagnostics.heroSlides && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Hero Slides Table
            </h2>
            {diagnostics.heroSlides.success ? (
              <div>
                <p className="text-green-600 font-semibold mb-2">
                  ✓ Success! Found {diagnostics.heroSlides.count} slides
                </p>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                  {JSON.stringify(diagnostics.heroSlides.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div>
                <p className="text-red-600 font-semibold mb-2">✗ Error</p>
                <pre className="bg-red-50 p-4 rounded overflow-auto text-xs text-red-900">
                  {JSON.stringify(diagnostics.heroSlides.error, null, 2)}
                </pre>
                {diagnostics.heroSlides.error?.hint && (
                  <p className="mt-4 text-sm text-gray-700">
                    <strong>Hint:</strong> {diagnostics.heroSlides.error.hint}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        {diagnostics.events && (
          <div className="bg-white rounded-lg shadow p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Events Table
            </h2>
            {diagnostics.events.success ? (
              <div>
                <p className="text-green-600 font-semibold mb-2">
                  ✓ Success! Found {diagnostics.events.count} events
                </p>
                <pre className="bg-gray-100 p-4 rounded overflow-auto text-xs">
                  {JSON.stringify(diagnostics.events.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div>
                <p className="text-red-600 font-semibold mb-2">✗ Error</p>
                <pre className="bg-red-50 p-4 rounded overflow-auto text-xs text-red-900">
                  {JSON.stringify(diagnostics.events.error, null, 2)}
                </pre>
                {diagnostics.events.error?.hint && (
                  <p className="mt-4 text-sm text-gray-700">
                    <strong>Hint:</strong> {diagnostics.events.error.hint}
                  </p>
                )}
              </div>
            )}
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">Quick Fixes:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-900">
            <li>Make sure you've created the tables in Supabase SQL Editor</li>
            <li>Check that Row Level Security (RLS) policies are set up</li>
            <li>Verify your .env.local has NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY</li>
            <li>Restart your dev server after changing .env.local</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

