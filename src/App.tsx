import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';

// Layout components
import Sidebar from './components/Sidebar';
import Header from './components/Header';

// Pages
import Dashboard from './pages/Dashboard.tsx';
import DocumentAssistant from './pages/DocumentAssistant.tsx';
import EmailAssistant from './pages/EmailAssistant.tsx';
import KnowledgeBase from './pages/KnowledgeBase.tsx';
import WorkPlanner from './pages/WorkPlanner.tsx';
import MeetingAssistant from './pages/MeetingAssistant.tsx';
import HealthCare from './pages/HealthCare.tsx';
import CreativeAssistant from './pages/CreativeAssistant.tsx';
import TranslationAssistant from './pages/TranslationAssistant.tsx';
import TravelAssistant from './pages/TravelAssistant.tsx';
import Settings from './pages/Settings.tsx';
import Profile from './pages/Profile.tsx';
import './App.css';

const App: React.FC = () => {
  return (
    <ConfigProvider locale={zhCN}>
      <Router>
        <div className="app-layout">
          <aside className="app-sidebar">
            <Sidebar />
          </aside>
          <div className="app-main-content-wrapper">
            <header className="app-header">
              <Header />
            </header>
            <main className="app-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/document" element={<DocumentAssistant />} />
                <Route path="/email" element={<EmailAssistant />} />
                <Route path="/knowledge" element={<KnowledgeBase />} />
                <Route path="/work" element={<WorkPlanner />} />
                <Route path="/meeting" element={<MeetingAssistant />} />
                <Route path="/health" element={<HealthCare />} />
                <Route path="/creative" element={<CreativeAssistant />} />
                <Route path="/translation" element={<TranslationAssistant />} />
                <Route path="/travel" element={<TravelAssistant />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </ConfigProvider>
  );
};

export default App; 