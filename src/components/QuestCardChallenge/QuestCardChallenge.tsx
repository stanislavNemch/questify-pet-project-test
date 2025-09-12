import css from "./QuestCardChallenge.module.css";
import {
    MdOutlineClear,
    MdArrowDropDown,
    MdCalendarMonth,
    MdCheck,
} from "react-icons/md";
import { GiTrophy } from "react-icons/gi";
import type { CardData } from "../types/card";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cardService } from "../services/cardService";
import toast from "react-hot-toast";

interface Props {
    card: CardData;
}

export default function QuestCardChallenge({ card }: Props) {
    const queryClient = useQueryClient();

    const deleteMutation = useMutation({
        mutationFn: (cardId: string) => cardService.deleteCard(cardId),
        onSuccess: () => {
            toast.success("Challenge deleted!");
            queryClient.invalidateQueries({ queryKey: ["cards"] });
        },
        onError: (error: any) =>
            toast.error(error.response?.data?.message || "Delete failed"),
    });

    // У Challenge нет режима редактирования, но есть удаление и завершение
    const handleDelete = () => {
        if (window.confirm("Delete this Challenge?")) {
            deleteMutation.mutate(card._id);
        }
    };

    // ... (можно добавить мутацию для complete, если нужно)

    return (
        <div className={css.cardContainer}>
            <div className={css.cardHeader}>
                <div className={css.cardHeaderSelector}>
                    <div className={css.roundLevelSelector}></div>
                    <div className={css.levelTitle}>{card.difficulty}</div>
                    <MdArrowDropDown color="#00d7ff" />
                </div>
                <div>
                    <GiTrophy color="#00d7ff" />
                </div>
            </div>
            <div className={css.challengeHeader}>challenge</div>
            <div className={css.cardTitle}>{card.title}</div>
            <div className={css.dateContainer}>
                <div className={css.dayTitle}>
                    by {card.date}, {card.time}
                </div>
            </div>
            <div className={css.cardBottomContainer}>
                {/* ... (кнопки удаления и завершения) */}
            </div>
        </div>
    );
}
