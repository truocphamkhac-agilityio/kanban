import React from 'react';
import Note from './Note.jsx';

export default ({notes, onEdit, onDelete}) => {
  return (
    <ul className="notes">
      {notes.map(note =>
        <li key={note.id}>
          <Note className="note" task={note.task}
            onEdit={onEdit.bind(null, note.id)}
            onDelete={onDelete.bind(null, note.id)} />
        </li>
      )}
    </ul>
  );
}
