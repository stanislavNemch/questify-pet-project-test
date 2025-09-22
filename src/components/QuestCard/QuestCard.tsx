import React, { useState, useRef, useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { cardService } from "../services/cardService";
import type { CardData, EditCardPayload } from "../types/card";
import { CATEGORY_COLORS, DIFFICULTY_COLORS } from "../data/constants";
import { useOnClickOutside } from "../hooks/useOnClickOutside";
import { useEscapeKey } from "../hooks/useEscapeKey";
import QuestCardModalDelete from "../QuestCardModalDelete/QuestCardModalDelete";
import QuestCardEdit from "../QuestCardEdit/QuestCardEdit";
import css from "./QuestCard.module.css";
import { MdOutlineStar } from "react-icons/md";
import { formatDisplayDate, isQuestDueSoon } from "../utils/dateUtils";
import { BsFire } from "react-icons/bs";

interface QuestCardProps {
  card: CardData;
}

export default function QuestCard({ card }: QuestCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
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

  useOnClickOutside(cardRef, () => {
    setIsEditing(false);
    setIsConfirmingDelete(false);
  });

  useEscapeKey(() => {
    setIsEditing(false);
    setIsConfirmingDelete(false);
  }, isEditing || isConfirmingDelete);

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

  if (!card || !editedCard) {
    return null;
  }

  const handleSave = (e: React.MouseEvent) => {
    e.stopPropagation();
    editMutation.mutate({ cardId: card._id, payload: editedCard });
  };

  const handleDeleteConfirm = () => {
    deleteMutation.mutate(card._id);
    setIsConfirmingDelete(false);
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

  const cardStyle = { backgroundColor: CATEGORY_COLORS[card.category] };
  const dotStyle = { backgroundColor: DIFFICULTY_COLORS[card.difficulty] };

  return (
    <div
      ref={cardRef}
      className={css.cardContainer}
      onClick={() => !isEditing && setIsEditing(true)}
    >
      {isConfirmingDelete && (
        <QuestCardModalDelete
          onConfirm={handleDeleteConfirm}
          onCancel={() => setIsConfirmingDelete(false)}
        />
      )}

      {isEditing ? (
        <QuestCardEdit
          editedCard={editedCard}
          onSave={handleSave}
          onDelete={(e) => {
            e.stopPropagation();
            setIsConfirmingDelete(true);
          }}
          onComplete={handleComplete}
          onChange={handleChange}
          isSaving={editMutation.isPending}
          isDeleting={deleteMutation.isPending}
          isCompleting={completeMutation.isPending}
        />
      ) : (
        <>
          <div className={css.cardHeader}>
            <div className={css.cardHeaderSelector}>
              <div className={css.roundLevelSelector} style={dotStyle}></div>
              <div className={css.levelTitle}>{card.difficulty}</div>
            </div>
            {/* Добавляем onClick на звездочку */}
            <div
              onClick={(e) => {
                e.stopPropagation(); // Чтобы не открылся режим редактирования
                completeMutation.mutate(card._id);
              }}
              style={{ cursor: "pointer" }} // Показываем, что она кликабельна
            >
              <MdOutlineStar color="#00d7ff" className={css.starIcon} />
            </div>
          </div>
          <div className={css.cardTitle}>{card.title}</div>
          <div className={css.dateContainer}>
            <div className={css.dayTitle}>
              {formatDisplayDate(card.date)}, {card.time}
            </div>
            {/* Иконка огня, если квест "горит" */}
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
              <div className={css.categoryTitle}>{card.category}</div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
