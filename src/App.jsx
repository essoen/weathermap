import { TripProvider } from './contexts/TripContext';
import MapView from './components/Map/MapView';
import Sidebar from './components/Sidebar/Sidebar';

export default function App() {
  return (
    <TripProvider>
      <div className="h-full w-full relative">
        <Sidebar />
        <MapView />
      </div>
    </TripProvider>
  );
}
