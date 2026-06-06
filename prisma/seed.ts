import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const quests = [
  {
    date: "2026-06-06",
    question: "Que retourne `typeof null` en JavaScript ?",
    options: ['"null"', '"object"', '"undefined"', '"number"'],
    correctAnswer: 1,
    pointsReward: 10,
  },
  {
    date: "2026-06-07",
    question: "Quel sélecteur CSS a la spécificité la plus haute ?",
    options: [".classe", "#identifiant", "element", "*"],
    correctAnswer: 1,
    pointsReward: 10,
  },
  {
    date: "2026-06-08",
    question: "Quelle est la complexité temporelle de la recherche binaire ?",
    options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
    correctAnswer: 1,
    pointsReward: 15,
  },
  {
    date: "2026-06-09",
    question: "Quel hook React est utilisé pour gérer les effets de bord ?",
    options: ["useState", "useRef", "useEffect", "useMemo"],
    correctAnswer: 2,
    pointsReward: 10,
  },
  {
    date: "2026-06-10",
    question: "Quelle commande Git crée une nouvelle branche et bascule dessus ?",
    options: ["git branch", "git checkout -b", "git switch --create", "git new-branch"],
    correctAnswer: 1,
    pointsReward: 10,
  },
  {
    date: "2026-06-11",
    question: "En TypeScript, que signifie le `?` dans une définition de type ?",
    options: ["Nullable", "Optionnel", "Union", "Intersection"],
    correctAnswer: 1,
    pointsReward: 10,
  },
  {
    date: "2026-06-12",
    question: "Quelle clause SQL filtre les résultats après un GROUP BY ?",
    options: ["WHERE", "GROUP BY", "HAVING", "ORDER BY"],
    correctAnswer: 2,
    pointsReward: 15,
  },
  {
    date: "2026-06-13",
    question: "Que retourne `Array.prototype.reduce` ?",
    options: ["Un tableau", "Un booléen", "Une valeur unique", "Un objet"],
    correctAnswer: 2,
    pointsReward: 10,
  },
  {
    date: "2026-06-14",
    question: "Quel code HTTP signifie 'Not Found' ?",
    options: ["200", "301", "404", "500"],
    correctAnswer: 2,
    pointsReward: 5,
  },
  {
    date: "2026-06-15",
    question: "Que retourne `10 // 3` en Python ?",
    options: ["3", "3.33", "4", "Erreur"],
    correctAnswer: 0,
    pointsReward: 10,
  },
  {
    date: "2026-06-16",
    question: "Quelle commande Docker construit une image ?",
    options: ["docker run", "docker build", "docker create", "docker start"],
    correctAnswer: 1,
    pointsReward: 10,
  },
  {
    date: "2026-06-17",
    question: "Que correspond `\\d` en expression régulière ?",
    options: ["N'importe quel caractère", "Un chiffre", "Un espace blanc", "Une limite de mot"],
    correctAnswer: 1,
    pointsReward: 10,
  },
  {
    date: "2026-06-18",
    question: "Quelle méthode HTTP est idempotente et met à jour une ressource ?",
    options: ["POST", "GET", "PUT", "PATCH"],
    correctAnswer: 2,
    pointsReward: 15,
  },
  {
    date: "2026-06-19",
    question: "Quelle différence entre `===` et `==` en JavaScript ?",
    options: ["Même valeur", "Valeur et type", "Référence mémoire", "Prototype"],
    correctAnswer: 1,
    pointsReward: 5,
  },
];

async function main() {
  // Seed des users
  const users = await Promise.all([
    prisma.user.upsert({ where: { emailId: "karim@dev.io" }, update: {}, create: { firstName: "Karim", lastName: "Benzema", emailId: "karim@dev.io" } }),
    prisma.user.upsert({ where: { emailId: "sara@payflow.io" }, update: {}, create: { firstName: "Sara", lastName: "Martin", emailId: "sara@payflow.io" } }),
    prisma.user.upsert({ where: { emailId: "youssef@chat.dev" }, update: {}, create: { firstName: "Youssef", lastName: "Ait", emailId: "youssef@chat.dev" } }),
    prisma.user.upsert({ where: { emailId: "lea@neuro.ai" }, update: {}, create: { firstName: "Lea", lastName: "Dupont", emailId: "lea@neuro.ai" } }),
    prisma.user.upsert({ where: { emailId: "amine@social.io" }, update: {}, create: { firstName: "Amine", lastName: "Radi", emailId: "amine@social.io" } }),
    prisma.user.upsert({ where: { emailId: "omar@shop.dev" }, update: {}, create: { firstName: "Omar", lastName: "Sy", emailId: "omar@shop.dev" } }),
  ]);

  const [karim, sara, youssef, lea, amine, omar] = users;

  // Supprimer les anciennes APIs pour eviter les doublons
  await prisma.api.deleteMany();

  // API 1 - OpenWeather
  await prisma.api.create({
    data: {
      name: "OpenWeather",
      description: "API meteo complete avec previsions sur 7 jours.",
      visibility: "PUBLIC",
      category: "WEATHER",
      baseUrl: "https://api.openweather.org/v3",
      version: "3.0.0",
      userId: karim.userId,
      endpoints: {
        create: [
          {
            method: "GET", path: "/weather/current", summary: "Meteo actuelle",
            description: "Recupere les conditions meteorologiques actuelles.",
            tags: ["Weather"],
            parameters: { create: [{ name: "city", location: "query", required: true, type: "string", description: "Nom de la ville" }] },
            responses: { create: [{ status: 200, description: "Succes", example: { city: "Paris", temp: 18.5 } }] },
          },
        ],
      },
    },
  });

  // API 2 - PayFlow
  await prisma.api.create({
    data: {
      name: "PayFlow",
      description: "Solution de paiement en ligne securisee.",
      visibility: "PRIVATE",
      category: "FINANCE",
      baseUrl: "https://api.payflow.dev/v2",
      version: "2.1.0",
      userId: sara.userId,
      endpoints: {
        create: [
          {
            method: "POST", path: "/payments", summary: "Creer un paiement",
            description: "Initie une nouvelle transaction de paiement.",
            tags: ["Payments"],
            requestBody: { amount: 49.99, currency: "EUR" },
            responses: { create: [{ status: 201, description: "Paiement cree", example: { id: "pay_abc123", status: "pending" } }] },
          },
        ],
      },
    },
  });

  // Seed des quetes
  console.log("Seed des quetes en cours...");
  for (const quest of quests) {
    await prisma.quest.upsert({
      where: { date: quest.date },
      update: {},
      create: quest,
    });
  }

  console.log(`Seed termine ! ${quests.length} quetes inserees.`);
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await prisma.$disconnect(); });
