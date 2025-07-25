import { useState, useRef, useCallback, useEffect } from 'preact/hooks';
import type { Note, Position } from '../types';
import { StickyNote } from './StickyNote';

interface CanvasProps {
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
}

export function Canvas({ notes, onNotesChange }: CanvasProps) {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState<number | null>(null);
  const [maxZIndex, setMaxZIndex] = useState(1);

  // Initialize z-index for existing notes
  useEffect(() => {
    const notesWithoutZIndex = notes.filter(note => note.zIndex == null);
    if (notesWithoutZIndex.length > 0) {
      const updatedNotes = notes.map((note, index) => 
        note.zIndex == null 
          ? { ...note, zIndex: index + 1 }
          : note
      );
      const currentMaxZ = Math.max(...updatedNotes.map(n => n.zIndex));
      setMaxZIndex(currentMaxZ);
      onNotesChange(updatedNotes);
    } else if (notes.length > 0) {
      const currentMaxZ = Math.max(...notes.map(n => n.zIndex || 1));
      setMaxZIndex(currentMaxZ);
    }
  }, []);

  const generateId = () => {
    return Math.random().toString(36).substr(2, 9);
  };

  const bringToFront = useCallback((noteId: string) => {
    const newMaxZIndex = maxZIndex + 1;
    setMaxZIndex(newMaxZIndex);
    
    const updatedNotes = notes.map(note => 
      note.id === noteId 
        ? { ...note, zIndex: newMaxZIndex, updated: new Date() }
        : note
    );
    onNotesChange(updatedNotes);
  }, [notes, onNotesChange, maxZIndex]);

  const createNote = useCallback((x: number, y: number) => {
    const newMaxZIndex = maxZIndex + 1;
    setMaxZIndex(newMaxZIndex);
    
    const newNote: Note = {
      id: generateId(),
      x: Math.max(0, x - 100), // Center the note on click position
      y: Math.max(0, y - 100),
      width: 200,
      height: 200, // Make it square
      content: 'New note',
      type: 'text',
      color: '#fef08a', // Yellow sticky note color
      zIndex: newMaxZIndex,
      created: new Date(),
      updated: new Date(),
    };

    console.log('New note created:', newNote); // Debug log
    onNotesChange([...notes, newNote]);
  }, [notes, onNotesChange, maxZIndex]);

  const handleCanvasClick = useCallback((e: any) => {
    if (!canvasRef.current) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setClickCount(prev => prev + 1);

    if (clickTimeout) {
      clearTimeout(clickTimeout);
    }

    const timeout = setTimeout(() => {
      if (clickCount === 0) { // This will be 1 after the increment
        // Single click - do nothing
        console.log('Single click detected');
      }
      setClickCount(0);
    }, 300);

    setClickTimeout(timeout);

    // Check if this is the second click
    if (clickCount === 1) {
      clearTimeout(timeout);
      setClickCount(0);
      console.log('Double click detected at:', x, y);
      createNote(x, y);
    }
  }, [clickCount, clickTimeout, createNote]);

  const handleNoteUpdate = useCallback((updatedNote: Note) => {
    const updatedNotes = notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    );
    onNotesChange(updatedNotes);
  }, [notes, onNotesChange]);

  const handleNoteDelete = useCallback((noteId: string) => {
    const filteredNotes = notes.filter(note => note.id !== noteId);
    onNotesChange(filteredNotes);
  }, [notes, onNotesChange]);

  return (
    <div
      ref={canvasRef}
      className="w-full h-full bg-gray-50 relative overflow-hidden cursor-crosshair"
      onClick={handleCanvasClick}
    >
      <div className="absolute top-4 left-4 text-sm text-gray-500 pointer-events-none select-none">
        Double-click anywhere to create a new note
      </div>
      <div className="absolute top-4 left-4 pt-6 text-sm text-gray-500 pointer-events-auto select-none">
        <span className="mr-4">{notes.length} notes</span>
        <button
          onClick={(e: any) => {
            e.stopPropagation();
            onNotesChange([]);
          }}
          className="text-red-600 hover:text-red-800"
        >
          Clear All
        </button>
      </div>
      
      {notes.map(note => (
        <StickyNote
          key={note.id}
          note={note}
          onUpdate={handleNoteUpdate}
          onDelete={handleNoteDelete}
          onBringToFront={bringToFront}
        />
      ))}
    </div>
  );
}