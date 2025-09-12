import type { Difficulty, Category } from "../types/card";

export const DIFFICULTIES: Difficulty[] = ["Easy", "Normal", "Hard"];
export const CATEGORIES: Category[] = [
    "Stuff",
    "Family",
    "Health",
    "Learning",
    "Leisure",
    "Work",
];

export const CATEGORY_COLORS: Record<Category, string> = {
    Stuff: "#b9c3c8",
    Family: "#ffe6d3",
    Health: "#cdf7ff",
    Learning: "#fff6c0",
    Leisure: "#f8d2ff",
    Work: "#d3f6ce",
};

export const DIFFICULTY_COLORS: Record<Difficulty, string> = {
    Easy: "#00d7ff",
    Normal: "#24d40c",
    Hard: "#db0837",
};
