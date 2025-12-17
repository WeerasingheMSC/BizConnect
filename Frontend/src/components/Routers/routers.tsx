import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import SignIn from '../SignIn/signIn'
import SignUp from '../SignUP/signUp'
import ForgotPassword from '../ForgotPassword/forgotPassword'
import ForgotPasswordChange from '../ForgotPassword/forgotPasswordChange'
import Dashboard from '../Dashboard/Dashboard'
import BusinessDashboard from '../Dashboard/BusinessDashboard'
import BusinessProfileForm from '../BusinessOwner/BusinessProfileForm'
import BusinessDetail from '../BusinessOwner/BusinessDetail'
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import UserDashboard from '../User/UserDashboard'
import SearchBusinesses from '../User/SearchBusinesses'
import UserBusinessDetail from '../User/UserBusinessDetail'
import UserBookmarks from '../User/UserBookmarks'

const routers = () => {
  return (
    <div>
        <Router>
            <Routes>
                <Route path='/signin' element={<SignIn />}></Route>
                <Route path='/signup' element={<SignUp />}></Route>
                <Route path='/forgot-password' element={<ForgotPassword />}></Route>
                <Route path='/reset-password' element={<ForgotPasswordChange />}></Route>
                
                {/* Protected Routes */}
                <Route 
                  path='/dashboard' 
                  element={
                    <ProtectedRoute requireUserType='user'>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path='/business/dashboard' 
                  element={
                    <ProtectedRoute requireUserType='business'>
                      <BusinessDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path='/business/profile' 
                  element={
                    <ProtectedRoute requireUserType='business'>
                      <BusinessProfileForm />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path='/business/profile/:id' 
                  element={
                    <ProtectedRoute requireUserType='business'>
                      <BusinessProfileForm />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path='/business/detail/:id' 
                  element={
                    <ProtectedRoute requireUserType='business'>
                      <BusinessDetail />
                    </ProtectedRoute>
                  }
                />
                
                {/* User Routes */}
                <Route 
                  path='/user/dashboard' 
                  element={
                    <ProtectedRoute requireUserType='user'>
                      <UserDashboard />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path='/user/search' 
                  element={
                    <ProtectedRoute requireUserType='user'>
                      <SearchBusinesses />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path='/user/business/:id' 
                  element={
                    <ProtectedRoute requireUserType='user'>
                      <UserBusinessDetail />
                    </ProtectedRoute>
                  }
                />
                <Route 
                  path='/user/bookmarks' 
                  element={
                    <ProtectedRoute requireUserType='user'>
                      <UserBookmarks />
                    </ProtectedRoute>
                  }
                />
                
                {/* Default redirect */}
                <Route path='/' element={<Navigate to='/signin' replace />} />
            </Routes>
        </Router>
    </div>
  )
}

export default routers
