import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { useAppSelector } from './redux/hooks';
import HomeScreen from './screens/HomeScreen';
import GameScreen from './screens/GameScreen';
import LevelSelectScreen from './screens/LevelSelectScreen';
import LeaderboardScreen from './screens/LeaderboardScreen';
// import LoginScreen from './screens/LoginScreen';
import ProfileScreen from './screens/ProfileScreen';

/** Wrapper that applies dark/light mode class to root */
function ThemeWrapper({ children }: { children: React.ReactNode }) {
  const { darkMode } = useAppSelector((state) => state.ui);
  return <div className={darkMode ? '' : 'light-mode'}>{children}</div>;
}

function AppRoutes() {
  return (
    <ThemeWrapper>
      <Routes>
        <Route path="/" element={<HomeScreen />} />
        <Route path="/game" element={<GameScreen />} />
        <Route path="/levels" element={<LevelSelectScreen />} />
        <Route path="/leaderboard" element={<LeaderboardScreen />} />
        <Route path="/profile" element={<ProfileScreen />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ThemeWrapper>
  );
}

function App() {
  return (
    <Provider store={store}>
      <Router>
        <AppRoutes />
      </Router>
    </Provider>
  );
}

export default App;
