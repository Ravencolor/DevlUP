import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Créer les users
  const users = await Promise.all([
    prisma.user.upsert({ where: { emailId: "karim@dev.io" }, update: {}, create: { firstName: "Karim", lastName: "Benzema", emailId: "karim@dev.io" } }),
    prisma.user.upsert({ where: { emailId: "sara@payflow.io" }, update: {}, create: { firstName: "Sara", lastName: "Martin", emailId: "sara@payflow.io" } }),
    prisma.user.upsert({ where: { emailId: "youssef@chat.dev" }, update: {}, create: { firstName: "Youssef", lastName: "Aït", emailId: "youssef@chat.dev" } }),
    prisma.user.upsert({ where: { emailId: "lea@neuro.ai" }, update: {}, create: { firstName: "Léa", lastName: "Dupont", emailId: "lea@neuro.ai" } }),
    prisma.user.upsert({ where: { emailId: "amine@social.io" }, update: {}, create: { firstName: "Amine", lastName: "Radi", emailId: "amine@social.io" } }),
    prisma.user.upsert({ where: { emailId: "omar@shop.dev" }, update: {}, create: { firstName: "Omar", lastName: "Sy", emailId: "omar@shop.dev" } }),
  ]);

  const [karim, sara, youssef, lea, amine, omar] = users;

  // Supprimer les anciennes APIs pour éviter les doublons
  await prisma.api.deleteMany();

  // API 1 - OpenWeather
  const api1 = await prisma.api.create({
    data: {
      name: "OpenWeather",
      description: "API météo complète avec prévisions sur 7 jours, données en temps réel, alertes météo et historique climatique.",
      visibility: "PUBLIC",
      category: "WEATHER",
      baseUrl: "https://api.openweather.org/v3",
      version: "3.0.0",
      userId: karim.userId,
      endpoints: {
        create: [
          {
            method: "GET", path: "/weather/current", summary: "Météo actuelle",
            description: "Récupère les conditions météorologiques actuelles pour une ville donnée.",
            tags: ["Weather"],
            parameters: {
              create: [
                { name: "city", location: "query", required: true, type: "string", description: "Nom de la ville" },
                { name: "units", location: "query", required: false, type: "string", description: "Unités : metric | imperial" },
              ],
            },
            responses: {
              create: [
                { status: 200, description: "Succès", example: { city: "Paris", temp: 18.5, humidity: 65, condition: "Nuageux" } },
                { status: 404, description: "Ville non trouvée" },
              ],
            },
          },
          {
            method: "GET", path: "/weather/forecast", summary: "Prévisions 7 jours",
            description: "Retourne les prévisions météo sur 7 jours.",
            tags: ["Weather"],
            parameters: {
              create: [
                { name: "city", location: "query", required: true, type: "string", description: "Nom de la ville" },
                { name: "days", location: "query", required: false, type: "integer", description: "Nombre de jours (1-7)" },
              ],
            },
            responses: {
              create: [
                { status: 200, description: "Succès", example: { city: "Paris", forecast: [{ day: "Lundi", high: 22, low: 14 }] } },
              ],
            },
          },
          {
            method: "GET", path: "/weather/alerts", summary: "Alertes météo",
            description: "Liste les alertes météo actives pour une zone géographique.",
            tags: ["Alerts"],
            parameters: {
              create: [
                { name: "lat", location: "query", required: true, type: "number", description: "Latitude" },
                { name: "lon", location: "query", required: true, type: "number", description: "Longitude" },
              ],
            },
            responses: {
              create: [
                { status: 200, description: "Succès", example: { alerts: [{ type: "Orage", severity: "moderate" }] } },
              ],
            },
          },
        ],
      },
    },
  });

  // API 2 - PayFlow
  const api2 = await prisma.api.create({
    data: {
      name: "PayFlow",
      description: "Solution de paiement en ligne sécurisée. Gestion des transactions, abonnements récurrents et remboursements.",
      visibility: "PRIVATE",
      category: "FINANCE",
      baseUrl: "https://api.payflow.dev/v2",
      version: "2.1.0",
      userId: sara.userId,
      endpoints: {
        create: [
          {
            method: "POST", path: "/payments", summary: "Créer un paiement",
            description: "Initie une nouvelle transaction de paiement.",
            tags: ["Payments"],
            requestBody: { amount: 49.99, currency: "EUR", description: "Abonnement Pro", customer_email: "user@mail.com" },
            responses: {
              create: [
                { status: 201, description: "Paiement créé", example: { id: "pay_abc123", status: "pending", amount: 49.99 } },
                { status: 400, description: "Données invalides" },
              ],
            },
          },
          {
            method: "GET", path: "/payments/{id}", summary: "Détail d'un paiement",
            description: "Récupère les informations détaillées d'un paiement.",
            tags: ["Payments"],
            parameters: {
              create: [
                { name: "id", location: "path", required: true, type: "string", description: "ID du paiement" },
              ],
            },
            responses: {
              create: [
                { status: 200, description: "Succès", example: { id: "pay_abc123", status: "completed", amount: 49.99 } },
                { status: 404, description: "Paiement non trouvé" },
              ],
            },
          },
          {
            method: "POST", path: "/payments/{id}/refund", summary: "Rembourser",
            description: "Effectue un remboursement total ou partiel.",
            tags: ["Refunds"],
            parameters: { create: [{ name: "id", location: "path", required: true, type: "string", description: "ID du paiement" }] },
            requestBody: { amount: 25.0, reason: "Demande client" },
            responses: {
              create: [
                { status: 200, description: "Remboursement effectué", example: { refund_id: "ref_xyz", amount: 25.0, status: "refunded" } },
              ],
            },
          },
        ],
      },
    },
  });

  // API 3 - ChatConnect
  const api3 = await prisma.api.create({
    data: {
      name: "ChatConnect",
      description: "API de messagerie instantanée avec support WebSocket, envoi de fichiers et création de groupes.",
      visibility: "PUBLIC",
      category: "COMMUNICATION",
      baseUrl: "https://api.chatconnect.io/v1",
      version: "1.2.0",
      userId: youssef.userId,
      endpoints: {
        create: [
          {
            method: "POST", path: "/messages", summary: "Envoyer un message",
            description: "Envoie un message dans une conversation.",
            tags: ["Messages"],
            requestBody: { conversation_id: "conv_123", content: "Salut !", type: "text" },
            responses: { create: [{ status: 201, description: "Message envoyé", example: { id: "msg_456", status: "sent" } }] },
          },
          {
            method: "GET", path: "/conversations", summary: "Lister les conversations",
            description: "Récupère toutes les conversations de l'utilisateur.",
            tags: ["Conversations"],
            parameters: { create: [{ name: "limit", location: "query", required: false, type: "integer", description: "Nombre max de résultats" }] },
            responses: { create: [{ status: 200, description: "Succès", example: { conversations: [{ id: "conv_123", last_message: "Salut !", unread: 3 }] } }] },
          },
        ],
      },
    },
  });

  // API 4 - NeuroVision
  const api4 = await prisma.api.create({
    data: {
      name: "NeuroVision",
      description: "API d'intelligence artificielle pour la reconnaissance d'images, détection d'objets et OCR.",
      visibility: "PUBLIC",
      category: "AI",
      baseUrl: "https://api.neurovision.ai/v2",
      version: "2.0.0",
      userId: lea.userId,
      endpoints: {
        create: [
          {
            method: "POST", path: "/vision/detect", summary: "Détection d'objets",
            description: "Détecte et identifie les objets présents dans une image.",
            tags: ["Vision"],
            requestBody: { image: "(binary)", confidence_threshold: 0.8 },
            responses: { create: [{ status: 200, description: "Succès", example: { objects: [{ label: "chat", confidence: 0.95, bbox: [10, 20, 200, 300] }] } }] },
          },
          {
            method: "POST", path: "/vision/ocr", summary: "Extraction de texte (OCR)",
            description: "Extrait le texte contenu dans une image.",
            tags: ["OCR"],
            requestBody: { image: "(binary)", language: "fr" },
            responses: { create: [{ status: 200, description: "Succès", example: { text: "Bonjour le monde", confidence: 0.92 } }] },
          },
        ],
      },
    },
  });

  // API 5 - SocialPulse
  const api5 = await prisma.api.create({
    data: {
      name: "SocialPulse",
      description: "Agrégateur de réseaux sociaux : publiez et analysez vos posts depuis une seule API.",
      visibility: "PRIVATE",
      category: "SOCIAL",
      baseUrl: "https://api.socialpulse.app/v1",
      version: "1.0.0",
      userId: amine.userId,
      endpoints: {
        create: [
          {
            method: "POST", path: "/posts", summary: "Publier un post",
            description: "Publie un contenu sur un ou plusieurs réseaux sociaux.",
            tags: ["Posts"],
            requestBody: { content: "Mon nouveau post !", platforms: ["twitter", "linkedin"] },
            responses: { create: [{ status: 201, description: "Post publié", example: { id: "post_789", status: "published" } }] },
          },
          {
            method: "GET", path: "/analytics", summary: "Statistiques",
            description: "Récupère les statistiques d'engagement.",
            tags: ["Analytics"],
            parameters: { create: [{ name: "period", location: "query", required: false, type: "string", description: "Période : 7d | 30d | 90d" }] },
            responses: { create: [{ status: 200, description: "Succès", example: { total_posts: 42, total_likes: 1250 } }] },
          },
        ],
      },
    },
  });

  // API 6 - ShopEngine
  const api6 = await prisma.api.create({
    data: {
      name: "ShopEngine",
      description: "API e-commerce tout-en-un : gestion de produits, panier, commandes et stock.",
      visibility: "PUBLIC",
      category: "ECOMMERCE",
      baseUrl: "https://api.shopengine.store/v3",
      version: "3.2.0",
      userId: omar.userId,
      endpoints: {
        create: [
          {
            method: "GET", path: "/products", summary: "Lister les produits",
            description: "Récupère le catalogue de produits avec pagination.",
            tags: ["Products"],
            parameters: {
              create: [
                { name: "page", location: "query", required: false, type: "integer", description: "Numéro de page" },
                { name: "category", location: "query", required: false, type: "string", description: "Catégorie de produit" },
              ],
            },
            responses: { create: [{ status: 200, description: "Succès", example: { products: [{ id: "prod_01", name: "T-shirt", price: 29.99 }], total: 342 } }] },
          },
          {
            method: "POST", path: "/cart/items", summary: "Ajouter au panier",
            description: "Ajoute un produit au panier.",
            tags: ["Cart"],
            requestBody: { product_id: "prod_01", quantity: 2 },
            responses: { create: [{ status: 200, description: "Produit ajouté", example: { cart_total: 59.98, items_count: 2 } }] },
          },
          {
            method: "POST", path: "/orders", summary: "Passer une commande",
            description: "Crée une commande à partir du panier actuel.",
            tags: ["Orders"],
            requestBody: { shipping_address: { street: "12 rue de la Paix", city: "Paris" }, payment_method: "card" },
            responses: {
              create: [
                { status: 201, description: "Commande créée", example: { order_id: "ord_456", status: "processing", total: 59.98 } },
                { status: 400, description: "Panier vide" },
              ],
            },
          },
        ],
      },
    },
  });

  console.log("✅ Seed terminé !", { api1: api1.id, api2: api2.id, api3: api3.id, api4: api4.id, api5: api5.id, api6: api6.id });
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());


