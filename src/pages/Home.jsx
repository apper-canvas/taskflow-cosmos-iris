import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { FolderOpen, CheckCircle, Clock, AlertCircle, Plus } from 'lucide-react'
import { motion } from 'framer-motion'
import Layout from '../components/Layout'

const StatCard = ({ title, value, icon: Icon, color, trend }) => (
  <motion.div
    whileHover={{ scale: 1.02 }}
    className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-soft border border-surface-200 dark:border-surface-700"
  >
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-surface-600 dark:text-surface-400">{title}</p>
        <p className="text-2xl font-bold text-surface-900 dark:text-surface-100">{value}</p>
        {trend && (
          <p className={`text-sm ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {trend > 0 ? '+' : ''}{trend}% from last week
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </motion.div>
)
import { motion } from 'framer-motion'
import MainFeature from '../components/MainFeature'
  const { projects } = useSelector((state) => state.projects)
  const { tasks } = useSelector((state) => state.tasks)

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length,
  }

import ApperIcon from '../components/ApperIcon'
    <Layout>
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-surface-900 dark:text-surface-100">
              Welcome back! 👋
            </h1>
            <p className="text-surface-600 dark:text-surface-400 mt-2">
              Here's what's happening with your projects today.
            </p>
          </div>
          <Link
            to="/projects"
            className="flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Projects"
            value={stats.totalProjects}
            icon={FolderOpen}
            color="bg-primary"
            trend={12}
          />
          <StatCard
            title="Active Projects"
            value={stats.activeProjects}
            icon={Clock}
            color="bg-blue-500"
            trend={8}
          />
          <StatCard
            title="Completed Tasks"
            value={stats.completedTasks}
            icon={CheckCircle}
            color="bg-green-500"
            trend={-3}
          />
          <StatCard
            title="Pending Tasks"
            value={stats.pendingTasks}
            icon={AlertCircle}
            color="bg-orange-500"
            trend={15}
          />
        </div>

        {/* Recent Projects */}
        <div className="bg-white dark:bg-surface-800 rounded-xl p-6 shadow-soft border border-surface-200 dark:border-surface-700">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-surface-900 dark:text-surface-100">
              Recent Projects
            </h2>
            <Link
              to="/projects"
              className="text-primary hover:text-primary-dark transition-colors"
            >
              View all
            </Link>
          </div>
          
          <div className="space-y-4">
            {projects.slice(0, 3).map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex items-center justify-between p-4 rounded-lg border border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-700 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: project.color }}
                  />
                  <div>
                    <h3 className="font-medium text-surface-900 dark:text-surface-100">
                      {project.title}
                    </h3>
                    <p className="text-sm text-surface-600 dark:text-surface-400">
                      {project.description}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium text-surface-900 dark:text-surface-100">
                    {project.progress}%
                  </div>
                  <div className="w-24 bg-surface-200 dark:bg-surface-600 rounded-full h-2 mt-1">
                    <div
                      className="h-2 rounded-full bg-primary"
                      style={{ width: `${project.progress}%` }}
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
  useEffect(() => {
    </Layout>
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/80 dark:bg-surface-900/80 border-b border-surface-200/50 dark:border-surface-700/50"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-primary to-secondary rounded-xl flex items-center justify-center shadow-soft">
                <ApperIcon name="CheckSquare" className="w-4 h-4 md:w-5 md:h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  TaskFlow
                </h1>
                <p className="text-xs text-surface-500 dark:text-surface-400 hidden sm:block">
                  Efficient Task Management
                </p>
              </div>
            </motion.div>

            {/* Time Display */}
            <div className="hidden md:flex flex-col items-center text-center">
              <div className="text-2xl font-mono font-semibold text-surface-700 dark:text-surface-300">
                {formatTime(currentTime)}
              </div>
              <div className="text-sm text-surface-500 dark:text-surface-400">
                {formatDate(currentTime)}
              </div>
            </div>

            {/* Dark Mode Toggle */}
            <motion.button
              onClick={() => setDarkMode(!darkMode)}
              className="relative w-12 h-6 md:w-14 md:h-7 bg-surface-200 dark:bg-surface-700 rounded-full flex items-center transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50"
              whileTap={{ scale: 0.95 }}
            >
              <motion.div
                className="w-5 h-5 md:w-6 md:h-6 bg-white dark:bg-surface-800 rounded-full shadow-md flex items-center justify-center"
                animate={{
                  x: darkMode ? '1.5rem' : '0rem'
                }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              >
                {darkMode ? (
                  <ApperIcon name="Moon" className="w-3 h-3 md:w-4 md:h-4 text-primary" />
                ) : (
                  <ApperIcon name="Sun" className="w-3 h-3 md:w-4 md:h-4 text-yellow-500" />
                )}
              </motion.div>
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        {/* Welcome Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 md:mb-12"
        >
          <div className="text-center mb-6 md:mb-8">
            <h2 className="text-2xl md:text-4xl lg:text-5xl font-bold mb-3 md:mb-4">
              <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                Organize Your Day
              </span>
            </h2>
            <p className="text-base md:text-lg text-surface-600 dark:text-surface-300 max-w-2xl mx-auto leading-relaxed">
              Transform your productivity with TaskFlow's intuitive task management system. 
              Create, organize, and complete your tasks with style.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {[
              { label: "Tasks Today", value: "0", icon: "Calendar", color: "text-blue-500" },
              { label: "Completed", value: "0", icon: "CheckCircle", color: "text-green-500" },
              { label: "In Progress", value: "0", icon: "Clock", color: "text-yellow-500" },
              { label: "Priority", value: "0", icon: "AlertCircle", color: "text-red-500" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
                className="bg-white/60 dark:bg-surface-800/60 backdrop-blur-sm rounded-2xl p-4 md:p-6 shadow-soft border border-surface-200/50 dark:border-surface-700/50"
              >
                <div className="flex items-center justify-between mb-2">
                  <ApperIcon name={stat.icon} className={`w-5 h-5 md:w-6 md:h-6 ${stat.color}`} />
                  <div className="text-xl md:text-2xl font-bold text-surface-800 dark:text-surface-200">
                    {stat.value}
                  </div>
                </div>
                <div className="text-sm md:text-base text-surface-600 dark:text-surface-400">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Main Feature Component */}
        <MainFeature />

        {/* Footer */}
        <motion.footer 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 md:mt-16 text-center"
        >
          <div className="bg-white/40 dark:bg-surface-800/40 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-soft border border-surface-200/50 dark:border-surface-700/50">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
              <div className="flex items-center space-x-2">
                <ApperIcon name="Heart" className="w-4 h-4 text-red-500" />
                <span className="text-sm text-surface-600 dark:text-surface-400">
                  Made with passion for productivity
                </span>
              </div>
              <div className="hidden sm:block w-1 h-1 bg-surface-400 rounded-full"></div>
              <div className="flex items-center space-x-2">
                <ApperIcon name="Zap" className="w-4 h-4 text-yellow-500" />
                <span className="text-sm text-surface-600 dark:text-surface-400">
                  TaskFlow © 2024
                </span>
              </div>
            </div>
          </div>
        </motion.footer>
      </main>
    </div>
  )
}

export default Home