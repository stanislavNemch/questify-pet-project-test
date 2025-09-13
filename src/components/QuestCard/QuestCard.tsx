import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cardService } from "../services/cardService";
import type { CardData, EditCardPayload } from "../types/card";
import { formatDisplayDate } from "../utils/dateUtils";
import {
    DIFFICULTIES,
    CATEGORIES,
    CATEGORY_COLORS,
    DIFFICULTY_COLORS,
} from "../data/constants";
import css from "./QuestCard.module.css";
import {
    MdOutlineClear,
    MdOutlineStar,
    MdCheck,
    MdOutlineSave,
    MdEdit,
} from "react-icons/md";

interface QuestCardProps {
    card: CardData;
}

export default function QuestCard({ card }: QuestCardProps) {
    // Move hooks above any conditional returns
    const [isEditing, setIsEditing] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const [editedCard, setEditedCard] = useState<EditCardPayload>({
        title: card?.title || "",
        difficulty: card?.difficulty || DIFFICULTIES[0],
        category: card?.category || CATEGORIES[0],
        date: card?.date ? card.date.split("T")[0] : "",
        time: card?.time || "",
    });

    const queryClient = useQueryClient();

    // Move early return after hooks
    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "An error occurred");
        },
    };

    const editMutation = useMutation({
        mutationFn: (data: { cardId: string; payload: EditCardPayload }) =>
            cardService.editCard(data.cardId, data.payload),
        ...mutationOptions,
        onSuccess: () => {
            toast.success("Quest updated!");
            setIsEditing(false);
            setIsActive(false); // Деактивируем карточку после сохранения
            mutationOptions.onSuccess();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (cardId: string) => cardService.deleteCard(cardId),
        ...mutationOptions,
        onSuccess: () => {
            toast.success("Quest deleted!");
            mutationOptions.onSuccess();
        },
    });

    const completeMutation = useMutation({
        mutationFn: (cardId: string) => cardService.completeCard(cardId),
        ...mutationOptions,
        onSuccess: () => {
            toast.success("Quest completed! Great job!");
            mutationOptions.onSuccess();
        },
    });

    if (!card) {
        return null;
    }

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete this quest?")) {
            deleteMutation.mutate(card._id);
        }
    };

    const handleSave = () => {
        editMutation.mutate({ cardId: card._id, payload: editedCard });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setEditedCard((prev) => ({ ...prev, [name]: value }));
    };

    const cardStyle = { backgroundColor: CATEGORY_COLORS[card.category] };
    const dotStyle = { backgroundColor: DIFFICULTY_COLORS[card.difficulty] };

    // --- Рендер формы редактирования ---
    if (isEditing) {
        return (
            <div className={css.cardContainer}>
                <div className={css.cardHeader}>
                    <select
                        name="difficulty"
                        value={editedCard.difficulty}
                        onChange={handleChange}
                        className={css.levelTitle}
                    >
                        {DIFFICULTIES.map((d) => (
                            <option key={d} value={d}>
                                {d}
                            </option>
                        ))}
                    </select>
                </div>
                <input
                    name="title"
                    value={editedCard.title}
                    onChange={handleChange}
                    className={css.cardInput}
                />
                <div className={css.dateContainer}>
                    <input
                        type="date"
                        name="date"
                        value={editedCard.date}
                        onChange={handleChange}
                    />
                    <input
                        type="time"
                        name="time"
                        value={editedCard.time}
                        onChange={handleChange}
                    />
                </div>
                <div className={css.cardBottomContainer}>
                    <select
                        name="category"
                        value={editedCard.category}
                        onChange={handleChange}
                        className={css.categorySelector}
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                    <div className={css.buttonList}>
                        <button
                            onClick={handleSave}
                            disabled={editMutation.isPending}
                        >
                            <MdOutlineSave color="#00d7ff" />
                        </button>
                        <button onClick={() => setIsEditing(false)}>
                            <MdOutlineClear color="#db0837" />
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // --- Рендер обычной карточки ---
    return (
        <div
            className={css.cardContainer}
            onClick={() => setIsActive(!isActive)}
        >
            <div className={css.cardHeader}>
                <div className={css.cardHeaderSelector}>
                    <div
                        className={css.roundLevelSelector}
                        style={dotStyle}
                    ></div>
                    <div className={css.levelTitle}>{card.difficulty}</div>
                </div>
                <div>
                    <MdOutlineStar />
                </div>
            </div>

            <div className={css.cardTitle}>{card.title}</div>

            <div className={css.dateContainer}>
                <div className={css.dayTitle}>
                    {formatDisplayDate(card.date)}, {card.time}
                </div>
            </div>

            <div className={css.cardBottomContainer}>
                <div className={css.categorySelector} style={cardStyle}>
                    <div className={css.categoryTitle}>{card.category}</div>
                </div>
                {isActive && (
                    <div className={css.buttonList}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsEditing(true);
                            }}
                        >
                            <MdEdit />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                            disabled={deleteMutation.isPending}
                        >
                            <MdOutlineClear color="#db0837" />
                        </button>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                completeMutation.mutate(card._id);
                            }}
                            disabled={completeMutation.isPending}
                        >
                            <MdCheck color="#24d40c" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
