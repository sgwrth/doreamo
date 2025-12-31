import { BrowserRouter, Route, Routes } from "react-router"
import Books from "./components/Books"
import Nav from "./components/Nav"
import Home from "./components/Home"
import { Counter } from "./components/Counter"
import Login from "./components/Login"

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/books" element={<Books />} />
          <Route path="/counter" element={<Counter />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
