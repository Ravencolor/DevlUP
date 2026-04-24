export type Api = {
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

export type Endpoint = {
  method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  path: string;
  summary: string;
  description: string;
  parameters?: {
    name: string;
    in: "query" | "path" | "header" | "body";
    required: boolean;
    type: string;
    description: string;
  }[];
  requestBody?: {
    contentType: string;
    schema: Record<string, unknown>;
  };
  responses: {
    status: number;
    description: string;
    example?: unknown;
  }[];
  tags?: string[];
};

export type ApiDoc = {
  apiId: number;
  version: string;
  endpoints: Endpoint[];
};

export const MOCK_APIS: Api[] = [
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

export const MOCK_API_DOCS: ApiDoc[] = [
  {
    apiId: 1,
    version: "3.0.0",
    endpoints: [
      {
        method: "GET",
        path: "/weather/current",
        summary: "Météo actuelle",
        description: "Récupère les conditions météorologiques actuelles pour une ville donnée.",
        parameters: [
          { name: "city", in: "query", required: true, type: "string", description: "Nom de la ville" },
          { name: "units", in: "query", required: false, type: "string", description: "Unités : metric | imperial" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { city: "Paris", temp: 18.5, humidity: 65, condition: "Nuageux" } },
          { status: 404, description: "Ville non trouvée" },
        ],
        tags: ["Weather"],
      },
      {
        method: "GET",
        path: "/weather/forecast",
        summary: "Prévisions 7 jours",
        description: "Retourne les prévisions météo sur 7 jours avec détails heure par heure.",
        parameters: [
          { name: "city", in: "query", required: true, type: "string", description: "Nom de la ville" },
          { name: "days", in: "query", required: false, type: "integer", description: "Nombre de jours (1-7)" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { city: "Paris", forecast: [{ day: "Lundi", high: 22, low: 14 }] } },
        ],
        tags: ["Weather"],
      },
      {
        method: "GET",
        path: "/weather/alerts",
        summary: "Alertes météo",
        description: "Liste les alertes météo actives pour une zone géographique.",
        parameters: [
          { name: "lat", in: "query", required: true, type: "number", description: "Latitude" },
          { name: "lon", in: "query", required: true, type: "number", description: "Longitude" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { alerts: [{ type: "Orage", severity: "moderate", expires: "2026-04-25T18:00:00Z" }] } },
        ],
        tags: ["Alerts"],
      },
    ],
  },
  {
    apiId: 2,
    version: "2.1.0",
    endpoints: [
      {
        method: "POST",
        path: "/payments",
        summary: "Créer un paiement",
        description: "Initie une nouvelle transaction de paiement.",
        requestBody: {
          contentType: "application/json",
          schema: { amount: 49.99, currency: "EUR", description: "Abonnement Pro", customer_email: "user@mail.com" },
        },
        responses: [
          { status: 201, description: "Paiement créé", example: { id: "pay_abc123", status: "pending", amount: 49.99 } },
          { status: 400, description: "Données invalides" },
        ],
        tags: ["Payments"],
      },
      {
        method: "GET",
        path: "/payments/{id}",
        summary: "Détail d'un paiement",
        description: "Récupère les informations détaillées d'un paiement.",
        parameters: [
          { name: "id", in: "path", required: true, type: "string", description: "ID du paiement" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { id: "pay_abc123", status: "completed", amount: 49.99, created_at: "2026-04-20T10:00:00Z" } },
          { status: 404, description: "Paiement non trouvé" },
        ],
        tags: ["Payments"],
      },
      {
        method: "POST",
        path: "/payments/{id}/refund",
        summary: "Rembourser un paiement",
        description: "Effectue un remboursement total ou partiel.",
        parameters: [
          { name: "id", in: "path", required: true, type: "string", description: "ID du paiement" },
        ],
        requestBody: {
          contentType: "application/json",
          schema: { amount: 25.0, reason: "Demande client" },
        },
        responses: [
          { status: 200, description: "Remboursement effectué", example: { refund_id: "ref_xyz", amount: 25.0, status: "refunded" } },
        ],
        tags: ["Refunds"],
      },
      {
        method: "GET",
        path: "/subscriptions",
        summary: "Lister les abonnements",
        description: "Liste tous les abonnements actifs ou annulés.",
        parameters: [
          { name: "status", in: "query", required: false, type: "string", description: "Filtrer par statut : active | canceled" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { subscriptions: [{ id: "sub_001", plan: "Pro", status: "active" }] } },
        ],
        tags: ["Subscriptions"],
      },
    ],
  },
  {
    apiId: 3,
    version: "1.2.0",
    endpoints: [
      {
        method: "POST",
        path: "/messages",
        summary: "Envoyer un message",
        description: "Envoie un message dans une conversation.",
        requestBody: {
          contentType: "application/json",
          schema: { conversation_id: "conv_123", content: "Salut !", type: "text" },
        },
        responses: [
          { status: 201, description: "Message envoyé", example: { id: "msg_456", status: "sent", timestamp: "2026-04-24T12:00:00Z" } },
        ],
        tags: ["Messages"],
      },
      {
        method: "GET",
        path: "/conversations",
        summary: "Lister les conversations",
        description: "Récupère toutes les conversations de l'utilisateur.",
        parameters: [
          { name: "limit", in: "query", required: false, type: "integer", description: "Nombre max de résultats" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { conversations: [{ id: "conv_123", last_message: "Salut !", unread: 3 }] } },
        ],
        tags: ["Conversations"],
      },
      {
        method: "POST",
        path: "/conversations",
        summary: "Créer une conversation",
        description: "Crée un nouveau groupe ou conversation directe.",
        requestBody: {
          contentType: "application/json",
          schema: { name: "Projet DevlUP", members: ["user_1", "user_2"], type: "group" },
        },
        responses: [
          { status: 201, description: "Conversation créée" },
        ],
        tags: ["Conversations"],
      },
    ],
  },
  {
    apiId: 4,
    version: "2.0.0",
    endpoints: [
      {
        method: "POST",
        path: "/vision/detect",
        summary: "Détection d'objets",
        description: "Détecte et identifie les objets présents dans une image.",
        requestBody: {
          contentType: "multipart/form-data",
          schema: { image: "(binary)", confidence_threshold: 0.8 },
        },
        responses: [
          { status: 200, description: "Succès", example: { objects: [{ label: "chat", confidence: 0.95, bbox: [10, 20, 200, 300] }] } },
        ],
        tags: ["Vision"],
      },
      {
        method: "POST",
        path: "/vision/ocr",
        summary: "Extraction de texte (OCR)",
        description: "Extrait le texte contenu dans une image ou un document scanné.",
        requestBody: {
          contentType: "multipart/form-data",
          schema: { image: "(binary)", language: "fr" },
        },
        responses: [
          { status: 200, description: "Succès", example: { text: "Bonjour le monde", confidence: 0.92 } },
        ],
        tags: ["OCR"],
      },
      {
        method: "POST",
        path: "/vision/describe",
        summary: "Description automatique",
        description: "Génère une description textuelle d'une image en langage naturel.",
        requestBody: {
          contentType: "multipart/form-data",
          schema: { image: "(binary)" },
        },
        responses: [
          { status: 200, description: "Succès", example: { description: "Un chat roux assis sur un canapé bleu dans un salon lumineux." } },
        ],
        tags: ["Vision"],
      },
    ],
  },
  {
    apiId: 5,
    version: "1.0.0",
    endpoints: [
      {
        method: "POST",
        path: "/posts",
        summary: "Publier un post",
        description: "Publie un contenu sur un ou plusieurs réseaux sociaux simultanément.",
        requestBody: {
          contentType: "application/json",
          schema: { content: "Mon nouveau post !", platforms: ["twitter", "linkedin"], scheduled_at: null },
        },
        responses: [
          { status: 201, description: "Post publié", example: { id: "post_789", platforms: ["twitter", "linkedin"], status: "published" } },
        ],
        tags: ["Posts"],
      },
      {
        method: "GET",
        path: "/analytics",
        summary: "Statistiques",
        description: "Récupère les statistiques d'engagement de vos publications.",
        parameters: [
          { name: "period", in: "query", required: false, type: "string", description: "Période : 7d | 30d | 90d" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { total_posts: 42, total_likes: 1250, total_shares: 320 } },
        ],
        tags: ["Analytics"],
      },
    ],
  },
  {
    apiId: 6,
    version: "1.3.0",
    endpoints: [
      {
        method: "GET",
        path: "/patients/{id}/appointments",
        summary: "Rendez-vous d'un patient",
        description: "Liste tous les rendez-vous passés et à venir d'un patient.",
        parameters: [
          { name: "id", in: "path", required: true, type: "string", description: "ID du patient" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { appointments: [{ id: "apt_01", date: "2026-05-01", doctor: "Dr. Amrani", status: "confirmed" }] } },
        ],
        tags: ["Appointments"],
      },
      {
        method: "POST",
        path: "/prescriptions",
        summary: "Créer une ordonnance",
        description: "Crée une nouvelle ordonnance pour un patient.",
        requestBody: {
          contentType: "application/json",
          schema: { patient_id: "p_123", medications: [{ name: "Paracétamol", dosage: "500mg", frequency: "3x/jour" }] },
        },
        responses: [
          { status: 201, description: "Ordonnance créée" },
        ],
        tags: ["Prescriptions"],
      },
    ],
  },
  {
    apiId: 7,
    version: "3.2.0",
    endpoints: [
      {
        method: "GET",
        path: "/products",
        summary: "Lister les produits",
        description: "Récupère le catalogue de produits avec pagination et filtres.",
        parameters: [
          { name: "page", in: "query", required: false, type: "integer", description: "Numéro de page" },
          { name: "category", in: "query", required: false, type: "string", description: "Catégorie de produit" },
          { name: "sort", in: "query", required: false, type: "string", description: "Tri : price_asc | price_desc | name" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { products: [{ id: "prod_01", name: "T-shirt DevlUP", price: 29.99, stock: 150 }], total: 342 } },
        ],
        tags: ["Products"],
      },
      {
        method: "POST",
        path: "/cart/items",
        summary: "Ajouter au panier",
        description: "Ajoute un produit au panier de l'utilisateur.",
        requestBody: {
          contentType: "application/json",
          schema: { product_id: "prod_01", quantity: 2 },
        },
        responses: [
          { status: 200, description: "Produit ajouté", example: { cart_total: 59.98, items_count: 2 } },
        ],
        tags: ["Cart"],
      },
      {
        method: "POST",
        path: "/orders",
        summary: "Passer une commande",
        description: "Crée une commande à partir du panier actuel.",
        requestBody: {
          contentType: "application/json",
          schema: { shipping_address: { street: "12 rue de la Paix", city: "Paris", zip: "75002" }, payment_method: "card" },
        },
        responses: [
          { status: 201, description: "Commande créée", example: { order_id: "ord_456", status: "processing", total: 59.98 } },
          { status: 400, description: "Panier vide" },
        ],
        tags: ["Orders"],
      },
    ],
  },
  {
    apiId: 8,
    version: "2.0.0",
    endpoints: [
      {
        method: "POST",
        path: "/datasets",
        summary: "Importer un dataset",
        description: "Importe un fichier CSV ou JSON comme nouveau dataset.",
        requestBody: {
          contentType: "multipart/form-data",
          schema: { file: "(binary)", name: "sales_2026", format: "csv" },
        },
        responses: [
          { status: 201, description: "Dataset créé", example: { id: "ds_789", rows: 15420, columns: 12 } },
        ],
        tags: ["Datasets"],
      },
      {
        method: "POST",
        path: "/pipelines",
        summary: "Créer un pipeline ETL",
        description: "Définit un pipeline de transformation de données.",
        requestBody: {
          contentType: "application/json",
          schema: { source: "ds_789", steps: [{ type: "filter", column: "amount", condition: "> 100" }, { type: "aggregate", group_by: "category" }] },
        },
        responses: [
          { status: 201, description: "Pipeline créé" },
        ],
        tags: ["Pipelines"],
      },
    ],
  },
  {
    apiId: 9,
    version: "1.0.0",
    endpoints: [
      {
        method: "POST",
        path: "/translate",
        summary: "Traduire du texte",
        description: "Traduit un texte d'une langue source vers une langue cible.",
        requestBody: {
          contentType: "application/json",
          schema: { text: "Hello world", source: "en", target: "fr" },
        },
        responses: [
          { status: 200, description: "Succès", example: { translated: "Bonjour le monde", source_lang: "en", target_lang: "fr" } },
        ],
        tags: ["Translation"],
      },
      {
        method: "POST",
        path: "/detect",
        summary: "Détecter la langue",
        description: "Détecte automatiquement la langue d'un texte.",
        requestBody: {
          contentType: "application/json",
          schema: { text: "Ciao come stai?" },
        },
        responses: [
          { status: 200, description: "Succès", example: { language: "it", confidence: 0.97 } },
        ],
        tags: ["Detection"],
      },
    ],
  },
  {
    apiId: 10,
    version: "2.5.0",
    endpoints: [
      {
        method: "GET",
        path: "/coins",
        summary: "Lister les cryptos",
        description: "Récupère la liste des cryptomonnaies avec prix et variations.",
        parameters: [
          { name: "limit", in: "query", required: false, type: "integer", description: "Nombre de résultats (défaut: 50)" },
          { name: "currency", in: "query", required: false, type: "string", description: "Devise de référence : usd | eur" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { coins: [{ symbol: "BTC", price: 67432.50, change_24h: 2.3 }] } },
        ],
        tags: ["Coins"],
      },
      {
        method: "GET",
        path: "/coins/{symbol}/history",
        summary: "Historique de prix",
        description: "Récupère l'historique des prix d'une crypto sur une période donnée.",
        parameters: [
          { name: "symbol", in: "path", required: true, type: "string", description: "Symbole de la crypto (ex: BTC)" },
          { name: "period", in: "query", required: false, type: "string", description: "Période : 24h | 7d | 30d | 1y" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { symbol: "BTC", prices: [{ timestamp: "2026-04-23T00:00:00Z", price: 66800 }] } },
        ],
        tags: ["Coins"],
      },
      {
        method: "POST",
        path: "/alerts",
        summary: "Créer une alerte de prix",
        description: "Définit une alerte quand une crypto atteint un prix cible.",
        requestBody: {
          contentType: "application/json",
          schema: { symbol: "ETH", target_price: 4000, direction: "above" },
        },
        responses: [
          { status: 201, description: "Alerte créée", example: { alert_id: "alt_001", symbol: "ETH", target_price: 4000 } },
        ],
        tags: ["Alerts"],
      },
    ],
  },
  {
    apiId: 11,
    version: "3.0.0",
    endpoints: [
      {
        method: "POST",
        path: "/emails/send",
        summary: "Envoyer un email",
        description: "Envoie un email transactionnel à un ou plusieurs destinataires.",
        requestBody: {
          contentType: "application/json",
          schema: { to: ["user@example.com"], subject: "Bienvenue !", template_id: "tpl_welcome", variables: { name: "John" } },
        },
        responses: [
          { status: 200, description: "Email envoyé", example: { message_id: "msg_abc", status: "sent" } },
        ],
        tags: ["Emails"],
      },
      {
        method: "GET",
        path: "/emails/{id}/stats",
        summary: "Stats d'un email",
        description: "Récupère les statistiques d'ouverture et de clic d'un email.",
        parameters: [
          { name: "id", in: "path", required: true, type: "string", description: "ID du message" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { opened: true, clicked: false, opened_at: "2026-04-24T09:15:00Z" } },
        ],
        tags: ["Analytics"],
      },
    ],
  },
  {
    apiId: 12,
    version: "1.1.0",
    endpoints: [
      {
        method: "GET",
        path: "/geocode",
        summary: "Géocoder une adresse",
        description: "Convertit une adresse textuelle en coordonnées GPS.",
        parameters: [
          { name: "address", in: "query", required: true, type: "string", description: "Adresse complète" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { lat: 48.8566, lon: 2.3522, formatted: "Paris, France" } },
        ],
        tags: ["Geocoding"],
      },
      {
        method: "GET",
        path: "/reverse",
        summary: "Reverse geocoding",
        description: "Convertit des coordonnées GPS en adresse lisible.",
        parameters: [
          { name: "lat", in: "query", required: true, type: "number", description: "Latitude" },
          { name: "lon", in: "query", required: true, type: "number", description: "Longitude" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { address: "10 Rue de Rivoli, 75001 Paris, France" } },
        ],
        tags: ["Geocoding"],
      },
      {
        method: "GET",
        path: "/directions",
        summary: "Calcul d'itinéraire",
        description: "Calcule l'itinéraire entre deux points avec distance et durée.",
        parameters: [
          { name: "origin", in: "query", required: true, type: "string", description: "Point de départ" },
          { name: "destination", in: "query", required: true, type: "string", description: "Point d'arrivée" },
          { name: "mode", in: "query", required: false, type: "string", description: "Mode : driving | walking | cycling" },
        ],
        responses: [
          { status: 200, description: "Succès", example: { distance: "5.2 km", duration: "12 min", steps: [{ instruction: "Tournez à droite", distance: "200m" }] } },
        ],
        tags: ["Directions"],
      },
    ],
  },
];

export const CATEGORIES = [
  "ALL", "FINANCE", "SOCIAL", "DATA", "AI", "HEALTH", "WEATHER", "ECOMMERCE", "COMMUNICATION", "OTHER",
];

export const CATEGORY_COLORS: Record<string, string> = {
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

export const CATEGORY_ICONS: Record<string, string> = {
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

