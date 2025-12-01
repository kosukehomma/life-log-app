import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useLogs } from './store/useLogs';
import Layout from './components/Layout';

import Home from './pages/Home';
import Month from './pages/Month';
import Add from './pages/Add';
import Edit from './pages/Edit';
import MealEdit from './pages/meal/Edit';

const App = () => {
  useEffect(() => {
    useLogs.getState().loadFromStorage();
  }, []);

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/month/:year/:month" element={<Month />} />
        <Route path="/add" element={<Add />} />
        <Route path="/edit/:id" element={<Edit />} />
        <Route path="/meal/edit/:mealId" element={<MealEdit />} />
      </Routes>
    </Layout>
  );
};

export default App;
