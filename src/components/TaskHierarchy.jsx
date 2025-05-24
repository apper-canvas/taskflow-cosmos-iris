import { useState, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { useDrag, useDrop } from 'react-dnd'
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { addTask, updateTask, deleteTask, reorderTasks } from '../store/slices/tasksSlice'
import { toast } from 'react-toastify'

const TASK_TYPE = 'task'

const TaskItem = ({ task, subtasks, onAddSubtask, onEdit, onDelete, onToggleStatus, level = 0 }) => {
  const [isExpanded, setIsExpanded] = useState(true)
  
  const hasSubtasks = subtasks && subtasks.length > 0
  const indentClass = level > 0 ? `ml-${level * 6}` : ''
  
  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case 'in-progress':
        return <Clock className="w-4 h-4 text-blue-600" />
      default:
        return <AlertCircle className="w-4 h-4 text-orange-600" />
    }
  }
  
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'urgent':
        return 'border-l-red-500'
      case 'high':
        return 'border-l-orange-500'
      case 'medium':
        return 'border-l-blue-500'
      case 'low':
        return 'border-l-green-500'
      default:
        return 'border-l-surface-300'
    }
  }

  const ref = useRef(null)
  
  const [{ isDragging }, drag] = useDrag({
    type: TASK_TYPE,
    item: { id: task.id, type: TASK_TYPE },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  })

  const [{ isOver, canDrop }, drop] = useDrop({
    accept: TASK_TYPE,
    drop: (item) => {
      if (item.id !== task.id) {
        onReorder(item.id, task.id, 'before')
      }
    },
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  })

  drag(drop(ref))

  const getDropZoneClasses = () => {
    let classes = 'drop-zone'
    if (canDrop) classes += ' can-drop'
    if (isOver) classes += ' is-over'
    return classes
  }
  
  return (
    <div 
      ref={ref}
      className={`
        ${indentClass} 
        ${isDragging ? 'dragging' : ''} 
        ${getDropZoneClasses()}
        task-item-draggable
      `}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.2s ease',
      }}
    >
      <motion.div
        layout
        className={`
          bg-white dark:bg-surface-800 rounded-lg p-4 border-l-4 
          ${getPriorityColor(task.priority)} 
          shadow-sm hover:shadow-md transition-shadow
          ${isDragging ? 'drag-preview' : ''}
        `}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            {hasSubtasks && (
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="p-1 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors"
              >
                {isExpanded ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
            )}
            
            <div className="flex items-center gap-2">
              {getStatusIcon(task.status)}
            </div>
            
            <div className="flex-1">
              <h4 className={`font-medium ${
                task.status === 'completed' 
                  ? 'line-through text-surface-500' 
                  : 'text-surface-900 dark:text-surface-100'
              }`}>
                {task.title}
              </h4>
              {task.description && (
                <p className="text-sm text-surface-600 dark:text-surface-400 mt-1">
                  {task.description}
                </p>
              )}
              <div className="flex items-center gap-4 mt-2 text-xs text-surface-500 dark:text-surface-400">
                <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                <span>Assignee: {task.assignee}</span>
                <span className="capitalize">{task.priority} priority</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-1">
            <button
              onClick={() => onToggleStatus(task)}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors"
              title="Toggle status"
            >
              <CheckCircle className="w-4 h-4" />
            </button>
            <button
              onClick={() => onAddSubtask(task.id)}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors"
              title="Add subtask"
            >
              <Plus className="w-4 h-4" />
            </button>
            <button
              onClick={() => onEdit(task)}
              className="p-2 hover:bg-surface-100 dark:hover:bg-surface-700 rounded transition-colors"
              title="Edit task"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(task.id)}
              className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 text-red-600 rounded transition-colors"
              title="Delete task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </motion.div>
      
      <AnimatePresence>
        {hasSubtasks && isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-2 space-y-2"
          >
            {subtasks.map((subtask) => (
              <TaskItem
                key={subtask.id}
                task={subtask}
                subtasks={[]}
                onAddSubtask={onAddSubtask}
                onEdit={onEdit}
                onDelete={onDelete}
                onToggleStatus={onToggleStatus}
                onReorder={onReorder}
                onReorder={onReorder}
                level={level + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

const TaskHierarchy = ({ projectId, tasks }) => {
  const dispatch = useDispatch()
  
  // Organize tasks into hierarchy
  const taskMap = tasks.reduce((acc, task) => {
    acc[task.id] = task
    return acc
  }, {})
  
  const rootTasks = tasks.filter(task => !task.parentTaskId)
  
  const getSubtasks = (taskId) => {
    return tasks.filter(task => task.parentTaskId === taskId)
  }
  
  const handleAddSubtask = (parentTaskId) => {
    const newTask = {
      id: Date.now(),
      title: 'New Subtask',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      assignee: 'Unassigned',
      projectId,
      parentTaskId
    }
    dispatch(addTask(newTask))
    toast.success('Subtask created successfully')
  }
  
  const handleEditTask = (task) => {
    // For now, we'll show a simple prompt - in a real app this would open a modal
    const newTitle = prompt('Enter new task title:', task.title)
    if (newTitle && newTitle !== task.title) {
      dispatch(updateTask({ ...task, title: newTitle }))
      toast.success('Task updated successfully')
    }
  }
  
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task? This will also delete all subtasks.')) {
      dispatch(deleteTask(taskId))
      toast.success('Task deleted successfully')
    }
  }

  const handleReorderTasks = (draggedTaskId, targetTaskId, position) => {
    dispatch(reorderTasks({ draggedTaskId, targetTaskId, position }))
    toast.success('Tasks reordered successfully')
  }
  
  const handleToggleStatus = (task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    dispatch(updateTask({ ...task, status: newStatus }))
    toast.success(`Task marked as ${newStatus === 'completed' ? 'completed' : 'pending'}`)
  }

  const handleAddTask = () => {
    const newTask = {
      id: Date.now(),
      title: 'New Task',
      description: '',
      status: 'todo',
      priority: 'medium',
      dueDate: new Date().toISOString().split('T')[0],
      assignee: 'Unassigned',
      projectId
    }
    dispatch(addTask(newTask))
    toast.success('Task created successfully')
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
          Project Tasks
        </h3>
        <button 
          onClick={handleAddTask}
          className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>
      
      <div className="space-y-3">
        {rootTasks.length === 0 ? (
          <div className="text-center py-8 text-surface-600 dark:text-surface-400">
            No tasks found. Add your first task to get started.
          </div>
        ) : (
          rootTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              subtasks={getSubtasks(task.id)}
              onAddSubtask={handleAddSubtask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
              onReorder={handleReorderTasks}
            />
          ))
        )}
      </div>
    </div>
  )
}

export default TaskHierarchy