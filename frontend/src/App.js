import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import './App.css';

import StudentHome from './Pages/StudentHome';
import FaceDetection from './Pages/FaceDetection'
import Marked from './Pages/Marked'

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
        </Router>
      </div>
    </div>
  );
}

export default App;
