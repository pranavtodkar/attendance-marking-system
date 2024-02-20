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
    <div class="App">
      <Router>
        <Container />
      </Router> 
    </div>
  );
}

export default App;
