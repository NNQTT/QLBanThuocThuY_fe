import React from "react"
import { BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import Pages from "./pages/Pages";

function App() {
  return (
    <>
    <Router>
      <Pages></Pages>
    </Router>
    </>
  )
}

export default App
