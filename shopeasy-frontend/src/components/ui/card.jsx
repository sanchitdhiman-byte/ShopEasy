// src/components/ui/Card.jsx
import { useDarkMode } from "../../context/themeContext.jsx";

function Card({ title, children }) {
    const { isDark } = useDarkMode();

    return (
        <div className={`p-6 rounded-2xl shadow-xl border transition ${
                isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
            }`}>
            {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
            {children}
        </div>
    );
}

export default Card;
