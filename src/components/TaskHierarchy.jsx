import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { ChevronDown, ChevronRight, Plus, Edit, Trash2, CheckCircle, Clock, AlertCircle } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { addTask, updateTask, deleteTask } from '../store/slices/tasksSlice'

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
  
  return (
    <div className={indentClass}>
      <motion.div
        layout
        className={`bg-white dark:bg-surface-800 rounded-lg p-4 border-l-4 ${getPriorityColor(task.priority)} shadow-sm hover:shadow-md transition-shadow`}
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
    // This would open a task creation form with parentTaskId set
    console.log('Add subtask to:', parentTaskId)
  }
  
  const handleEditTask = (task) => {
    // This would open an edit form
    console.log('Edit task:', task)
  }
  
  const handleDeleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      dispatch(deleteTask(taskId))
    }
  }
  const handleReorderTasks = (draggedTaskId, targetTaskId, position) => {
    dispatch(reorderTasks({ draggedTaskId, targetTaskId, position }))
  }

  
  const handleToggleStatus = (task) => {
    const newStatus = task.status === 'completed' ? 'todo' : 'completed'
    dispatch(updateTask({ ...task, status: newStatus }))
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
          Project Tasks
        </h3>
        <button className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors">
          <Plus className="w-4 h-4 mr-2" />
          Add Task
        </button>
      </div>
      
      {rootTasks.length === 0 ? (
        <div className="text-center py-8 text-surface-600 dark:text-surface-400">
          No tasks found. Add your first task to get started.
        </div>
              onReorder={handleReorderTasks}
      ) : (
        <div className="space-y-3">
          {rootTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              subtasks={getSubtasks(task.id)}
              onAddSubtask={handleAddSubtask}
              onEdit={handleEditTask}
              onDelete={handleDeleteTask}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export default TaskHierarchy