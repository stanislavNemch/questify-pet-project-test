import { useState, useRef } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cardService } from "../services/cardService";
import type { CardData } from "../types/card";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import QuestCardModalDelete from "../QuestCardModalDelete/QuestCardModalDelete";
import css from "./ChallengeCardCompleted.module.css";
import { MdArrowForward } from "react-icons/md";
import { useEscapeKey } from "../hooks/useEscapeKey";
import { getErrorMessage } from "../utils/errorUtils";
// Положите файл в src/assets/challenge_completed.svg
import challengeCompleted from "../../assets/challenge_completed.svg";

interface ChallengeCardCompletedProps {
    cardData: CardData;
}

export default function ChallengeCardCompleted({
    cardData,
}: ChallengeCardCompletedProps) {
    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    useOnClickOutside(cardRef, () => setIsConfirmingDelete(false));
    useEscapeKey(() => setIsConfirmingDelete(false), isConfirmingDelete);

    const deleteMutation = useMutation({
        mutationFn: (cardId: string) => cardService.deleteCard(cardId),
        onSuccess: () => {
            toast.success("Completed challenge removed!");
            queryClient.invalidateQueries({ queryKey: ["cards"] });
        },
        onError: (error: unknown) => {
            toast.error(getErrorMessage(error, "Failed to remove challenge"));
        },
    });

    const handleDeleteConfirm = () => {
        deleteMutation.mutate(cardData._id);
        setIsConfirmingDelete(false);
    };

    return (
        <div
            ref={cardRef}
            className={css.completedContainer}
            onClick={() => setIsConfirmingDelete(true)}
        >
            {isConfirmingDelete && (
                <QuestCardModalDelete
                    onConfirm={handleDeleteConfirm}
                    onCancel={() => setIsConfirmingDelete(false)}
                />
            )}

            <div className={css.completedTitle}>
                <div className={css.completedName}>Completed:</div>
                <div className={css.completedQuestName}>{cardData.title}</div>
            </div>

            <div className={css.completedImage}>
                <img
                    src={challengeCompleted}
                    alt="challenge completed"
                    width="144"
                    height="124"
                />
            </div>

            <div className={css.completedContinue}>
                <div className={css.continueText}>Continue</div>
                <MdArrowForward color="#00d7ff" />
            </div>
        </div>
    );
}
