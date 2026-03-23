import { TripProvider } from './contexts/TripContext';
import ErrorBoundary from './components/common/ErrorBoundary';
import MapView from './components/Map/MapView';
import Sidebar from './components/Sidebar/Sidebar';

export default function App() {
  return (
    <ErrorBoundary>
      <TripProvider>
        <div className="h-full w-full relative">
          <Sidebar />
          <MapView />
        </div>
      </TripProvider>
    </ErrorBoundary>
  );
}
