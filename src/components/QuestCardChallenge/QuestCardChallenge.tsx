import { useState } from "react";
import css from "./QuestCardChallenge.module.css";
import { MdOutlineClear, MdCheck } from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import type { CardData } from "../types/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cardService } from "../services/cardService";
import toast from "react-hot-toast";
import { CATEGORY_COLORS, DIFFICULTY_COLORS } from "../data/constants";

interface Props {
    card: CardData;
}

export default function QuestCardChallenge({ card }: Props) {
    const [isActive, setIsActive] = useState(false);
    const queryClient = useQueryClient();

    const mutationOptions = {
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["cards"] });
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.message || "An error occurred");
        },
    };

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

    const handleDelete = () => {
        if (window.confirm("Delete this Challenge?")) {
            deleteMutation.mutate(card._id);
        }
    };

    const dotStyle = { backgroundColor: DIFFICULTY_COLORS[card.difficulty] };
    const categoryStyle = { backgroundColor: CATEGORY_COLORS[card.category] };

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
                    <GiTrophy color="#00d7ff" />
                </div>
            </div>
            <div className={css.challengeHeader}>challenge</div>
            <div className={css.cardTitle}>{card.title}</div>
            <div className={css.dateContainer}>
                <div className={css.dayTitle}>
                    by {card.date.split("T")[0]}, {card.time}
                </div>
            </div>
            <div className={css.cardBottomContainer}>
                <div className={css.categorySelector} style={categoryStyle}>
                    <div className={css.categoryTitle}>{card.category}</div>
                </div>
                {isActive && (
                    <div className={css.buttonList}>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                completeMutation.mutate(card._id);
                            }}
                            disabled={completeMutation.isPending}
                        >
                            <MdCheck color="#24d40c" size={20} />
                        </button>
                        <div className={css.separatorContainer}></div>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                handleDelete();
                            }}
                            disabled={deleteMutation.isPending}
                        >
                            <MdOutlineClear color="#db0837" size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
