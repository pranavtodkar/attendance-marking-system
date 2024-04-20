import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import './App.css';

import StudentHome from './Pages/StudentHome';
import FaceDetection from './Pages/FaceDetection'
import Marked from './Pages/Marked'
import DetectionFail from './Pages/DetectionFail'
import AdminHome from './Pages/AdminHome';
import StartAttendance from './Pages/StartAttendance';
import TestPage from './Pages/TestPage';
import UserSelect from './Pages/UserSelect';
import Login from './Pages/Login';
import RegisterFace from './Pages/RegisterFace';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Container = () => {
  let routes = useRoutes([
    // Home route
    { path: "/", element: 
    <div>
      <StudentHome />
    </div>
    },
    { path: "/verify", element: 
    <div>
      <FaceDetection />
    </div>
    },
    { path: "/marked", element: 
    <div>
      <Marked />
    </div>
    },
    { path: "/detectFail", element: 
    <div>
      <DetectionFail />
    </div>
    },{
      path: "/admin", element: 
    <div>
      <AdminHome />
    </div>
    },
    {
      path: "/admin/startAttendance", element: 
    <div>
      <StartAttendance />
    </div>
    },
    {
      path: "/test", element: 
    <div>
      <TestPage />
    </div>
    },
    {
      path: "/userselect", element: 
      <div>
        <UserSelect />
      </div>
    },
    {
      path: "/login", element: 
      <div>
        <Login />
      </div>
    },

    {
      path: "/registerface", element: 
      <div>
        <RegisterFace />
      </div>
    },
    
  ]);

  return routes;
};


function App() {
  return (
    <div className="justify-center flex h-screen bg-blue-100">
      <div className="w-[80vh] justify-center text-center container bg-white ">
        <div className='flex h-12 bg-[#002772] text-white justify-center text-center items-center'>Attendance Marking System</div>
        <Router>
          <Container />
          <ToastContainer />
        </Router>
      </div>
    </div>
  );
}

export default App;
