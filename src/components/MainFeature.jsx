import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { format, isToday, isTomorrow, isThisWeek, parseISO } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([])
  const [showTaskForm, setShowTaskForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    category: ''
  })

  const priorityColors = {
    urgent: { bg: 'priority-urgent', text: 'text-red-700', icon: 'AlertTriangle' },
    high: { bg: 'priority-high', text: 'text-orange-700', icon: 'ArrowUp' },
    medium: { bg: 'priority-medium', text: 'text-blue-700', icon: 'Minus' },
    low: { bg: 'priority-low', text: 'text-green-700', icon: 'ArrowDown' }
  }

  const categories = [
    { id: 'work', name: 'Work', color: 'bg-blue-500', icon: 'Briefcase' },
    { id: 'personal', name: 'Personal', color: 'bg-green-500', icon: 'User' },
    { id: 'health', name: 'Health', color: 'bg-red-500', icon: 'Heart' },
    { id: 'learning', name: 'Learning', color: 'bg-purple-500', icon: 'BookOpen' },
    { id: 'shopping', name: 'Shopping', color: 'bg-yellow-500', icon: 'ShoppingCart' }
  ]

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskflow-tasks')
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks))
    }
  }, [])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!taskForm.title.trim()) {
      toast.error("Task title is required!")
      return
    }

    const newTask = {
      id: editingTask ? editingTask.id : Date.now().toString(),
      ...taskForm,
      status: editingTask ? editingTask.status : 'pending',
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    if (editingTask) {
      setTasks(tasks.map(task => task.id === editingTask.id ? newTask : task))
      toast.success("Task updated successfully!")
      setEditingTask(null)
    } else {
      setTasks([...tasks, newTask])
      toast.success("Task created successfully!")
    }

    setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', category: '' })
    setShowTaskForm(false)
  }

  const toggleTaskStatus = (id) => {
    setTasks(tasks.map(task => {
      if (task.id === id) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        toast.success(newStatus === 'completed' ? "Task completed! 🎉" : "Task marked as pending")
        return { ...task, status: newStatus, updatedAt: new Date().toISOString() }
      }
      return task
    }))
  }

  const deleteTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id))
    toast.success("Task deleted successfully!")
  }

  const editTask = (task) => {
    setTaskForm({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      dueDate: task.dueDate || '',
      category: task.category || ''
    })
    setEditingTask(task)
    setShowTaskForm(true)
  }

  const getFilteredTasks = () => {
    let filtered = tasks

    if (filter !== 'all') {
      filtered = filtered.filter(task => task.status === filter)
    }

    if (searchQuery) {
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    return filtered.sort((a, b) => {
      const priorityOrder = { urgent: 0, high: 1, medium: 2, low: 3 }
      return priorityOrder[a.priority] - priorityOrder[b.priority]
    })
  }

  const formatDueDate = (dateString) => {
    if (!dateString) return null
    const date = parseISO(dateString)
    
    if (isToday(date)) return 'Today'
    if (isTomorrow(date)) return 'Tomorrow'
    if (isThisWeek(date)) return format(date, 'EEEE')
    return format(date, 'MMM dd')
  }

  const getTaskStats = () => {
    const total = tasks.length
    const completed = tasks.filter(t => t.status === 'completed').length
    const pending = tasks.filter(t => t.status === 'pending').length
    const urgent = tasks.filter(t => t.priority === 'urgent' && t.status !== 'completed').length
    
    return { total, completed, pending, urgent }
  }

  const stats = getTaskStats()
  const filteredTasks = getFilteredTasks()

  return (
    <div className="w-full max-w-6xl mx-auto">
      {/* Header Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-soft border border-surface-200/50 dark:border-surface-700/50 mb-6 md:mb-8"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0">
          <div>
            <h3 className="text-2xl md:text-3xl font-bold mb-2 text-surface-800 dark:text-surface-200">
              Task Dashboard
            </h3>
            <div className="flex flex-wrap items-center gap-4 text-sm text-surface-600 dark:text-surface-400">
              <div className="flex items-center space-x-1">
                <ApperIcon name="Target" className="w-4 h-4" />
                <span>{stats.total} Total</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="CheckCircle" className="w-4 h-4 text-green-500" />
                <span>{stats.completed} Completed</span>
              </div>
              <div className="flex items-center space-x-1">
                <ApperIcon name="Clock" className="w-4 h-4 text-yellow-500" />
                <span>{stats.pending} Pending</span>
              </div>
              {stats.urgent > 0 && (
                <div className="flex items-center space-x-1">
                  <ApperIcon name="AlertTriangle" className="w-4 h-4 text-red-500" />
                  <span>{stats.urgent} Urgent</span>
                </div>
              )}
            </div>
          </div>

          <motion.button
            onClick={() => {
              setShowTaskForm(true)
              setEditingTask(null)
              setTaskForm({ title: '', description: '', priority: 'medium', dueDate: '', category: '' })
            }}
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary/50"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ApperIcon name="Plus" className="w-5 h-5" />
            <span className="hidden sm:inline">Add New Task</span>
            <span className="sm:hidden">Add Task</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Search and Filter Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-3xl p-4 md:p-6 shadow-soft border border-surface-200/50 dark:border-surface-700/50 mb-6"
      >
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-400" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-2xl border-0 bg-surface-100 dark:bg-surface-700 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
            />
          </div>

          {/* Filter */}
          <div className="flex space-x-2">
            {[
              { value: 'all', label: 'All', icon: 'List' },
              { value: 'pending', label: 'Pending', icon: 'Clock' },
              { value: 'completed', label: 'Done', icon: 'CheckCircle' }
            ].map((filterOption) => (
              <motion.button
                key={filterOption.value}
                onClick={() => setFilter(filterOption.value)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                  filter === filterOption.value
                    ? 'bg-primary text-white shadow-md'
                    : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <ApperIcon name={filterOption.icon} className="w-4 h-4" />
                <span className="hidden sm:inline text-sm font-medium">{filterOption.label}</span>
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={() => setShowTaskForm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white dark:bg-surface-800 rounded-3xl p-6 md:p-8 w-full max-w-lg shadow-2xl border border-surface-200 dark:border-surface-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-surface-800 dark:text-surface-200">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                <button
                  onClick={() => setShowTaskForm(false)}
                  className="p-2 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
                >
                  <ApperIcon name="X" className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                    Task Title *
                  </label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-0 bg-surface-100 dark:bg-surface-700 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    placeholder="Enter task title..."
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                    Description
                  </label>
                  <textarea
                    value={taskForm.description}
                    onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                    className="w-full px-4 py-3 rounded-2xl border-0 bg-surface-100 dark:bg-surface-700 focus:ring-2 focus:ring-primary/20 transition-all duration-300 h-24 resize-none"
                    placeholder="Add task description..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Priority */}
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                      Priority
                    </label>
                    <select
                      value={taskForm.priority}
                      onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border-0 bg-surface-100 dark:bg-surface-700 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  {/* Due Date */}
                  <div>
                    <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={taskForm.dueDate}
                      onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl border-0 bg-surface-100 dark:bg-surface-700 focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                    />
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="block text-sm font-semibold text-surface-700 dark:text-surface-300 mb-2">
                    Category
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setTaskForm({ ...taskForm, category: category.id })}
                        className={`flex items-center space-x-2 p-3 rounded-xl transition-all duration-300 ${
                          taskForm.category === category.id
                            ? `${category.color} text-white shadow-md`
                            : 'bg-surface-100 dark:bg-surface-700 text-surface-600 dark:text-surface-300 hover:bg-surface-200 dark:hover:bg-surface-600'
                        }`}
                      >
                        <ApperIcon name={category.icon} className="w-4 h-4" />
                        <span className="text-sm font-medium">{category.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowTaskForm(false)}
                    className="flex-1 px-6 py-3 rounded-2xl border border-surface-300 dark:border-surface-600 text-surface-700 dark:text-surface-300 font-semibold hover:bg-surface-100 dark:hover:bg-surface-700 transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-primary/50"
                  >
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tasks List */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="space-y-3"
      >
        <AnimatePresence>
          {filteredTasks.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-surface-200 to-surface-300 dark:from-surface-700 dark:to-surface-600 rounded-full flex items-center justify-center">
                <ApperIcon name="Inbox" className="w-10 h-10 text-surface-400" />
              </div>
              <h4 className="text-xl font-semibold text-surface-600 dark:text-surface-400 mb-2">
                {tasks.length === 0 ? "No tasks yet" : "No tasks found"}
              </h4>
              <p className="text-surface-500 dark:text-surface-500">
                {tasks.length === 0 
                  ? "Create your first task to get started!" 
                  : "Try adjusting your search or filter criteria"
                }
              </p>
            </motion.div>
          ) : (
            filteredTasks.map((task, index) => {
              const priority = priorityColors[task.priority]
              const category = categories.find(c => c.id === task.category)
              
              return (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.05 }}
                  className={`group ${priority.bg} rounded-2xl p-4 md:p-6 shadow-soft border border-surface-200/50 dark:border-surface-700/50 hover:shadow-lg transition-all duration-300`}
                >
                  <div className="flex items-start space-x-4">
                    {/* Checkbox */}
                    <motion.button
                      onClick={() => toggleTaskStatus(task.id)}
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-300 ${
                        task.status === 'completed'
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-surface-300 dark:border-surface-600 hover:border-green-500'
                      }`}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      {task.status === 'completed' && (
                        <ApperIcon name="Check" className="w-4 h-4" />
                      )}
                    </motion.button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between space-y-2 sm:space-y-0">
                        <div className="flex-1">
                          <h5 className={`text-lg font-semibold ${task.status === 'completed' ? 'line-through text-surface-500' : 'text-surface-800 dark:text-surface-200'}`}>
                            {task.title}
                          </h5>
                          {task.description && (
                            <p className={`text-sm mt-1 ${task.status === 'completed' ? 'line-through text-surface-400' : 'text-surface-600 dark:text-surface-400'}`}>
                              {task.description}
                            </p>
                          )}
                          
                          <div className="flex flex-wrap items-center gap-3 mt-3">
                            {/* Priority */}
                            <div className={`flex items-center space-x-1 ${priority.text}`}>
                              <ApperIcon name={priority.icon} className="w-4 h-4" />
                              <span className="text-xs font-medium capitalize">{task.priority}</span>
                            </div>

                            {/* Category */}
                            {category && (
                              <div className="flex items-center space-x-1">
                                <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                                <span className="text-xs font-medium text-surface-600 dark:text-surface-400">
                                  {category.name}
                                </span>
                              </div>
                            )}

                            {/* Due Date */}
                            {task.dueDate && (
                              <div className="flex items-center space-x-1 text-surface-600 dark:text-surface-400">
                                <ApperIcon name="Calendar" className="w-4 h-4" />
                                <span className="text-xs font-medium">
                                  {formatDueDate(task.dueDate)}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <motion.button
                            onClick={() => editTask(task)}
                            className="p-2 rounded-xl bg-white/80 dark:bg-surface-700/80 hover:bg-white dark:hover:bg-surface-700 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ApperIcon name="Edit2" className="w-4 h-4 text-blue-600" />
                          </motion.button>
                          <motion.button
                            onClick={() => deleteTask(task.id)}
                            className="p-2 rounded-xl bg-white/80 dark:bg-surface-700/80 hover:bg-white dark:hover:bg-surface-700 transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <ApperIcon name="Trash2" className="w-4 h-4 text-red-600" />
                          </motion.button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default MainFeature