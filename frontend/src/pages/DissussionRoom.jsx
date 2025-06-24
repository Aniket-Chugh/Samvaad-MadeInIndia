import React from 'react'
import LeftSidebar from '../components/LeftSidebar'
import RightSideBar from '../components/RightSideBar'
import Navbar from '../components/NavBar'
import Footer from '../components/Footer'

const DissussionRoom = () => {
  return (
    <div>
    <Navbar></Navbar>

    <LeftSidebar></LeftSidebar>
    <div>DissussionRoom</div>
    <RightSideBar></RightSideBar>
    <Footer></Footer>
    </div>

  )
}

export default DissussionRoom
