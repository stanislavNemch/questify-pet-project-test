import { useState } from "react";
import Header from "../Header/Header";
import LandingPage from "../LandingPage/LandingPage";
import QuestDashboard from "../QuestDashboard/QuestDashboard";
import css from "./App.module.css";
import { MdAdd } from "react-icons/md";
import type { CardType } from "../types/card";
import { useAuth } from "../hooks/useAuth";
import { AuthProvider } from "../context/AuthProvider";

function AppContent() {
  const { isLoggedIn } = useAuth();
  const [creationType, setCreationType] = useState<CardType | null>(null);

  const handleCreationHandled = () => {
    setCreationType(null);
  };

  return (
    <div className={css.container}>
      {isLoggedIn ? (
        <>
          <Header onCreateChallenge={() => setCreationType("Challenge")} />
          <QuestDashboard
            creationType={creationType}
            onCreationHandled={handleCreationHandled}
          />
          <div className={css.createButtonsContainer}>
            <button
              className={css.createButton}
              onClick={() => setCreationType("Task")}
            >
              <MdAdd size={24} />
            </button>
          </div>
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
