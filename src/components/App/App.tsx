import { useState } from "react";
import { AuthProvider, useAuth } from "../context/AuthContext";
import Header from "../Header/Header";
import LandingPage from "../LandingPage/LandingPage";
import QuestDashboard from "../QuestDashboard/QuestDashboard";
import css from "./App.module.css";

function AppContent() {
    const { isLoggedIn } = useAuth();
    // Состояние, которое будет говорить Dashboard, что нужно создать Challenge
    const [challengeCreationRequested, setChallengeCreationRequested] =
        useState(false);

    const handleCreateChallenge = () => {
        setChallengeCreationRequested(true);
    };

    return (
        <div className={css.container}>
            {isLoggedIn ? (
                <>
                    <Header onCreateChallenge={handleCreateChallenge} />
                    <QuestDashboard
                        challengeCreationRequested={challengeCreationRequested}
                        onChallengeCreationHandled={() =>
                            setChallengeCreationRequested(false)
                        }
                    />
                </>
            ) : (
                <LandingPage />
            )}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
