import css from "./QuestCardEdit.module.css";
import {
  MdOutlineClear,
  MdOutlineStar,
  MdArrowDropDown,
  MdCalendarMonth,
  MdCheck,
  MdOutlineSave,
} from "react-icons/md";

export default function QuestCardEdit() {
  return (
    <div className={css.cardContainer}>
      <div className={css.cardHeader}>
        <div className={css.cardHeaderSelector}>
          <div className={css.roundLevelSelector}></div>
          <div className={css.levelTitle}>Hard</div>
          <MdArrowDropDown />
        </div>
        <div>
          <MdOutlineStar />
        </div>
      </div>
      <div className={css.inputContainer}>
        <div className={css.cardTitle}>Edit Quest</div>
        <input type="text" className={css.cardInput} />
      </div>
      <div className={css.dateContainer}>
        <div className={css.dayTitle}>Today, 10:00</div>
        <MdCalendarMonth size={14} color={"#00d7ff"} />
      </div>
      <div className={css.cardBottomContainer}>
        <div className={css.categorySelector}>
          <div className={css.categoryTitle}>STUFF</div>
        </div>
        <div className={css.buttonList}>
          <div className={css.svgContainerSave}>
            <MdOutlineSave size={16} color="#00d7ff" />
          </div>
          <div className={css.separator}> </div>
          <div className={css.svgContainerClose}>
            <MdOutlineClear size={16} color={"#db0837"} />
          </div>
          <div className={css.separator}> </div>
          <div className={css.svgContainerCheck}>
            <MdCheck size={20} color={"#24d40c"} />
          </div>
        </div>
      </div>
    </div>
  );
}
