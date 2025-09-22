import React from "react";
import css from "./QuestCardEdit.module.css";
import { MdOutlineClear, MdCheck, MdOutlineSave } from "react-icons/md";
import { DIFFICULTIES, CATEGORIES, DIFFICULTY_COLORS } from "../data/constants";
import type { EditCardPayload } from "../types/card";

interface QuestCardEditProps {
  editedCard: EditCardPayload;
  onSave: (e: React.MouseEvent) => void;
  onDelete: (e: React.MouseEvent) => void;
  onComplete: (e: React.MouseEvent) => void;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  isSaving: boolean;
  isDeleting: boolean;
  isCompleting: boolean;
}

export default function QuestCardEdit({
  editedCard,
  onSave,
  onDelete,
  onComplete,
  onChange,
  isSaving,
  isDeleting,
  isCompleting,
}: QuestCardEditProps) {
  const dotStyle = {
    backgroundColor: DIFFICULTY_COLORS[editedCard.difficulty],
  };

  return (
    <>
      <div className={css.cardHeader}>
        <div className={css.roundLevelSelector} style={dotStyle}></div>
        <select
          name="difficulty"
          value={editedCard.difficulty}
          onChange={onChange}
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
      <input
        name="title"
        value={editedCard.title}
        onChange={onChange}
        className={css.cardInput}
        onClick={(e) => e.stopPropagation()}
      />
      <div className={css.dateContainer} onClick={(e) => e.stopPropagation()}>
        <input
          type="date"
          name="date"
          value={editedCard.date}
          onChange={onChange}
        />
        <input
          type="time"
          name="time"
          value={editedCard.time}
          onChange={onChange}
        />
      </div>
      <div className={css.cardBottomContainer}>
        <select
          name="category"
          value={editedCard.category}
          onChange={onChange}
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
          <button onClick={onSave} disabled={isSaving}>
            <MdOutlineSave color="#00d7ff" className={css.iconSave} />
          </button>
          <div className={css.separator}></div>
          <button onClick={onDelete} disabled={isDeleting}>
            <MdOutlineClear color="#db0837" className={css.iconSave} />
          </button>
          <div className={css.separator}></div>
          <button onClick={onComplete} disabled={isCompleting}>
            <MdCheck color="#24d40c" className={css.iconSave} />
          </button>
        </div>
      </div>
    </>
  );
}
