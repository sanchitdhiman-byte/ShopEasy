import { useState, useEffect } from "react";

export function useDarkMode() {
    const [isDark, setIsDark] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "dark") return true;
        if (saved === "light") return false;

        return window.matchMedia("(prefers-color-scheme: dark)").matches;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add("dark");
        } else {
            root.classList.remove("dark");
        }
        localStorage.setItem("theme", isDark ? "dark" : "light");
    }, [isDark]);

    const toggleDarkMode = () => {
        console.log("Toggled Dark Mode");
        setIsDark(prev => !prev);
    };

    return { isDark, toggleDarkMode };
}
