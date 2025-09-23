import React, { useState, useRef, useEffect } from "react";
import css from "./QuestCardChallenge.module.css";
import { MdOutlineClear, MdCheck, MdOutlineSave } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import type { CardData, EditCardPayload } from "../types/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cardService } from "../services/cardService";
import toast from "react-hot-toast";
import { DIFFICULTIES, CATEGORIES, DIFFICULTY_COLORS } from "../data/constants";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { formatDisplayDate, isQuestDueSoon } from "../utils/dateUtils";
import { getErrorMessage } from "../utils/errorUtils";
import { BsFire } from "react-icons/bs";

interface Props {
    card: CardData;
}

export default function QuestCardChallenge({ card }: Props) {
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
            // не используем здесь; отложим в onSuccess клика
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
                toast.success("Challenge completed!");
                setTimeout(() => {
                    queryClient.invalidateQueries({ queryKey: ["cards"] });
                }, 450); // синхронизировано с CSS-анимацией
            },
            onError: () => {
                setIsCompleting(false);
            },
        });
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        e.stopPropagation();
        const { name, value } = e.target;
        setEditedCard((prev) => (prev ? { ...prev, [name]: value } : null));
    };

    const dotStyle = {
        backgroundColor:
            DIFFICULTY_COLORS[
                isEditing ? editedCard.difficulty : card.difficulty
            ],
    };

    return (
        <div
            ref={cardRef}
            className={`${css.cardContainer} ${
                isCompleting ? css.cardCompleting : ""
            }`} // NEW
            onClick={() => !isEditing && setIsEditing(true)}
        >
            <div className={css.cardHeader}>
                <div className={css.cardHeaderSelector}>
                    <div
                        className={css.roundLevelSelector}
                        style={dotStyle}
                    ></div>
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
                        <div className={css.levelTitle}>{card.difficulty}</div>
                    )}
                </div>

                {/* Клик по кубку завершает Challenge с той же анимацией */}
                <div
                    onClick={handleComplete}
                    role="button"
                    aria-label="Complete challenge"
                    aria-disabled={completeMutation.isPending || isCompleting}
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
                            className={css.dateInput}
                        />
                        <input
                            type="time"
                            name="time"
                            value={editedCard.time}
                            onChange={handleChange}
                            className={css.dateInput}
                        />
                    </>
                ) : (
                    <div className={css.dayTitleContainer}>
                        <div className={css.dayTitle}>
                            by {formatDisplayDate(card.date)}, {card.time}
                        </div>
                        {isQuestDueSoon(card.date, card.time) && (
                            <BsFire
                                color="#ff851c"
                                style={{ marginLeft: "8px" }}
                                size="18px"
                            />
                        )}
                    </div>
                )}
            </div>

            <div className={css.cardBottomContainer}>
                {isEditing ? (
                    <select
                        name="category"
                        value={editedCard.category}
                        onChange={handleChange}
                        className={css.categorySelectorEdit}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                                {c}
                            </option>
                        ))}
                    </select>
                ) : (
                    <div className={css.categorySelector}>
                        <div className={css.categoryTitle}>{card.category}</div>
                    </div>
                )}

                {isEditing && (
                    <div className={css.buttonList}>
                        <button
                            onClick={handleSave}
                            disabled={editMutation.isPending || isCompleting}
                        >
                            <MdOutlineSave color="#00d7ff" />
                        </button>
                        <div className={css.separatorContainer}></div>
                        <button
                            onClick={handleComplete}
                            disabled={
                                completeMutation.isPending || isCompleting
                            }
                        >
                            <MdCheck color="#24d40c" />
                        </button>
                        <div className={css.separatorContainer}></div>
                        <button
                            onClick={handleDeleteConfirm}
                            disabled={deleteMutation.isPending || isCompleting}
                        >
                            <MdOutlineClear color="#db0837" />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
