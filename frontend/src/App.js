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
    <div className="justify-center flex">
      <div className="w-[80vh] justify-centre min-h-[80vh] text-center container">
        <Router>
          <Container />
        </Router>
      </div>
    </div>
  );
}

export default App;
