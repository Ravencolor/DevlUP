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
    options: [
      "git branch",
      "git checkout -b",
      "git switch --create",
      "git new-branch",
    ],
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
    options: [
      "N'importe quel caractère",
      "Un chiffre",
      "Un espace blanc",
      "Une limite de mot",
    ],
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
    options: [
      "Même valeur",
      "Valeur et type",
      "Référence mémoire",
      "Prototype",
    ],
    correctAnswer: 1,
    pointsReward: 5,
  },
];

async function main() {
  console.log("Seed des quêtes en cours...");

  for (const quest of quests) {
    await prisma.quest.upsert({
      where: { date: quest.date },
      update: {},
      create: quest,
    });
  }

  console.log(`${quests.length} quêtes insérées.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
