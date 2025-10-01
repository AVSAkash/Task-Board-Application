import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import type { Task } from '../context/BoardContext';
import { Pencil, Trash2, Calendar, User } from 'lucide-react';

// Error Fix: The props interface was missing.
interface TaskCardProps {
  task: Task;
  index: number;
  colId: string;
  onEdit: (colId: string, taskId: string) => void;
  onDelete: (colId: string, taskId: string) => void;
}

const priorityColors: Record<string, string> = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-amber-100 text-amber-800 border-amber-200',
  low: 'bg-green-100 text-green-800 border-green-200',
};

// Error Fix: Added the props and their types to the function signature.
export default function TaskCard({ task, index, colId, onEdit, onDelete }: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="p-4 bg-white mb-3 border border-slate-200 rounded-lg shadow-sm"
        >
          <h3 className="font-semibold text-slate-800">{task.title}</h3>
          <p className="text-sm text-slate-600 my-2">{task.description}</p>
          
          <div
            className={`w-fit px-2 py-0.5 mt-2 rounded-full text-xs font-medium border ${priorityColors[task.priority]}`}
          >
            {task.priority.toUpperCase()} PRIORITY
          </div>

          <div className="border-t my-3"></div>

          <div className="flex justify-between items-center text-sm text-slate-500">
             <div className="flex gap-4">
                <span className="flex items-center gap-1.5"><Calendar size={14}/> {task.dueDate}</span>
                <span className="flex items-center gap-1.5"><User size={14}/> {task.createdBy}</span>
            </div>
            <div className="flex gap-1">
                <button className="p-1 hover:text-amber-600 transition-colors" onClick={() => onEdit(colId, task.id)}><Pencil size={16}/></button>
                <button className="p-1 hover:text-red-600 transition-colors" onClick={() => onDelete(colId, task.id)}><Trash2 size={16}/></button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}