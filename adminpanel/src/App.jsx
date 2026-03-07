import React, { useState } from 'react'
import ListFood from './pages/ListFood/ListFood'
import Sidebar from './components/Sidebar/Sidebar'
import Menubar from './components/Menubar/Menubar'
import { Route, Routes } from 'react-router-dom'
import AddFood from './pages/AddFood/AddFood'
import Orders from './pages/Orders/Orders'

const App = () => {

  const [sidebarvisible, setSidebarvisible] = useState(true);

  const toggleSidebar = () => {
    setSidebarvisible(!sidebarvisible);
  }

  return (
    <div className="d-flex" id="wrapper">
            
            <Sidebar sidebarvisible={sidebarvisible} />
            
            <div id="page-content-wrapper">
                
                <Menubar toggleSidebar={toggleSidebar} />
                
                <div className="container-fluid">
                    <Routes>
                      <Route path = "/add" element={<AddFood />} />
                      <Route path = "/list" element={<ListFood />} />
                      <Route path = "/orders" element={<Orders />} />
                      <Route path = "/" element={<ListFood />} />
                    </Routes>
                </div>
            </div>
        </div>
  )
}

export default App