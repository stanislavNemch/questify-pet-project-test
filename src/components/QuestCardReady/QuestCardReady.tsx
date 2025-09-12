import css from "./QuestCardReady.module.css";
import {
  MdOutlineClear,
  MdOutlineStar,
  MdArrowDropDown,
  MdCalendarMonth,
} from "react-icons/md";

export default function QuestCardReady() {
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

      <div className={css.cardTitle}>Wake up, dress up, live up</div>

      <div className={css.dateContainer}>
        <div className={css.dayTitle}>Today 6:00</div>
      </div>
      <div className={css.cardBottomContainer}>
        <div className={css.categorySelector}>
          <div className={css.categoryTitle}>STUFF</div>
        </div>
      </div>
    </div>
  );
}
