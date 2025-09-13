import React, { useState, useRef, useEffect } from "react";
import css from "./QuestCardChallenge.module.css";
import { MdOutlineClear, MdCheck, MdOutlineSave } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import type { CardData, EditCardPayload } from "../types/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cardService } from "../services/cardService";
import toast from "react-hot-toast";
import {
    DIFFICULTIES,
    CATEGORIES,
    CATEGORY_COLORS,
    DIFFICULTY_COLORS,
} from "../data/constants";
import { formatDisplayDate } from "../utils/dateUtils";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

interface Props {
    card: CardData;
}

export default function QuestCardChallenge({ card }: Props) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCard, setEditedCard] = useState<EditCardPayload | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    useEffect(() => {
        if (card) {
            setEditedCard({
                title: card.title,
                difficulty: card.difficulty,
                category: card.category,
                date: card.date.split("T")[0],
                time: card.time,
            });
        }
    }, [card]);

    useOnClickOutside(cardRef, () => setIsEditing(false));

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") setIsEditing(false);
        };
        if (isEditing) document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isEditing]);

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
            toast.success("Challenge updated!");
            setIsEditing(false);
            mutationOptions.onSuccess();
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (cardId: string) => cardService.deleteCard(cardId),
        ...mutationOptions,
        onSuccess: () => {
            toast.success("Challenge deleted!");
            mutationOptions.onSuccess();
        },
    });

    const completeMutation = useMutation({
        mutationFn: (cardId: string) => cardService.completeCard(cardId),
        ...mutationOptions,
        onSuccess: () => {
            toast.success("Challenge completed!");
            mutationOptions.onSuccess();
        },
    });

    if (!card || !editedCard) {
        return null;
    }

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        editMutation.mutate({ cardId: card._id, payload: editedCard });
    };

    const handleDelete = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (window.confirm("Delete this Challenge?")) {
            deleteMutation.mutate(card._id);
        }
    };

    const handleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();
        completeMutation.mutate(card._id);
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        e.stopPropagation();
        const { name, value } = e.target;
        setEditedCard((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const dotStyle = { backgroundColor: DIFFICULTY_COLORS[card.difficulty] };
    const categoryStyle = { backgroundColor: CATEGORY_COLORS[card.category] };

    return (
        <div
            ref={cardRef}
            className={css.cardContainer}
            onClick={() => !isEditing && setIsEditing(true)}
        >
            <div className={css.cardHeader}>
                <div className={css.cardHeaderSelector}>
                    {isEditing ? (
                        <select
                            name="difficulty"
                            value={editedCard.difficulty}
                            onChange={handleChange}
                            className={css.levelTitle}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {DIFFICULTIES.map((d) => (
                                <option key={d} value={d}>
                                    {d}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <>
                            <div
                                className={css.roundLevelSelector}
                                style={dotStyle}
                            ></div>
                            <div className={css.levelTitle}>
                                {card.difficulty}
                            </div>
                        </>
                    )}
                </div>
                <div>
                    <GiTrophy color="#00d7ff" />
                </div>
            </div>

            <div className={css.challengeHeader}>challenge</div>

            {isEditing ? (
                <input
                    name="title"
                    value={editedCard.title}
                    onChange={handleChange}
                    className={css.cardInput}
                    onClick={(e) => e.stopPropagation()}
                />
            ) : (
                <div className={css.cardTitle}>{card.title}</div>
            )}

            <div
                className={css.dateContainer}
                onClick={(e) => e.stopPropagation()}
            >
                {isEditing ? (
                    <>
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
                    </>
                ) : (
                    <div className={css.dayTitle}>
                        by {formatDisplayDate(card.date)}, {card.time}
                    </div>
                )}
            </div>

            <div className={css.cardBottomContainer}>
                {isEditing ? (
                    <select
                        name="category"
                        value={editedCard.category}
                        onChange={handleChange}
                        className={css.categorySelector}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className={css.categorySelector} style={categoryStyle}>
                        <div className={css.categoryTitle}>{card.category}</div>
                    </div>
                )}

                {isEditing && (
                    <div className={css.buttonList}>
                        <button
                            onClick={handleSave}
                            disabled={editMutation.isPending}
                        >
                            <MdOutlineSave color="#00d7ff" />
                        </button>
                        <div className={css.separatorContainer}></div>
                        <button
                            onClick={handleComplete}
                            disabled={completeMutation.isPending}
                        >
                            <MdCheck color="#24d40c" />
                        </button>
                        <div className={css.separatorContainer}></div>
                        <button
                            onClick={handleDelete}
                            disabled={deleteMutation.isPending}
                        >
                            <MdOutlineClear color="#db0837" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
