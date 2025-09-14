import { useContext } from "react";
// Мы не можем импортировать AuthContextType, т.к. он не экспортируется,
// поэтому мы должны импортировать сам AuthContext и дать TypeScript вывести тип
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};
