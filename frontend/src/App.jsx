import React from 'react'
import { Route, Routes } from 'react-router-dom'
import ReportPage from './pages/ReportPage'
import HomePage from './pages/HomePage'
import NearbyComplaintsDashboard from './pages/DashBoard'
import CurrentUserComplaints from './pages/CurrentUserComplaints'
import MyProfile from './components/MyProfile'
import SimpleRegister from "./pages/SignUp"
import TrendingComplaints from './pages/TrendingPosts'

const App = () => {
  return (

    <Routes>
        <Route path="/" element={<HomePage></HomePage>} />
        <Route path="/report" element={<ReportPage></ReportPage>} />
                <Route path="/signup" element={<SimpleRegister></SimpleRegister>} />

        <Route path="/dashboard" element={<NearbyComplaintsDashboard></NearbyComplaintsDashboard>} />
<Route path="/dashboard/mycomplaints" element={<CurrentUserComplaints></CurrentUserComplaints>} />
<Route path="/dashboard/profile/" element={<MyProfile></MyProfile>} />
<Route path="/dashboard/trending" element={<TrendingComplaints></TrendingComplaints>} />


    </Routes>
)
}

export default App
