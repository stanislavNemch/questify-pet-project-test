import css from "./QuestCardCompleted.module.css";
import { MdArrowForward } from "react-icons/md";
import vectorLogo from "../../assets/award.svg";
import type { CardData } from "../types/card";

interface QuestCardCompletedProps {
    cardData: CardData;
}

export default function QuestCardCompleted({
    cardData,
}: QuestCardCompletedProps) {
    return (
        <div className={css.completedContainer}>
            <div className={css.completedTitle}>
                <div className={css.completedName}>Completed:</div>
                <div className={css.completedQuestName}>{cardData.title}</div>
            </div>
            <div className={css.completedImage}>
                <img src={vectorLogo} alt="award" width="144" height="124" />
            </div>
            <div className={css.completedContinue}>
                <div className={css.continueText}>Continue</div>
                <MdArrowForward color="#00d7ff" width="20" height="20" />
            </div>
        </div>
    );
}
