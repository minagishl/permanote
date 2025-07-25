import { useState, useRef, useCallback, useEffect } from 'preact/hooks';
import type { Note, Position } from '../types';
import { CodeBlock } from './CodeBlock';
import { ColorPicker } from './ColorPicker';
import { FileText, Code2, X } from 'lucide-preact';

interface StickyNoteProps {
  note: Note;
  onUpdate: (note: Note) => void;
  onDelete: (noteId: string) => void;
  onBringToFront: (noteId: string) => void;
}

export function StickyNote({
  note,
  onUpdate,
  onDelete,
  onBringToFront,
}: StickyNoteProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [dragOffset, setDragOffset] = useState<Position>({ x: 0, y: 0 });
  const [resizeStart, setResizeStart] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const [clickCount, setClickCount] = useState(0);
  const [clickTimeout, setClickTimeout] = useState<number | null>(null);
  const noteRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleMouseDown = useCallback(
    (e: any) => {
      if (isEditing || isResizing) return;

      e.preventDefault();
      e.stopPropagation(); // Stop event bubbling
      onBringToFront(note.id); // Bring to front when starting to drag
      setIsDragging(true);

      const rect = noteRef.current?.getBoundingClientRect();
      if (rect) {
        setDragOffset({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        });
      }
    },
    [isEditing, isResizing, onBringToFront, note.id]
  );

  const handleNoteClick = useCallback(
    (e: any) => {
      e.stopPropagation(); // Prevent canvas click
      onBringToFront(note.id); // Bring to front when clicked
    },
    [onBringToFront, note.id]
  );

  const handleResizeStart = useCallback(
    (e: any) => {
      e.preventDefault();
      e.stopPropagation();
      setIsResizing(true);

      setResizeStart({
        x: e.clientX,
        y: e.clientY,
        width: note.width,
        height: note.height,
      });
    },
    [note.width, note.height]
  );

  const handleContentClick = useCallback(
    (e: any) => {
      e.stopPropagation();

      if (isDragging || isResizing) return;

      onBringToFront(note.id); // Bring to front when content is clicked
      console.log('Content clicked, clickCount:', clickCount);

      const newCount = clickCount + 1;
      setClickCount(newCount);

      if (clickTimeout) {
        clearTimeout(clickTimeout);
      }

      // Check for double click immediately
      if (newCount >= 2) {
        console.log('Double click detected! Starting edit mode');
        setIsEditing(true);
        setClickCount(0);
        return;
      }

      const timeout = setTimeout(() => {
        console.log('Click timeout, resetting count');
        setClickCount(0);
      }, 300);

      setClickTimeout(timeout);
    },
    [isDragging, isResizing, clickCount, clickTimeout, onBringToFront, note.id]
  );

  // Use useEffect to handle focus when editing starts
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      console.log('Edit mode activated, focusing textarea');
      // Use a longer timeout to ensure the textarea is fully rendered
      setTimeout(() => {
        if (textareaRef.current) {
          textareaRef.current.focus();
          textareaRef.current.select();
          console.log('Textarea focused and selected');
        }
      }, 50);
    }
  }, [isEditing]);

  const handleContentChange = useCallback(
    (e: any) => {
      e.stopPropagation();
      const target = e.currentTarget as HTMLTextAreaElement;
      onUpdate({
        ...note,
        content: target.value,
        updated: new Date(),
      });
    },
    [note, onUpdate]
  );

  const handleBlur = useCallback(() => {
    console.log('Textarea blur - exiting edit mode');
    setIsEditing(false);
  }, []);

  const handleKeyDown = useCallback((e: any) => {
    e.stopPropagation();
    if (e.key === 'Escape') {
      console.log('Escape pressed - exiting edit mode');
      setIsEditing(false);
      textareaRef.current?.blur();
    }
  }, []);

  const handleTextareaClick = useCallback((e: any) => {
    e.stopPropagation();
    console.log('Textarea clicked');
  }, []);

  const handleDeleteClick = useCallback(
    (e: any) => {
      e.stopPropagation();
      onDelete(note.id);
    },
    [note.id, onDelete]
  );

  const toggleNoteType = useCallback(
    (e: any) => {
      e.stopPropagation();
      onUpdate({
        ...note,
        type: note.type === 'text' ? 'code' : 'text',
        language: note.type === 'text' ? 'javascript' : undefined,
        updated: new Date(),
      });
    },
    [note, onUpdate]
  );

  const handleColorChange = useCallback(
    (color: string) => {
      onUpdate({
        ...note,
        color,
        updated: new Date(),
      });
    },
    [note, onUpdate]
  );

  // Add event listeners for drag and resize
  useEffect(() => {
    if (isDragging) {
      // Set cursor to grabbing for the entire document while dragging
      document.body.style.cursor = 'grabbing';

      const handleMove = (e: MouseEvent) => {
        e.preventDefault();
        const newX = e.clientX - dragOffset.x;
        const newY = e.clientY - dragOffset.y;

        // Throttle updates to improve performance
        requestAnimationFrame(() => {
          onUpdate({
            ...note,
            x: Math.max(0, newX),
            y: Math.max(0, newY),
            updated: new Date(),
          });
        });
      };

      const handleUp = () => {
        setIsDragging(false);
        // Reset cursor when dragging ends
        document.body.style.cursor = '';
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);

      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
        // Reset cursor when component unmounts
        document.body.style.cursor = '';
      };
    }
  }, [isDragging, dragOffset, note, onUpdate]);

  useEffect(() => {
    if (isResizing) {
      // Set cursor to se-resize for the entire document while resizing
      document.body.style.cursor = 'se-resize';

      const handleMove = (e: MouseEvent) => {
        e.preventDefault();
        const deltaX = e.clientX - resizeStart.x;
        const deltaY = e.clientY - resizeStart.y;

        const newWidth = Math.max(150, resizeStart.width + deltaX);
        const newHeight = Math.max(100, resizeStart.height + deltaY);

        requestAnimationFrame(() => {
          onUpdate({
            ...note,
            width: newWidth,
            height: newHeight,
            updated: new Date(),
          });
        });
      };

      const handleUp = () => {
        setIsResizing(false);
        // Reset cursor when resizing ends
        document.body.style.cursor = '';
      };

      document.addEventListener('mousemove', handleMove);
      document.addEventListener('mouseup', handleUp);

      return () => {
        document.removeEventListener('mousemove', handleMove);
        document.removeEventListener('mouseup', handleUp);
        // Reset cursor when component unmounts
        document.body.style.cursor = '';
      };
    }
  }, [isResizing, resizeStart, note, onUpdate]);

  return (
    <div
      ref={noteRef}
      className={`absolute select-none ${
        isDragging ? 'shadow-xl' : 'shadow-md'
      } ${note.type === 'code' ? 'font-mono' : 'font-sans'}`}
      style={{
        left: note.x,
        top: note.y,
        width: note.width,
        height: note.height,
        backgroundColor: note.color,
        cursor: isDragging ? 'grabbing' : 'grab',
        zIndex: note.zIndex,
      }}
      onMouseDown={handleMouseDown}
      onClick={handleNoteClick}
    >
      {/* Note header */}
      <div
        className="flex justify-between items-center p-2"
        style={{ backgroundColor: note.color }}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={toggleNoteType}
            className="p-1 hover:opacity-60"
            title={note.type === 'code' ? 'Switch to text' : 'Switch to code'}
          >
            {note.type === 'code' ? (
              <Code2 size={14} className="text-gray-700" />
            ) : (
              <FileText size={14} className="text-gray-700" />
            )}
          </button>
          {note.type === 'code' && (
            <span className="text-xs opacity-70">{note.language}</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <ColorPicker
            currentColor={note.color}
            onColorChange={handleColorChange}
          />
          <button
            onClick={handleDeleteClick}
            className="p-1 hover:opacity-60"
            title="Delete note"
          >
            <X size={14} className="text-red-600" />
          </button>
        </div>
      </div>

      {/* Note content */}
      <div className="p-3 h-full">
        {isEditing ? (
          <textarea
            ref={textareaRef}
            value={note.content}
            onInput={handleContentChange}
            onChange={handleContentChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            onClick={handleTextareaClick}
            className="w-full bg-transparent border-none outline-none resize-none text-sm"
            style={{
              fontFamily: note.type === 'code' ? 'monospace' : 'inherit',
              height: 'calc(100% - 40px)',
              minHeight: 'calc(100% - 40px)',
              maxHeight: 'calc(100% - 40px)',
              background: 'transparent',
              color: '#000',
              padding: '0',
              margin: '0',
              pointerEvents: 'auto',
              zIndex: 1000,
            }}
            placeholder={
              note.type === 'code'
                ? 'Enter your code here...'
                : 'Enter your note here...'
            }
            tabIndex={0}
            autoFocus
          />
        ) : (
          <div
            className="w-full overflow-auto"
            style={{
              height: 'calc(100% - 40px)',
            }}
            onClick={handleContentClick}
          >
            {note.type === 'code' && note.content ? (
              <CodeBlock
                code={note.content}
                language={note.language || 'javascript'}
                className="h-full"
              />
            ) : (
              <div
                className="w-full h-full text-sm whitespace-pre-wrap"
                style={{
                  fontFamily: note.type === 'code' ? 'monospace' : 'inherit',
                }}
                onClick={handleContentClick}
              >
                {note.content ||
                  (note.type === 'code'
                    ? 'Enter your code here...'
                    : 'Enter your note here...')}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Resize handle */}
      <div
        className="absolute bottom-0 right-0 w-3 h-3 cursor-se-resize opacity-50 hover:opacity-100"
        style={{
          clipPath: 'polygon(100% 0%, 0% 100%, 100% 100%)',
          backgroundColor: '#9ca3af',
        }}
        onMouseDown={handleResizeStart}
      />
    </div>
  );
}
