import React from "react";
import type { ReactNode } from "react";
import css from "./QuestGroup.module.css";
import { TiArrowSortedUp, TiArrowSortedDown } from "react-icons/ti";

// Описываем типы для наших пропсов
interface QuestGroupProps {
    title: string;
    isOpen: boolean;
    onToggle: () => void;
    children: ReactNode; // children может быть любым валидным React-элементом
}

const QuestGroup: React.FC<QuestGroupProps> = ({
    title,
    isOpen,
    onToggle,
    children,
}) => {
    return (
        <div className={css.questGroup}>
            <div className={css.groupHeader} onClick={onToggle}>
                <h2 className={css.groupTitle}>{title}</h2>
                <button className={css.toggleButton}>
                    {isOpen ? <TiArrowSortedUp /> : <TiArrowSortedDown />}
                </button>
                <div className={css.dividerLine}></div>
            </div>
            {/* Показываем дочерние элементы только если секция открыта */}
            {isOpen && <div className={css.cardGrid}>{children}</div>}
        </div>
    );
};

export default QuestGroup;
