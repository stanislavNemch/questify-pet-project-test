import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cardService } from "../services/cardService";
import type { CardData, EditCardPayload } from "../types/card";
import {
    CATEGORY_COLORS,
    DIFFICULTY_COLORS,
    DIFFICULTIES,
    CATEGORIES,
} from "../data/constants"; // ← добавили DIFFICULTIES, CATEGORIES
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { getErrorMessage } from "../utils/errorUtils";
import css from "./QuestCard.module.css";
import {
    MdOutlineStar,
    MdOutlineSave,
    MdCheck,
    MdOutlineClear,
} from "react-icons/md";
import { formatDisplayDate, isQuestDueSoon } from "../utils/dateUtils";
import { BsFire } from "react-icons/bs";

interface QuestCardProps {
    card: CardData;
}

export default function QuestCard({ card }: QuestCardProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [editedCard, setEditedCard] = useState<EditCardPayload | null>(null);
    const [isCompleting, setIsCompleting] = useState(false); // NEW
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

    useOnClickOutside(cardRef, () => {
        setIsEditing(false);
    });

    useEscapeKey(() => {
        setIsEditing(false);
    }, isEditing);

    const mutationOptions = {
        onSuccess: () => {
            // Больше не вызываем здесь — отложим в onSuccess клика
            queryClient.invalidateQueries({ queryKey: ["cards"] });
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "An error occurred"));
        },
    };

    const editMutation = useMutation({
        mutationFn: (data: { cardId: string; payload: EditCardPayload }) =>
            cardService.editCard(data.cardId, data.payload),
        ...mutationOptions,
        onSuccess: () => {
            toast.success("Quest updated!");
            setIsEditing(false);
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

    // Убираем onSuccess из мутации, чтобы управлять таймингом в handleComplete
    const completeMutation = useMutation({
        mutationFn: (cardId: string) => cardService.completeCard(cardId),
        onError: mutationOptions.onError,
    });

    if (!card || !editedCard) {
        return null;
    }

    const handleSave = (e: React.MouseEvent) => {
        e.stopPropagation();
        editMutation.mutate({ cardId: card._id, payload: editedCard });
    };

    const handleDeleteConfirm = () => {
        deleteMutation.mutate(card._id);
    };

    const handleComplete = (e: React.MouseEvent) => {
        e.stopPropagation();

        // защита от повторного клика
        if (completeMutation.isPending || isCompleting) return;

        setIsCompleting(true);

        completeMutation.mutate(card._id, {
            onSuccess: () => {
                toast.success("Quest completed! Great job!");
                setTimeout(() => {
                    queryClient.invalidateQueries({ queryKey: ["cards"] });
                }, 450); // синхронизировано с CSS-анимацией
            },
            onError: () => {
                setIsCompleting(false);
            },
        });
    };

    // Вернули обработчик изменений
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        e.stopPropagation();
        const { name, value } = e.target;
        setEditedCard((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const cardStyle = { backgroundColor: CATEGORY_COLORS[card.category] };
    const currentDifficulty = isEditing
        ? editedCard!.difficulty
        : card.difficulty;
    const dotStyle = { backgroundColor: DIFFICULTY_COLORS[currentDifficulty] };

    return (
        <div
            ref={cardRef}
            className={`${css.cardContainer} ${
                isCompleting ? css.cardCompleting : ""
            }`}
            onClick={() => !isEditing && setIsEditing(true)}
        >
            {isEditing ? (
                <>
                    <div className={css.cardHeader}>
                        {/* при редактировании показываем селект сложности */}
                        <div className={css.cardHeaderSelector}>
                            <div
                                className={css.roundLevelSelector}
                                style={dotStyle}
                            />
                            <select
                                name="difficulty"
                                value={editedCard!.difficulty}
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
                        </div>
                    </div>

                    {/* редактируемый заголовок */}
                    <input
                        name="title"
                        value={editedCard!.title}
                        onChange={handleChange}
                        className={css.cardInput}
                        onClick={(e) => e.stopPropagation()}
                        placeholder="Title..."
                    />

                    {/* редактируемые дата и время */}
                    <div
                        className={css.dateContainer}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <input
                            type="date"
                            name="date"
                            value={editedCard!.date}
                            onChange={handleChange}
                        />
                        <input
                            type="time"
                            name="time"
                            value={editedCard!.time}
                            onChange={handleChange}
                        />
                    </div>

                    <div className={css.cardBottomContainer}>
                        {/* редактируемая категория */}
                        <select
                            name="category"
                            value={editedCard!.category}
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

                        <div className={css.buttonList}>
                            <button
                                onClick={handleSave}
                                disabled={
                                    editMutation.isPending || isCompleting
                                }
                            >
                                <MdOutlineSave color="#00d7ff" />
                            </button>
                            <div
                                className={css.separatorContainer}
                                aria-hidden="true"
                            />
                            <button
                                onClick={handleDeleteConfirm}
                                disabled={
                                    deleteMutation.isPending || isCompleting
                                }
                            >
                                <MdOutlineClear color="#db0837" />
                            </button>
                            <div
                                className={css.separatorContainer}
                                aria-hidden="true"
                            />
                            <button
                                onClick={handleComplete}
                                disabled={
                                    completeMutation.isPending || isCompleting
                                }
                            >
                                <MdCheck color="#24d40c" />
                            </button>
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className={css.cardHeader}>
                        <div className={css.cardHeaderSelector}>
                            <div
                                className={css.roundLevelSelector}
                                style={dotStyle}
                            ></div>
                            <div className={css.levelTitle}>
                                {card.difficulty}
                            </div>
                        </div>
                        <div
                            onClick={handleComplete}
                            role="button"
                            aria-label="Complete quest"
                            aria-disabled={
                                completeMutation.isPending || isCompleting
                            }
                            style={{
                                cursor:
                                    completeMutation.isPending || isCompleting
                                        ? "not-allowed"
                                        : "pointer",
                                opacity:
                                    completeMutation.isPending || isCompleting
                                        ? 0.6
                                        : 1,
                            }}
                        >
                            <MdOutlineStar
                                color="#00d7ff"
                                className={css.starIcon}
                            />
                        </div>
                    </div>

                    <div className={css.cardTitle}>{card.title}</div>

                    <div className={css.dateContainer}>
                        <div className={css.dayTitle}>
                            {formatDisplayDate(card.date)}, {card.time}
                        </div>
                        {isQuestDueSoon(card.date, card.time) && (
                            <BsFire
                                color="#ff851c"
                                style={{ marginLeft: "8px" }}
                                size="18px"
                            />
                        )}
                    </div>

                    <div className={css.cardBottomContainer}>
                        <div className={css.categorySelector} style={cardStyle}>
                            <div className={css.categoryTitle}>
                                {card.category}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
