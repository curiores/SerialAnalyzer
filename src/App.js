import './App.css';
import PersistentDrawerLeft from './Components/Drawer.tsx';
import { useEffect, useState } from 'react';

function useAppVersion() {
  const [version, setVersion] = useState('');
  useEffect(() => {
    let mounted = true;
    const getter = window.getAppVersion;
    if (typeof getter === 'function') {
      getter().then(v => {
        if (mounted) setVersion(v || '');
      }).catch(() => {});
    }
    return () => { mounted = false; };
  }, []);
  return version;
}

function useAppName() {
  const [name, setName] = useState('');
  useEffect(() => {
    let mounted = true;
    const getter = window.getAppName;
    if (typeof getter === 'function') {
      getter().then(n => {
        if (mounted) setName(n || '');
      }).catch(() => {});
    }
    return () => { mounted = false; };
  }, []);
  return name;
}

function App() {
  const version = useAppVersion();
  const name = useAppName();
  const appName = name || 'Serial Analyzer';
  const titleText = `${appName}${version ? ` v${version}` : ''}`;
  return (
    <div className="App">
      <div className="topBar">
          <div className="title">{titleText}</div>
      </div>
        <PersistentDrawerLeft />
    </div>
  );
}

export default App;
