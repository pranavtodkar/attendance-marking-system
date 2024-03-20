import { BrowserRouter as Router, useRoutes } from 'react-router-dom';
import './App.css';

import StudentHome from './Pages/StudentHome';
import TestPage from './Pages/TestPage';

const Container = () => {
  let routes = useRoutes([
    // Home route
    { path: "/", element: 
    <div>
      <StudentHome />
    </div>
    },
    { path: "/testpage", element: 
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
      <div className="w-[80vh] justify-center text-center container bg-white">
        <Router>
          <Container />
        </Router>
      </div>
    </div>
  );
}

export default App;
