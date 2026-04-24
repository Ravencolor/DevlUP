"use client";

import React, { useState, useMemo } from "react";

type Api = {
  id: number;
  name: string;
  description: string;
  visibility: "PUBLIC" | "PRIVATE";
  category: string;
  baseUrl: string | null;
  createdAt: string;
  user: {
    firstName: string | null;
    lastName: string | null;
    emailId: string;
  };
};

const MOCK_APIS: Api[] = [
  {
    id: 1,
    name: "OpenWeather",
    description:
      "API météo complète avec prévisions sur 7 jours, données en temps réel, alertes météo et historique climatique pour n'importe quelle ville du monde.",
    visibility: "PUBLIC",
    category: "WEATHER",
    baseUrl: "https://api.openweather.org/v3",
    createdAt: "2026-02-15T10:30:00Z",
    user: { firstName: "Karim", lastName: "Benzema", emailId: "karim@dev.io" },
  },
  {
    id: 2,
    name: "PayFlow",
    description:
      "Solution de paiement en ligne sécurisée. Gestion des transactions, abonnements récurrents, remboursements et rapports financiers détaillés.",
    visibility: "PRIVATE",
    category: "FINANCE",
    baseUrl: "https://api.payflow.dev/v2",
    createdAt: "2026-02-20T14:00:00Z",
    user: { firstName: "Sara", lastName: "Martin", emailId: "sara@payflow.io" },
  },
  {
    id: 3,
    name: "ChatConnect",
    description:
      "API de messagerie instantanée avec support WebSocket, envoi de fichiers, réactions aux messages et création de groupes.",
    visibility: "PUBLIC",
    category: "COMMUNICATION",
    baseUrl: "https://api.chatconnect.io/v1",
    createdAt: "2026-01-10T09:15:00Z",
    user: { firstName: "Youssef", lastName: "Aït", emailId: "youssef@chat.dev" },
  },
  {
    id: 4,
    name: "NeuroVision",
    description:
      "API d'intelligence artificielle pour la reconnaissance d'images, détection d'objets, OCR et génération de descriptions automatiques.",
    visibility: "PUBLIC",
    category: "AI",
    baseUrl: "https://api.neurovision.ai/v2",
    createdAt: "2026-03-01T16:45:00Z",
    user: { firstName: "Léa", lastName: "Dupont", emailId: "lea@neuro.ai" },
  },
  {
    id: 5,
    name: "SocialPulse",
    description:
      "Agrégateur de réseaux sociaux : publiez, planifiez et analysez vos posts sur Twitter, Instagram et LinkedIn depuis une seule API.",
    visibility: "PRIVATE",
    category: "SOCIAL",
    baseUrl: "https://api.socialpulse.app/v1",
    createdAt: "2026-02-28T11:20:00Z",
    user: { firstName: "Amine", lastName: "Radi", emailId: "amine@social.io" },
  },
  {
    id: 6,
    name: "MediTrack",
    description:
      "Suivi médical pour les patients : rendez-vous, ordonnances, résultats d'analyses et rappels de médicaments via notifications push.",
    visibility: "PRIVATE",
    category: "HEALTH",
    baseUrl: "https://api.meditrack.health/v1",
    createdAt: "2026-01-25T08:00:00Z",
    user: { firstName: "Nadia", lastName: "El Fassi", emailId: "nadia@medi.dev" },
  },
  {
    id: 7,
    name: "ShopEngine",
    description:
      "API e-commerce tout-en-un : gestion de produits, panier, commandes, gestion de stock et intégration avec les transporteurs.",
    visibility: "PUBLIC",
    category: "ECOMMERCE",
    baseUrl: "https://api.shopengine.store/v3",
    createdAt: "2026-03-05T13:30:00Z",
    user: { firstName: "Omar", lastName: "Sy", emailId: "omar@shop.dev" },
  },
  {
    id: 8,
    name: "DataForge",
    description:
      "Plateforme de transformation et nettoyage de données. Import CSV/JSON, pipelines ETL, visualisations et export vers BigQuery ou S3.",
    visibility: "PUBLIC",
    category: "DATA",
    baseUrl: "https://api.dataforge.io/v2",
    createdAt: "2026-02-10T17:00:00Z",
    user: { firstName: "Fatima", lastName: "Zahra", emailId: "fatima@data.io" },
  },
  {
    id: 9,
    name: "TranslateX",
    description:
      "Traduction automatique en 120 langues avec détection de langue, traduction contextuelle et support de fichiers PDF/DOCX.",
    visibility: "PUBLIC",
    category: "AI",
    baseUrl: "https://api.translatex.io/v1",
    createdAt: "2026-03-08T10:00:00Z",
    user: { firstName: "Hugo", lastName: "Bernard", emailId: "hugo@translate.dev" },
  },
  {
    id: 10,
    name: "CryptoWatch",
    description:
      "Données en temps réel sur les cryptomonnaies : prix, volumes, historiques, alertes de prix et analyse de tendances du marché.",
    visibility: "PUBLIC",
    category: "FINANCE",
    baseUrl: "https://api.cryptowatch.market/v2",
    createdAt: "2026-01-18T20:30:00Z",
    user: { firstName: "Mehdi", lastName: "Tahri", emailId: "mehdi@crypto.io" },
  },
  {
    id: 11,
    name: "MailJet Express",
    description:
      "Envoi d'emails transactionnels et marketing : templates, A/B testing, analytics d'ouverture et gestion des listes de contacts.",
    visibility: "PRIVATE",
    category: "COMMUNICATION",
    baseUrl: "https://api.mailjetexpress.com/v3",
    createdAt: "2026-02-05T12:15:00Z",
    user: { firstName: "Chloé", lastName: "Petit", emailId: "chloe@mail.dev" },
  },
  {
    id: 12,
    name: "GeoLocator",
    description:
      "Géolocalisation avancée : adresses, coordonnées GPS, calcul d'itinéraires, zones de chalandise et reverse geocoding.",
    visibility: "PUBLIC",
    category: "OTHER",
    baseUrl: "https://api.geolocator.xyz/v1",
    createdAt: "2026-03-02T15:45:00Z",
    user: { firstName: "Rachid", lastName: "Mouni", emailId: "rachid@geo.io" },
  },
];

const CATEGORIES = [
  "ALL",
  "FINANCE",
  "SOCIAL",
  "DATA",
  "AI",
  "HEALTH",
  "WEATHER",
  "ECOMMERCE",
  "COMMUNICATION",
  "OTHER",
];

const CATEGORY_COLORS: Record<string, string> = {
  FINANCE: "bg-emerald-100 text-emerald-700",
  SOCIAL: "bg-blue-100 text-blue-700",
  DATA: "bg-purple-100 text-purple-700",
  AI: "bg-pink-100 text-pink-700",
  HEALTH: "bg-red-100 text-red-700",
  WEATHER: "bg-cyan-100 text-cyan-700",
  ECOMMERCE: "bg-amber-100 text-amber-700",
  COMMUNICATION: "bg-indigo-100 text-indigo-700",
  OTHER: "bg-gray-100 text-gray-700",
};

const CATEGORY_ICONS: Record<string, string> = {
  FINANCE: "💰",
  SOCIAL: "👥",
  DATA: "📊",
  AI: "🤖",
  HEALTH: "🏥",
  WEATHER: "🌤️",
  ECOMMERCE: "🛒",
  COMMUNICATION: "💬",
  OTHER: "📦",
};

export default function ApiHubPage() {
  const [allApis, setAllApis] = useState<Api[]>(MOCK_APIS);
  const [search, setSearch] = useState("");
  const [visibilityFilter, setVisibilityFilter] = useState("ALL");
  const [categoryFilter, setCategoryFilter] = useState("ALL");
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    visibility: "PUBLIC" as string,
    category: "OTHER",
    baseUrl: "",
  });

  const apis = useMemo(() => {
    return allApis.filter((api) => {
      const matchSearch =
        !search ||
        api.name.toLowerCase().includes(search.toLowerCase()) ||
        api.description.toLowerCase().includes(search.toLowerCase());
      const matchVisibility =
        visibilityFilter === "ALL" || api.visibility === visibilityFilter;
      const matchCategory =
        categoryFilter === "ALL" || api.category === categoryFilter;
      return matchSearch && matchVisibility && matchCategory;
    });
  }, [allApis, search, visibilityFilter, categoryFilter]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newApi: Api = {
      id: Date.now(),
      name: formData.name,
      description: formData.description,
      visibility: formData.visibility as "PUBLIC" | "PRIVATE",
      category: formData.category,
      baseUrl: formData.baseUrl || null,
      createdAt: new Date().toISOString(),
      user: { firstName: "Moi", lastName: "", emailId: "me@devlup.io" },
    };
    setAllApis((prev) => [newApi, ...prev]);
    setShowModal(false);
    setFormData({
      name: "",
      description: "",
      visibility: "PUBLIC",
      category: "OTHER",
      baseUrl: "",
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🔌 API Hub
                </span>
              </h1>
              <p className="mt-2 text-gray-500">
                Découvrez et partagez des APIs avec la communauté DevlUP
              </p>
            </div>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Publier une API
            </button>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Rechercher une API..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-400"
            />
          </div>

          {/* Visibility filter */}
          <div className="flex items-center gap-2">
            {["ALL", "PUBLIC", "PRIVATE"].map((v) => (
              <button
                key={v}
                onClick={() => setVisibilityFilter(v)}
                className={`px-4 py-3 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                  visibilityFilter === v
                    ? "bg-gray-900 text-white shadow-md"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {v === "ALL" ? "Toutes" : v === "PUBLIC" ? "🌍 Public" : "🔒 Privé"}
              </button>
            ))}
          </div>

          {/* Category filter */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white cursor-pointer"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat === "ALL"
                  ? "📁 Toutes les catégories"
                  : `${CATEGORY_ICONS[cat]} ${cat}`}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* API Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {apis.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Aucune API trouvée
            </h3>
            <p className="text-gray-500 mb-6">
              Soyez le premier à publier une API sur la plateforme !
            </p>
            <button
              onClick={() => setShowModal(true)}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer"
            >
              Publier une API
            </button>
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              {apis.length} API{apis.length > 1 ? "s" : ""} trouvée
              {apis.length > 1 ? "s" : ""}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {apis.map((api) => (
                <ApiCard key={api.id} api={api} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Publier une API
              </h2>
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
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nom de l&apos;API *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Ex: Weather API"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  placeholder="Décrivez votre API..."
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 resize-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  URL de base
                </label>
                <input
                  type="url"
                  value={formData.baseUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, baseUrl: e.target.value })
                  }
                  placeholder="https://api.example.com/v1"
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Visibilité
                  </label>
                  <select
                    value={formData.visibility}
                    onChange={(e) =>
                      setFormData({ ...formData, visibility: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white cursor-pointer"
                  >
                    <option value="PUBLIC">🌍 Public</option>
                    <option value="PRIVATE">🔒 Privé</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Catégorie
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value })
                    }
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 bg-white cursor-pointer"
                  >
                    {CATEGORIES.filter((c) => c !== "ALL").map((cat) => (
                      <option key={cat} value={cat}>
                        {CATEGORY_ICONS[cat]} {cat}
                      </option>
                    ))}
                  </select>
                </div>
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
                  Publier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function ApiCard({ api }: { api: Api }) {
  const authorName =
    api.user.firstName || api.user.lastName
      ? `${api.user.firstName || ""} ${api.user.lastName || ""}`.trim()
      : api.user.emailId;

  const createdDate = new Date(api.createdAt).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="group bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
            {api.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors">
              {api.name}
            </h3>
          </div>
        </div>
        <span
          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
            api.visibility === "PUBLIC"
              ? "bg-green-100 text-green-700"
              : "bg-orange-100 text-orange-700"
          }`}
        >
          {api.visibility === "PUBLIC" ? "🌍 Public" : "🔒 Privé"}
        </span>
      </div>

      {/* Description */}
      <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">
        {api.description}
      </p>

      {/* Base URL */}
      {api.baseUrl && (
        <div className="mb-4 px-3 py-2 bg-gray-50 rounded-lg border border-gray-100">
          <code className="text-xs text-gray-500 break-all">{api.baseUrl}</code>
        </div>
      )}

      {/* Tags */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium ${
            CATEGORY_COLORS[api.category] || CATEGORY_COLORS.OTHER
          }`}
        >
          {CATEGORY_ICONS[api.category]} {api.category}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium text-gray-600">
            {authorName.charAt(0).toUpperCase()}
          </div>
          <span className="text-xs text-gray-500 truncate max-w-[120px]">
            {authorName}
          </span>
        </div>
        <span className="text-xs text-gray-400">{createdDate}</span>
      </div>
    </div>
  );
}
