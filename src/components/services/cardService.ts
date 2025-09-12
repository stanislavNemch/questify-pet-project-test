import { api } from "../../api";
import type {
    CreateCardPayload,
    CreateCardResponse,
    EditCardPayload,
    EditCardResponse,
    GetAllCardsResponse,
    CompleteCardResponse,
} from "../types/card";

export const cardService = {
    getAllCards: () => api.get<GetAllCardsResponse>("/card"),

    createCard: (data: CreateCardPayload) =>
        api.post<CreateCardResponse>("/card", data),

    editCard: (cardId: string, data: EditCardPayload) =>
        api.patch<EditCardResponse>(`/card/${cardId}`, data),

    deleteCard: (cardId: string) => api.delete(`/card/${cardId}`),

    completeCard: (cardId: string) =>
        api.patch<CompleteCardResponse>(`/card/complete/${cardId}`),
};
