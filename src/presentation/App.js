import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import MaintenancePage from './pages/MaintenancePage';

const App = () => {
    return (
    <Router basename="/FlickSearcher">
        <div className="app">
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/movie/:id" element={<MovieDetail />} />
            <Route path="/maintenance" element={<MaintenancePage />} />
        </Routes>
        </div>
    </Router>
    );
};

export default App;