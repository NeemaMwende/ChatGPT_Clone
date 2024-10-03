import './App.css';
// import Form from './components/Form';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Header from './components/Header';

function App() {
  return (
    <div className="app-container">
    <Header />
    <div className="main-content">
      <Sidebar />
      <Chat />
    </div>
  </div>
  );
}

export default App;
