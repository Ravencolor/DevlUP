"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { CATEGORY_COLORS, CATEGORY_ICONS } from "../mockData";

type EndpointParam = {
  id: number;
  name: string;
  location: "query" | "path" | "header" | "body";
  required: boolean;
  type: string;
  description: string;
};

type EndpointResponse = {
  id: number;
  status: number;
  description: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  example: any;
};

type EndpointData = {
  id: number;
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  summary: string;
  description: string;
  tags: string[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  requestBody: any;
  parameters: EndpointParam[];
  responses: EndpointResponse[];
};

type ApiDetail = {
  id: number;
  userId: number;
  name: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  category: string;
  baseUrl: string | null;
  version: string;
  createdAt: string;
  user: { firstName: string | null; lastName: string | null; emailId: string };
  endpoints: EndpointData[];
};

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
  const { data: session } = useSession();
  const [api, setApi] = useState<ApiDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [endpointForm, setEndpointForm] = useState({
    method: "GET",
    path: "",
    summary: "",
    description: "",
    tags: "",
    requestBody: "",
    responseStatus: "200",
    responseDescription: "Succès",
    responseExample: "",
  });

  useEffect(() => {
    fetch(`/api/apis/${params.id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then((data) => setApi(data))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-500">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !api) {
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
  const isOwner = Number(session?.user?.id) === api.userId;

  const tags = [...new Set(api.endpoints.flatMap((e) => e.tags || []))];

  const handleCreateEndpoint = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    let parsedRequestBody: Record<string, unknown> | null = null;
    if (endpointForm.requestBody.trim()) {
      try {
        const parsed = JSON.parse(endpointForm.requestBody);
        if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
          setSubmitError("Le corps de requête doit être un objet JSON.");
          return;
        }
        parsedRequestBody = parsed;
      } catch {
        setSubmitError("Le JSON du corps de requête est invalide.");
        return;
      }
    }

    let parsedResponseExample: unknown = null;
    if (endpointForm.responseExample.trim()) {
      try {
        parsedResponseExample = JSON.parse(endpointForm.responseExample);
      } catch {
        setSubmitError("Le JSON de l'exemple de réponse est invalide.");
        return;
      }
    }

    const responseStatus = parseInt(endpointForm.responseStatus, 10);
    if (!Number.isInteger(responseStatus)) {
      setSubmitError("Le statut HTTP de réponse est invalide.");
      return;
    }

    const res = await fetch(`/api/apis/${api.id}/endpoints`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        method: endpointForm.method,
        path: endpointForm.path,
        summary: endpointForm.summary,
        description: endpointForm.description,
        tags: endpointForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
        requestBody: parsedRequestBody,
        responses: [
          {
            status: responseStatus,
            description: endpointForm.responseDescription,
            example: parsedResponseExample,
          },
        ],
      }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setSubmitError(data.error || "Impossible d'ajouter cet endpoint.");
      return;
    }

    const newEndpoint = await res.json();
    setApi((prev) => {
      if (!prev) return prev;
      return { ...prev, endpoints: [...prev.endpoints, newEndpoint] };
    });
    setShowModal(false);
    setEndpointForm({
      method: "GET",
      path: "",
      summary: "",
      description: "",
      tags: "",
      requestBody: "",
      responseStatus: "200",
      responseDescription: "Succès",
      responseExample: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4 mb-4">
            <Link href="/apiHub" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Retour au Hub
            </Link>
            <Link href="/threads" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              Retour au forum
            </Link>
          </div>

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
                  <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                    v{api.version}
                  </span>
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

          {isOwner && (
            <div className="mt-4">
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-5 py-2.5 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.01] cursor-pointer"
              >
                + Ajouter un endpoint
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Documentation */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {api.endpoints.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-2xl border border-gray-200">
            <div className="text-5xl mb-4">📄</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Pas de documentation disponible</h3>
            <p className="text-gray-500">Cette API n&apos;a pas encore d&apos;endpoints documentés.</p>
          </div>
        ) : (
          <>
            {tags.length > 0 && (
              <div className="flex flex-wrap items-center gap-2 mb-6">
                <span className="text-sm font-medium text-gray-500">Tags :</span>
                {tags.map((tag) => (
                  <span key={tag} className="px-3 py-1 bg-white border border-gray-200 rounded-full text-xs font-medium text-gray-700">{tag}</span>
                ))}
              </div>
            )}

            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900">📡 Endpoints ({api.endpoints.length})</h2>
            </div>

            <div className="space-y-4">
              {api.endpoints.map((endpoint) => (
                <EndpointCard key={endpoint.id} endpoint={endpoint} baseUrl={api.baseUrl} />
              ))}
            </div>
          </>
        )}
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Documenter un endpoint</h2>
              <button
                onClick={() => setShowModal(false)}
                className="p-2 hover:bg-gray-100 rounded-xl transition-colors cursor-pointer"
              >
                <svg
                  className="w-5 h-5 text-gray-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateEndpoint} className="space-y-4">
              {submitError && (
                <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {submitError}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Méthode</label>
                  <select
                    value={endpointForm.method}
                    onChange={(e) => setEndpointForm((prev) => ({ ...prev, method: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white"
                  >
                    {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => (
                      <option key={method} value={method}>
                        {method}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Path</label>
                  <input
                    required
                    value={endpointForm.path}
                    onChange={(e) => setEndpointForm((prev) => ({ ...prev, path: e.target.value }))}
                    placeholder="/users/{id}"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Résumé</label>
                <input
                  required
                  value={endpointForm.summary}
                  onChange={(e) => setEndpointForm((prev) => ({ ...prev, summary: e.target.value }))}
                  placeholder="Récupérer un utilisateur"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  required
                  rows={3}
                  value={endpointForm.description}
                  onChange={(e) => setEndpointForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="Décrit ce que fait l'endpoint..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tags (séparés par des virgules)</label>
                <input
                  value={endpointForm.tags}
                  onChange={(e) => setEndpointForm((prev) => ({ ...prev, tags: e.target.value }))}
                  placeholder="users, profile"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status réponse</label>
                  <input
                    required
                    type="number"
                    value={endpointForm.responseStatus}
                    onChange={(e) => setEndpointForm((prev) => ({ ...prev, responseStatus: e.target.value }))}
                    placeholder="200"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description réponse</label>
                  <input
                    required
                    value={endpointForm.responseDescription}
                    onChange={(e) => setEndpointForm((prev) => ({ ...prev, responseDescription: e.target.value }))}
                    placeholder="Succès"
                    className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Corps de requête (JSON objet, optionnel)</label>
                <textarea
                  rows={4}
                  value={endpointForm.requestBody}
                  onChange={(e) => setEndpointForm((prev) => ({ ...prev, requestBody: e.target.value }))}
                  placeholder={'{ "name": "John Doe" }'}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-mono text-xs resize-y"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Exemple de réponse (JSON, optionnel)</label>
                <textarea
                  rows={4}
                  value={endpointForm.responseExample}
                  onChange={(e) => setEndpointForm((prev) => ({ ...prev, responseExample: e.target.value }))}
                  placeholder={'{ "id": 1, "name": "John Doe" }'}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 font-mono text-xs resize-y"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function EndpointCard({ endpoint, baseUrl }: { endpoint: EndpointData; baseUrl: string | null }) {
  const [open, setOpen] = useState(false);

  return (
    <div className={`rounded-xl border transition-all ${METHOD_BG[endpoint.method]}`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center gap-3 px-5 py-4 cursor-pointer">
        <span className={`${METHOD_COLORS[endpoint.method]} text-white text-xs font-bold px-3 py-1.5 rounded-md min-w-[60px] text-center`}>{endpoint.method}</span>
        <code className="text-sm font-mono text-gray-800 font-semibold">{endpoint.path}</code>
        <span className="text-sm text-gray-500 ml-2 hidden sm:inline">{endpoint.summary}</span>
        {endpoint.tags && endpoint.tags.length > 0 && (
          <div className="ml-auto hidden md:flex items-center gap-1">
            {endpoint.tags.map((tag) => (
              <span key={tag} className="px-2 py-0.5 bg-white/70 rounded text-[10px] font-medium text-gray-500 border border-gray-200">{tag}</span>
            ))}
          </div>
        )}
        <svg className={`w-5 h-5 text-gray-400 ml-auto transition-transform ${open ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="px-5 pb-5 border-t border-gray-200/50">
          <div className="pt-4 space-y-5">
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
                      {endpoint.parameters.map((param) => (
                        <tr key={param.id} className="border-b border-gray-100 last:border-0">
                          <td className="py-2 px-3"><code className="text-xs font-mono text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded">{param.name}</code></td>
                          <td className="py-2 px-3"><span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{param.location}</span></td>
                          <td className="py-2 px-3 text-xs text-gray-600">{param.type}</td>
                          <td className="py-2 px-3">
                            {param.required ? <span className="text-xs font-semibold text-red-600">oui</span> : <span className="text-xs text-gray-400">non</span>}
                          </td>
                          <td className="py-2 px-3 text-xs text-gray-600">{param.description}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {endpoint.requestBody ? (
              <div>
                <h4 className="text-sm font-semibold text-gray-900 mb-2">📦 Corps de la requête</h4>
                <pre className="bg-gray-900 text-green-400 text-xs rounded-lg p-4 overflow-x-auto font-mono">
                  {String(JSON.stringify(endpoint.requestBody, null, 2))}
                </pre>
              </div>
            ) : null}

            <div>
              <h4 className="text-sm font-semibold text-gray-900 mb-2">📨 Réponses</h4>
              <div className="space-y-3">
                {endpoint.responses.map((response) => {
                  const exampleStr = response.example ? String(JSON.stringify(response.example, null, 2)) : null;
                  return (
                    <div key={response.id} className="rounded-lg border border-gray-200 overflow-hidden">
                      <div className="flex items-center gap-2 px-4 py-2 bg-white">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${response.status < 300 ? "bg-green-100 text-green-700" : response.status < 500 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>
                          {response.status}
                        </span>
                        <span className="text-sm text-gray-700">{response.description}</span>
                      </div>
                      {exampleStr ? (
                        <pre className="bg-gray-900 text-green-400 text-xs p-4 overflow-x-auto font-mono border-t border-gray-200">
                          {exampleStr}
                        </pre>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
