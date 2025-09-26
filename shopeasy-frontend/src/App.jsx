import './App.css'
import Header from "./components/layout/header.jsx";
import "./hooks/useDarkMode.jsx"
import Homepage from "./pages/homepage.jsx";

function App() {
    return (
        <>
            <Header></Header>
            <Homepage></Homepage>
        </>
    )
}

export default App
