import { BrowserRouter, Route, Routes } from "react-router"
import Books from "./components/Books"
import Nav from "./components/Nav"
import Home from "./components/Home"

function App() {
  return (
    <>
      <BrowserRouter>
        <Nav />
        <Routes>
          <Route path="/books" element={<Books />} />
          <Route path="/" element={<Home />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
