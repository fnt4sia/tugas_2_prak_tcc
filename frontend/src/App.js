import React, { useState, useEffect } from "react";

const App = () => {
  const [notes, setNotes] = useState([]);
  const [selectedNote, setSelectedNote] = useState(null);
  const [newNote, setNewNote] = useState({ title: "", description: "" });

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    const response = await fetch("http://localhost:3009/notes");
    const data = await response.json();
    setNotes(data);
  };

  const handleSelectNote = (note) => {
    setSelectedNote(note);
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:3009/notes/${id}`, { method: "DELETE" });
    fetchNotes();
    setSelectedNote(null);
  };

  const handleEdit = async () => {
    if (!selectedNote) return;
    await fetch(`http://localhost:3009/notes/${selectedNote.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(selectedNote),
    });
    fetchNotes();
  };

  const handleCreate = async () => {
    if (newNote.title.trim() === "" || newNote.description.trim() === "") return;
    await fetch("http://localhost:3009/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newNote),
    });
    fetchNotes();
    setNewNote({ title: "", description: "" });
  };

  return (
    <div className="flex h-screen">
      <div className="w-1/3 p-4 border-r">
        <h2 className="font-bold">Notes</h2>
        <ul>
          {notes.map((note) => (
            <li
              key={note.id}
              className="cursor-pointer p-2 border-b"
              onClick={() => handleSelectNote(note)}
            >
              {note.title}
            </li>
          ))}
        </ul>
      </div>
      <div className="w-2/3 p-4">
        {selectedNote ? (
          <div>
            <input
              type="text"
              value={selectedNote.title}
              onChange={(e) => setSelectedNote({ ...selectedNote, title: e.target.value })}
              className="border p-2 w-full mb-2"
            />
            <textarea
              value={selectedNote.description}
              onChange={(e) => setSelectedNote({ ...selectedNote, description: e.target.value })}
              className="border p-2 w-full"
            />
            <div className="mt-2">
              <button className="bg-blue-500 text-white px-4 py-2 mr-2" onClick={handleEdit}>Edit</button>
              <button className="bg-red-500 text-white px-4 py-2" onClick={() => handleDelete(selectedNote.id)}>Delete</button>
            </div>
          </div>
        ) : (
          <p>Select a note to view details</p>
        )}
        <div className="mt-4">
          <h3 className="font-bold">Create New Note</h3>
          <input
            type="text"
            placeholder="Title"
            value={newNote.title}
            onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
            className="border p-2 w-full mb-2"
          />
          <textarea
            placeholder="Description"
            value={newNote.description}
            onChange={(e) => setNewNote({ ...newNote, description: e.target.value })}
            className="border p-2 w-full"
          />
          <button className="bg-green-500 text-white px-4 py-2 mt-2" onClick={handleCreate}>Create</button>
        </div>
      </div>
    </div>
  );
};

export default App;
