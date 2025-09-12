import Slider from "react-slick";
import QuestCard from "../QuestCard/QuestCard";
import css from "./PromoQuestCards.module.css";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { promoCardsData } from "./PromoCardsData";
import type { CardData } from "../types/card";

export default function PromoQuestCards() {
    const settings = {
        className: css.slider,
        dots: false,
        infinite: true,
        variableWidth: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        speed: 8000,
        autoplaySpeed: 0,
        cssEase: "linear",
        arrows: false,
        pauseOnHover: false,
        swipe: false,
        touchMove: false,
        rtl: true,
    };

    return (
        <div className={css.contained}>
            <div className={css.diagonalCanvas}>
                <Slider {...settings}>
                    {promoCardsData.map((card) => {
                        // Приводим промо-карточку к типу CardData для QuestCard
                        const cardForDisplay: CardData = {
                            ...card,
                            _id: `promo-${card.id}`, // Добавляем временный ID
                            date: new Date().toISOString().split("T")[0],
                            time: "12:00",
                            status: "Incomplete",
                        };

                        return (
                            <div key={card.id} className={css.slide}>
                                <div
                                    className={`${css.slideInner} ${css.upright}`}
                                >
                                    {/* Передаем один проп 'card' */}
                                    <QuestCard card={cardForDisplay} />
                                </div>
                            </div>
                        );
                    })}
                </Slider>
            </div>
        </div>
    );
}
