import css from "./QuestCardModalDelete.module.css";

interface QuestCardModalDeleteProps {
    onConfirm: () => void;
    onCancel: () => void;
}

export default function QuestCardModalDelete({
    onConfirm,
    onCancel,
}: QuestCardModalDeleteProps) {
    // Останавливаем "всплытие" клика, чтобы он не закрывал режим редактирования
    const handleModalClick = (e: React.MouseEvent) => {
        e.stopPropagation();
    };

    return (
        <div className={css.modalDeleteContainer} onClick={handleModalClick}>
            <div className={css.modalPopup}>
                <div className={css.titleBlock}>Delete this Quest?</div>
                <div className={css.buttonBlock}>
                    <button className={css.buttonCancel} onClick={onCancel}>
                        cancel
                    </button>
                    <button className={css.buttonDelete} onClick={onConfirm}>
                        delete
                    </button>
                </div>
            </div>
        </div>
    );
}
