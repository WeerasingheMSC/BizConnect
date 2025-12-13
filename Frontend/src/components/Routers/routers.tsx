import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import SignIn from '../SignIn/signIn'
import SignUp from '../SignUP/signUp'
const routers = () => {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/signin' element={<SignIn />}></Route>
                <Route path='/signup' element={<SignUp />}></Route>
            </Routes>
        </Router>
    </div>
  )
}

export default routers
