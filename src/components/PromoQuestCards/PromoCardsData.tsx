export type PromoCard = {

    id: number;
    title: string;
    difficulty: "Easy" | "Normal" | "Hard";
    category: "Stuff" | "Family" | "Health" | "Learning" | "Leisure" | "Work";
    type: "Task";
};

export const promoCardsData: PromoCard[] = [
    {
        id: 1,
        title: "Submit report",
        difficulty: "Hard",
        category: "Work",
        type: "Task",
    },
    {
        id: 2,
        title: "Buy the gift for Mary",
        difficulty: "Easy",
        category: "Family",
        type: "Task",
    },
    {
        id: 3,
        title: "Visit the dentist at Lumident",
        difficulty: "Normal",
        category: "Health",
        type: "Task",
    },
    {
        id: 4,
        title: "Finish homework",
        difficulty: "Easy",
        category: "Learning",
        type: "Task",
    },
    {
        id: 5,
        title: "Morning run",
        difficulty: "Easy",
        category: "Health",
        type: "Task",
    },
    {
        id: 6,
        title: "Visit the dentist at Lumident",
        difficulty: "Hard",
        category: "Leisure",
        type: "Task",
    },
    {
        id: 7,
        title: "Webinar",
        difficulty: "Normal",
        category: "Learning",
        type: "Task",
    },
    {
        id: 8,
        title: "Finish homework",
        difficulty: "Easy",
        category: "Leisure",
        type: "Task",
    },
    {
        id: 9,
        title: "Submit report",
        difficulty: "Hard",
        category: "Stuff",
        type: "Task",
    },
    {
        id: 10,
        title: "Buy the gift for Mary",
        difficulty: "Easy",
        category: "Family",
        type: "Task",
    },
    {
        id: 11,
        title: "Visit the dentist at Lumident",
        difficulty: "Normal",
        category: "Health",
        type: "Task",
    },
    {
        id: 12,
        title: "Finish homework",
        difficulty: "Easy",
        category: "Stuff",
        type: "Task",
    },
    {
        id: 13,
        title: "Morning run",
        difficulty: "Easy",
        category: "Family",
        type: "Task",
    },
    {
        id: 14,
        title: "Visit the dentist at Lumident",
        difficulty: "Hard",
        category: "Health",
        type: "Task",
    },
    {
        id: 15,
        title: "Webinar",
        difficulty: "Normal",
        category: "Learning",
        type: "Task",
    },
    {
        id: 16,
        title: "Finish homework",
        difficulty: "Easy",
        category: "Learning",
        type: "Task",
    },
];
