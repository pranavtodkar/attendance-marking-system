import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import './App.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import StudentHome from './Pages/StudentHome';
import FaceDetection from './Pages/FaceDetection'
import Marked from './Pages/Marked'
import FacultyHome from './Pages/FacultyHome';
import StartAttendance from './Pages/StartAttendance';
import TestPage from './Pages/TestPage';
import RegisterFace from './Pages/RegisterFace';

const Container = () => {
  let routes = useRoutes([
    { path: "/", element: 
    <div>
      <StudentHome />
    </div>
    },
    { path: "/facedetection", element: 
    <div>
      <FaceDetection />
    </div>
    },
    { path: "/marked", element: 
    <div>
      <Marked />
    </div>
    },
    {
      path: "/faculty", element: 
    <div>
      <FacultyHome />
    </div>
    },
    {
      path: "/faculty/startAttendance", element: 
    <div>
      <StartAttendance />
    </div>
    },
    {
      path: "/registerface", element: 
      <div>
        <RegisterFace />
      </div>
    },    
    {
      path: "/test", element: 
    <div>
      <TestPage />
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
