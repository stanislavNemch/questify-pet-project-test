import { useState } from "react";
import { GoTrophy } from "react-icons/go";
import { RiLogoutCircleRLine } from "react-icons/ri";
import css from "./Header.module.css";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";
import QuestCardChallengeCreate from "../QuestCardChallengeCreate/QuestCardChallengeCreate";

export default function Header() {
    const { logout, user } = useAuth();
    const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);

    // ... (остальная логика без изменений)
    const userInitial = user?.email?.[0]?.toUpperCase() || "";
    const userName = (user?.email?.split("@")[0] || userInitial).trim();

    const handleLogout = async () => {
        try {
            await authService.logout();
            logout();
            toast.success("Вы успешно вышли!");
        } catch {
            toast.error("Не удалось выйти из системы.");
            logout();
        }
    };

    return (
        <>
            <header className={css.headerContainer}>
                <div className={css.logo}>Questify</div>
                <div className={css.userInfo}>
                    <div className={css.userAvatar}>{userInitial}</div>
                    <div className={css.userName}>{userName}'s Quest Log</div>
                </div>
                <div className={css.actions}>
                    {/* Кнопка открывает модальное окно */}
                    <button
                        className={css.actionButton}
                        onClick={() => setIsChallengeModalOpen(true)}
                    >
                        <div className={css.trophyButtonWrapper}>
                            <GoTrophy className={css.trophyIcon} />
                        </div>
                    </button>
                    <button onClick={handleLogout} className={css.actionButton}>
                        <RiLogoutCircleRLine className={css.logoutIcon} />
                    </button>
                </div>
            </header>
            {/* Рендерим модальное окно по состоянию */}
            {isChallengeModalOpen && (
                <QuestCardChallengeCreate
                    onClose={() => setIsChallengeModalOpen(false)}
                />
            )}
        </>
    );
}
