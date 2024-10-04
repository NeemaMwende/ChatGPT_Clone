import './App.css';
import Sidebar from './components/Sidebar';
import Chat from './components/Chat';
import Header from './components/Header';

function App() {
  const user = { profilePicture: '../src/components/logo.png' }; // Example user object

  return (
    <div className="app-container">
      <Header user={user} /> {/* Pass the user object to the Header */}

      <div className="main-content">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default App;
