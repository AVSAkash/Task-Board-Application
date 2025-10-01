import React, { useContext, useState } from "react";
import { BoardContext } from "../context/BoardContext";
import type { Board } from "../context/BoardContext";
import { v4 as uuid } from "uuid";
import BoardCard from "../components/BoardCard";
import { Plus } from 'lucide-react';

export default function BoardView() {
  const context = useContext(BoardContext);
  if (!context) throw new Error("BoardContext must be used within BoardProvider");

  const { boards, setBoards } = context;
  const [boardName, setBoardName] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const createBoard = () => {
    if (!boardName.trim()) return;
    const newBoard: Board = { id: uuid(), name: boardName, columns: [] };
    setBoards([...boards, newBoard]);
    setBoardName("");
  };

  const saveBoardName = (id: string, newName: string) => {
    const updated = boards.map((b) => (b.id === id ? { ...b, name: newName } : b));
    setBoards(updated);
  };

  const deleteBoard = (id: string) => {
    const updated = boards.filter((b) => b.id !== id);
    setBoards(updated);
  };

  const filteredBoards = boards.filter((b) =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    // Change: Centered main container with max-width
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Boards</h1>

      {/* Change: Updated form styling */}
      <div className="my-6 flex flex-col sm:flex-row gap-4">
        <input
          className="flex-grow border border-slate-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search boards..."
        />
        <div className="flex gap-2">
          <input
            className="flex-grow border border-slate-300 rounded-md shadow-sm p-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            placeholder="New Board Name"
          />
          <button
            className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition-colors"
            onClick={createBoard}
          >
            <Plus size={16} /> Create
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBoards.map((board) => (
          <BoardCard
            key={board.id}
            board={board}
            onSave={saveBoardName}
            onDelete={deleteBoard}
          />
        ))}
      </div>
    </div>
  );
}