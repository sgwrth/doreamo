import { BrowserRouter, Route, Routes } from "react-router";
import Books from "./components/Books/Books";
import Nav from "./components/Nav/Nav";
import Home from "./components/Home";
import Login from "./components/Login";

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/books" element={<Books />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
