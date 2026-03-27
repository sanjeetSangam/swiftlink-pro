"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [links, setLinks] = useState<{ original_url: string; slug: string }[]>(
    [],
  );
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    try {
      // DevOps Note: We now call the API via the Caddy proxy at /api
      const res = await fetch("/api/shorten", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      setLinks([data, ...links]);
      setUrl("");
    } catch (err) {
      console.error("Failed to shorten URL", err);
    } finally {
      setLoading(false);
    }
  };

  const getFullShortLink = (slug: string) => {
    if (typeof window !== "undefined") {
      return `${window.location.origin}/${slug}`;
    }
    return `/${slug}`;
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans p-8">
      <main className="max-w-2xl mx-auto space-y-12 py-20">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black tracking-tight text-indigo-600">
            SwiftLink Pro
          </h1>
          <p className="text-slate-500 text-lg">
            Professional Link Management. Fast. Secure. Reliable.
          </p>
        </div>

        <section className="bg-white p-6 rounded-2xl shadow-xl shadow-indigo-100 border border-indigo-50">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <input
              type="url"
              placeholder="Paste your long URL here..."
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all disabled:opacity-50"
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </form>
        </section>

        {links.length > 0 && (
          <section className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-xl font-bold px-2">Recent Links</h2>
            <div className="space-y-3">
              {links.map((link, index) => (
                <div
                  key={index}
                  className="bg-white p-4 rounded-xl border border-slate-100 flex justify-between items-center transition-all hover:border-indigo-200"
                >
                  <div className="truncate pr-4">
                    <p className="text-sm font-medium text-slate-400 truncate">
                      {link.original_url}
                    </p>
                    <a
                      href={getFullShortLink(link.slug)}
                      target="_blank"
                      className="text-indigo-600 font-bold hover:underline"
                    >
                      {getFullShortLink(link.slug)
                        .replace("http://", "")
                        .replace("https://", "")}
                    </a>
                  </div>
                  <button
                    onClick={() =>
                      navigator.clipboard.writeText(getFullShortLink(link.slug))
                    }
                    className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-indigo-600 transition-all"
                  >
                    Copy
                  </button>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
