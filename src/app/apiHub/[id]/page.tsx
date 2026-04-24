"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  MOCK_APIS,
  MOCK_API_DOCS,
  CATEGORY_COLORS,
  CATEGORY_ICONS,
  type Endpoint,
} from "../mockData";

const METHOD_COLORS: Record<string, string> = {
  GET: "bg-green-500",
  POST: "bg-blue-500",
  PUT: "bg-orange-500",
  PATCH: "bg-yellow-500",
  DELETE: "bg-red-500",
};

const METHOD_BG: Record<string, string> = {
  GET: "bg-green-50 border-green-200 hover:bg-green-100",
  POST: "bg-blue-50 border-blue-200 hover:bg-blue-100",
  PUT: "bg-orange-50 border-orange-200 hover:bg-orange-100",
  PATCH: "bg-yellow-50 border-yellow-200 hover:bg-yellow-100",
  DELETE: "bg-red-50 border-red-200 hover:bg-red-100",
};

export default function ApiDetailPage() {
  const params = useParams();
  const apiId = Number(params.id);
  const api = MOCK_APIS.find((a) => a.id === apiId);
  const doc = MOCK_API_DOCS.find((d) => d.apiId === apiId);

  if (!api) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">API introuvable</h2>
          <Link href="/apiHub" className="text-blue-600 hover:underline">← Retour au Hub</Link>
        </div>
      </div>
    );
  }

  const authorName = api.user.firstName || api.user.lastName
    ? `${api.user.firstName || ""} ${api.user.lastName || ""}`.trim()
    : api.user.emailId;

  const tags = doc ? [...new Set(doc.endpoints.flatMap((e) => e.tags || []))] : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link href="/apiHub" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-4">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            Retour au Hub
          </Link>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-2xl shadow-lg">
                {api.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{api.name}</h1>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                  <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${api.visibility === "PUBLIC" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                    {api.visibility === "PUBLIC" ? "🌍 Public" : "🔒 Privé"}
                  </span>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${CATEGORY_COLORS[api.category]}`}>
                    {CATEGORY_ICONS[api.category]} {api.category}
                  </span>
                  {doc && (
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                      v{doc.version}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right text-sm text-gray-500 space-y-1">
              <div className="flex items-center gap-2 justify-end">
                <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
                  {authorName.charAt(0).toUpperCase()}
                </div>
                <span>{authorName}</span>
              </div>
              <div>
                {new Date(api.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
              </div>
            </div>
          </div>

          <p className="mt-4 text-gray-600 leading-relaxed">{api.description}</p>

          {api.baseUrl && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-gray-900 rounded-lg">
              <span className="text-xs text-gray-400 font-medium">BASE URL</span>
              <code className="text-sm text-green-400 font-mono">{api.baseUrl}</code>
            </div>
          )}
        </div>
      </div>

      {/* Documentation */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {!doc ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pas de documentation disponible</h3>
            <p className="text-gray-500">Cette API n&apos;a pas encore de documentation.</p>
          </div>
        ) : (
          <>
            {/* Tags summary */}
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm font-medium text-gray-500">Tags :</span>
                {tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Endpoints count */}
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">
                📡 Endpoints ({doc.endpoints.length})
              </h2>
            </div>

            {/* Endpoint list */}
            <div className="space-y-4">
              {doc.endpoints.map((endpoint, i) => (
                <EndpointCard key={i} endpoint={endpoint} baseUrl={api.baseUrl} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function EndpointCard({ endpoint, baseUrl }: { endpoint: Endpoint; baseUrl: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl border transition-all ${METHOD_BG[endpoint.method]}`}>
      {/* Header - clickable */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer"
      >
        <span className={`${METHOD_COLORS[endpoint.method]} text-white text-xs font-bold px-3 py-1.5 rounded-md min-w-[60px] text-center`}>
          {endpoint.method}
        </span>
        <code className="text-sm font-mono text-gray-800 font-semibold">{endpoint.path}</code>
        <span className="text-sm text-gray-500 ml-2 hidden sm:inline">{endpoint.summary}</span>
        {endpoint.tags && endpoint.tags.length > 0 && (
          <div className="ml-auto hidden md:flex items-center gap-1">
            {endpoint.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-white/70 rounded text-[10px] font-medium text-gray-500 border border-gray-200">
                {tag}
              </span>
            ))}
          </div>
        )}
        <svg className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Body - collapsible */}
      {open && (
        <div className="px-5 pb-5 border-t border-gray-200/50">
          <div className="pt-4 space-y-5">
            {/* Description */}
            <div>
              <p className="text-sm text-gray-700 leading-relaxed">{endpoint.description}</p>
              {baseUrl && (
                <div className="mt-2 px-3 py-2 bg-gray-900 rounded-lg inline-block">
                  <code className="text-xs text-gray-300">
                    <span className="text-yellow-400">{endpoint.method}</span>{" "}
                    <span className="text-green-400">{baseUrl}{endpoint.path}</span>
                  </code>
                </div>
              )}
            </div>

            {/* Parameters */}
            {endpoint.parameters && endpoint.parameters.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">📋 Paramètres</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-2 px-3 text-gray-500 font-medium text-xs">Nom</th>
                        <th className="text-left py-2 px-3 text-gray-500 font-medium text-xs">Emplacement</th>
                        <th className="text-left py-2 px-3 text-gray-500 font-medium text-xs">Type</th>
                        <th className="text-left py-2 px-3 text-gray-500 font-medium text-xs">Requis</th>
                        <th className="text-left py-2 px-3 text-gray-500 font-medium text-xs">Description</th>
                      </tr>
                    </thead>
                    <tbody>
                      {endpoint.parameters.map((param, i) => (
                        <tr key={i} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 px-3"><code className="text-xs font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{param.name}</code></td>
                          <td className="py-2 px-3"><span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{param.in}</span></td>
                          <td className="py-2 px-3 text-xs text-gray-600">{param.type}</td>
                          <td className="py-2 px-3">
                            {param.required ? (
                              <span className="text-xs font-semibold text-red-600">oui</span>
                            ) : (
                              <span className="text-xs text-gray-400">non</span>
                            )}
                          </td>
                          <td className="py-2 px-3 text-xs text-gray-600">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Request Body */}
            {endpoint.requestBody && (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">📦 Corps de la requête</h4>
                <div className="text-xs text-gray-500 mb-1">Content-Type: <code className="text-purple-600">{endpoint.requestBody.contentType}</code></div>
                <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto font-mono">
                  {JSON.stringify(endpoint.requestBody.schema, null, 2)}
                </pre>
              </div>
            )}

            {/* Responses */}
            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">📨 Réponses</h4>
              <div className="space-y-3">
                {endpoint.responses.map((res, i) => (
                  <div key={i} className="rounded-lg border border-gray-200 overflow-hidden">
                    <div className="flex items-center gap-2 px-4 py-2 bg-white">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded ${res.status < 300 ? "bg-green-100 text-green-700" : res.status < 500 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                        {res.status}
                      </span>
                      <span className="text-sm text-gray-700">{res.description}</span>
                    </div>
                    {res.example && (
                      <pre className="bg-gray-900 text-green-400 text-xs p-4 overflow-x-auto font-mono border-t border-gray-200">
                        {JSON.stringify(res.example as object, null, 2)}
                      </pre>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


