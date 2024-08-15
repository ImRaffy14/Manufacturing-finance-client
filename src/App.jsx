import Page1 from './Pages/page1'
import Page2 from './Pages/page2'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

function App() {

// Paki aral yung about sa react-router-dom, itong package na to yung need natin para makapag render ng maraming pages

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Page1/>} />
          <Route path='/page2' element={<Page2/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
