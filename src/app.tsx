import { useLocalStorage } from './hooks/useLocalStorage';
import { Canvas } from './components/Canvas';
import type { Note } from './types';

export function App() {
  const [notes, setNotes] = useLocalStorage<Note[]>('permanote-notes', []);

  return (
    <div className="w-full h-screen bg-gray-50 overflow-hidden">
      <Canvas notes={notes} onNotesChange={setNotes} />
    </div>
  );
}
