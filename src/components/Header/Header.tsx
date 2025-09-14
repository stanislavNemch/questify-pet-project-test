import { GoTrophy } from "react-icons/go";
import { RiLogoutCircleRLine } from "react-icons/ri";
import css from "./Header.module.css";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/authService";

interface HeaderProps {
    onCreateChallenge: () => void; // Функция, которую будет вызывать кнопка
}

export default function Header({ onCreateChallenge }: HeaderProps) {
    const { logout, user } = useAuth();
    const userInitial = user?.email?.[0]?.toUpperCase() || "";
    const userName = (user?.email?.split("@")[0] || userInitial).trim();

    const handleLogout = async () => {
        try {
            await authService.logout();
            logout();
            toast.success("Вы успешно вышли!");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Не удалось выйти из системы."
            );
            logout(); // Все равно выходим, чтобы очистить состояние
        }
    };

    return (
        <header className={css.headerContainer}>
            <div className={css.logo}>Questify</div>
            <div className={css.userInfo}>
                <div className={css.userAvatar}>{userInitial}</div>
                <div className={css.userName}>{userName}'s Quest Log</div>
            </div>
            <div className={css.actions}>
                <button
                    className={css.actionButton}
                    onClick={onCreateChallenge}
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
    );
}
