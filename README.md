# Permanote

A canvas-like note-taking application where you can place sticky notes anywhere on the page. Perfect for organizing thoughts, code snippets, and ideas with an intuitive drag-and-drop interface.

## Features

- **Canvas Interface**: Click anywhere on the canvas to create new sticky notes
- **Drag & Drop**: Move notes around freely by dragging them
- **Text & Code Notes**: Switch between regular text notes and code notes with syntax highlighting
- **Syntax Highlighting**: Support for multiple programming languages including JavaScript, TypeScript, Python, Java, C/C++, CSS, HTML, JSON, and Bash
- **Color Customization**: Choose from a variety of preset colors for your notes
- **Persistent Storage**: Notes are automatically saved to localStorage and restored on page reload
- **Real-time Editing**: Double-click any note to edit its content inline
- **Note Management**: Delete individual notes or clear all notes at once

## Getting Started

### Prerequisites

- Node.js (version 20 or higher)
- pnpm package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/minagishl/permanote.git
cd permanote
```

2. Install dependencies:

```bash
pnpm install
```

3. Start the development server:

```bash
pnpm dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

## Usage

### Creating Notes

- Double-click anywhere on the canvas to create a new sticky note
- Notes appear with a default yellow color and can be immediately edited

### Editing Notes

- Double-click on any note to enter edit mode
- Press `Escape` or `Ctrl+Enter` to exit edit mode
- Click outside the note to save and exit edit mode

### Moving Notes

- Click and drag any note to move it around the canvas
- Notes will snap to the cursor and provide visual feedback during dragging

### Note Types

- **Text Notes**: Regular notes for general text content
- **Code Notes**: Notes with syntax highlighting for code snippets
- Toggle between types using the TYPE/CODE button in the note header

### Customization

- Use the color picker in each note's header to change its color
- Choose from 10 preset colors including yellow, blue, pink, purple, and more

### Note Management

- Click the × button in any note's header to delete it
- Use the "Clear All" button in the top-right corner to remove all notes
- The note counter shows how many notes are currently on the canvas

## Technical Details

### Technology Stack

- **Frontend Framework**: Preact (React-compatible)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Language**: TypeScript
- **Syntax Highlighting**: Prism.js
- **Storage**: Browser localStorage

### Project Structure

```
src/
├── components/
│   ├── Canvas.tsx          # Main canvas component
│   ├── StickyNote.tsx      # Individual note component
│   ├── CodeBlock.tsx       # Syntax highlighting component
│   └── ColorPicker.tsx     # Color selection component
├── hooks/
│   └── useLocalStorage.ts  # localStorage management hook
├── types.ts                # Type definitions
├── app.tsx                 # Main app component
└── main.tsx                # Entry point
```

### Data Persistence

Notes are automatically saved to the browser's localStorage under the key `permanote-notes`. This includes:

- Note position (x, y coordinates)
- Note dimensions (width, height)
- Note content and type
- Color selection
- Creation and modification timestamps

## Browser Compatibility

Permanote works in all modern browsers that support:

- ES6+ JavaScript features
- CSS Grid and Flexbox
- localStorage API
- Modern event handling

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Development Commands

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm preview` - Preview production build locally

## Supported Programming Languages

The code syntax highlighting supports the following languages:

- JavaScript
- TypeScript
- Python
- Java
- C
- C++
- CSS
- HTML
- JSON
- Bash/Shell

## License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.
