import css from "./QuestCardModalDelete.module.css";

export default function QuestCardModalDelete() {
  return (
    <div className={css.modalDeleteContainer}>
      <div className={css.modalPopup}>
        <div className={css.titleBlock}>Delete this Quest?</div>
        <div className={css.buttonBlock}>
          <div className={css.buttonCancel}>cancel</div>
          <div className={css.buttonDelete}>delete</div>
        </div>
      </div>
    </div>
  );
}
