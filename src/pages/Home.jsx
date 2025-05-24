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

function Home() {
  const { projects } = useSelector((state) => state.projects)
  const { tasks } = useSelector((state) => state.tasks)

  const stats = {
    totalProjects: projects.length,
    activeProjects: projects.filter(p => p.status === 'active').length,
    completedTasks: tasks.filter(t => t.status === 'completed').length,
    pendingTasks: tasks.filter(t => t.status === 'todo' || t.status === 'in-progress').length,
  }

  return (
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
            {projects.length === 0 ? (
              <div className="text-center py-8">
                <FolderOpen className="w-12 h-12 text-surface-400 dark:text-surface-600 mx-auto mb-4" />
                <p className="text-surface-600 dark:text-surface-400 mb-4">
                  No projects yet. Create your first project to get started!
                </p>
                <Link
                  to="/projects"
                  className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Project
                </Link>
              </div>
            ) : (
              projects.slice(0, 3).map((project) => (
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
              ))
            )}
          </div>
        </div>
      </div>
    </Layout>
  )
}

export default Home