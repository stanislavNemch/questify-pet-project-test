import Slider from "react-slick";
import QuestCard from "../QuestCard/QuestCard";
import QuestCardChallenge from "../QuestCardChallenge/QuestCardChallenge";
import QuestCardCompleted from "../QuestCardCompleted/QuestCardCompleted";
import ChallengeCardCompleted from "../ChallengeCardCompleted/ChallengeCardCompleted";
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
                    {promoCardsData.map((promo) => {
                        // Приводим промо-объект к CardData (дата/время для вида)
                        const cardForDisplay: CardData = {
                            _id: `promo-${promo.id}`,
                            title: promo.title,
                            difficulty: promo.difficulty,
                            category: promo.category,
                            date: new Date().toISOString().split("T")[0],
                            time: "12:00",
                            type: promo.type,
                            status: promo.status,
                        };

                        let content: React.ReactNode = null;

                        if (promo.type === "Challenge") {
                            content =
                                promo.status === "Complete" ? (
                                    <ChallengeCardCompleted
                                        cardData={cardForDisplay}
                                    />
                                ) : (
                                    <QuestCardChallenge card={cardForDisplay} />
                                );
                        } else {
                            content =
                                promo.status === "Complete" ? (
                                    <QuestCardCompleted
                                        cardData={cardForDisplay}
                                    />
                                ) : (
                                    <QuestCard card={cardForDisplay} />
                                );
                        }

                        return (
                            <div key={promo.id} className={css.slide}>
                                <div
                                    className={`${css.slideInner} ${css.upright}`}
                                >
                                    {content}
                                </div>
                            </div>
                        );
                    })}
                </Slider>
            </div>
        </div>
    );
}
