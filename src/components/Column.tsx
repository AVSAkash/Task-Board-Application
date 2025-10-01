import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import type { Column as ColumnType, Task } from '../context/BoardContext';
import TaskCard from './TaskCard';
import { Plus, Pencil, Trash2 } from 'lucide-react';

// Error Fix: The props interface was missing.
interface ColumnProps {
  column: ColumnType;
  tasks: Task[];
  onEditColumn: (colId: string, newTitle: string) => void;
  onDeleteColumn: (colId: string) => void;
  onAddTask: (colId: string) => void;
  onEditTask: (colId: string, taskId: string) => void;
  onDeleteTask: (colId: string, taskId: string) => void;
  showTaskForm: { colId: string; taskId?: string } | null;
  taskForm: Omit<Task, 'id'>;
  setTaskForm: React.Dispatch<React.SetStateAction<Omit<Task, 'id'>>>;
  handleSaveTask: (colId: string, taskId?: string) => void;
  setShowTaskForm: (formState: { colId: string; taskId?: string } | null) => void;
}

// Error Fix: Added the full props and their types to the function signature.
export default function Column({
  column,
  tasks,
  onEditColumn,
  onDeleteColumn,
  onAddTask,
  onEditTask,
  onDeleteTask,
  showTaskForm,
  taskForm,
  setTaskForm,
  handleSaveTask,
  setShowTaskForm,
}: ColumnProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const handleTitleSave = () => {
    if (columnTitle.trim()) {
      onEditColumn(column.id, columnTitle);
    }
    setIsEditingTitle(false);
  };

  return (
    <div className="bg-slate-100 p-3 rounded-lg border border-slate-200 min-w-[300px] flex flex-col">
      <div className="flex justify-between items-center mb-4 px-1">
        {isEditingTitle ? (
           // Error Fix: Implemented the input field for editing the column title.
          <input
            className="border border-slate-300 p-1 flex-1 mr-2 rounded-md focus:ring-2 focus:ring-indigo-500"
            value={columnTitle}
            onChange={(e) => setColumnTitle(e.target.value)}
            onBlur={handleTitleSave}
            onKeyDown={(e) => e.key === 'Enter' && handleTitleSave()}
            autoFocus
          />
        ) : (
          <h2 className="font-semibold text-slate-700">{column.title}</h2>
        )}
        {/* Error Fix: Implemented the edit/delete buttons for the column title. */}
        <div className="flex gap-1">
          <button className="p-1 text-slate-500 hover:text-amber-600" onClick={() => setIsEditingTitle(true)}><Pencil size={16} /></button>
          <button className="p-1 text-slate-500 hover:text-red-600" onClick={() => onDeleteColumn(column.id)}><Trash2 size={16} /></button>
        </div>
      </div>

      <Droppable droppableId={column.id} type="task">
        {/* Error Fix: Filled in the logic to map over tasks and render TaskCard components. */}
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`flex-grow min-h-[100px] transition-colors duration-200 ${snapshot.isDraggingOver ? 'bg-blue-100 rounded-md' : ''}`}
          >
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                colId={column.id}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      {showTaskForm?.colId === column.id ? (
         // Error Fix: Implemented the form for adding/editing tasks.
        <div className="p-2 mt-2 bg-white rounded-md shadow">
          <h4 className="font-medium mb-2">{showTaskForm.taskId ? 'Edit Task' : 'Add Task'}</h4>
          <input
            className="border p-2 w-full mb-2 rounded-md"
            placeholder="Title"
            value={taskForm.title}
            onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
          />
          <textarea
            className="border p-2 w-full mb-2 rounded-md"
            placeholder="Description"
            value={taskForm.description}
            onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
          />
          <input
            className="border p-2 w-full mb-2 rounded-md"
            placeholder="Created By"
            value={taskForm.createdBy}
            onChange={(e) => setTaskForm({ ...taskForm, createdBy: e.target.value })}
          />
          <input
            type="date"
            className="border p-2 w-full mb-2 rounded-md"
            value={taskForm.dueDate}
            onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
          />
          <select
            className="border p-2 w-full mb-3 rounded-md"
            value={taskForm.priority}
            onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <div className="flex gap-2">
            <button
              className="bg-indigo-600 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-indigo-700"
              onClick={() => handleSaveTask(column.id, showTaskForm.taskId)}
            >
              Save
            </button>
            <button
              className="bg-slate-200 text-slate-700 px-3 py-1 rounded-md text-sm font-semibold hover:bg-slate-300"
              onClick={() => setShowTaskForm(null)}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          className="mt-2 flex items-center justify-center gap-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 p-2 rounded-md transition-colors"
          onClick={() => onAddTask(column.id)}
        >
          <Plus size={16} /> Add Task
        </button>
      )}
    </div>
  );
}