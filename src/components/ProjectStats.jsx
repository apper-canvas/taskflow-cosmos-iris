import { CheckCircle, Clock, AlertCircle, Users, Calendar, Target } from 'lucide-react'
import { motion } from 'framer-motion'

const ProjectStats = ({ project, tasks }) => {
  const completedTasks = tasks.filter(task => task.status === 'completed').length
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length
  const todoTasks = tasks.filter(task => task.status === 'todo').length
  const totalTasks = tasks.length

  const urgentTasks = tasks.filter(task => task.priority === 'urgent').length
  const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date() && task.status !== 'completed').length

  const stats = [
    {
      title: 'Total Tasks',
      value: totalTasks,
      icon: Target,
      color: 'bg-blue-500',
      description: 'All tasks in project'
    },
    {
      title: 'Completed',
      value: completedTasks,
      icon: CheckCircle,
      color: 'bg-green-500',
      description: `${totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0}% completion rate`
    },
    {
      title: 'In Progress',
      value: inProgressTasks,
      icon: Clock,
      color: 'bg-blue-500',
      description: 'Currently active tasks'
    },
    {
      title: 'To Do',
      value: todoTasks,
      icon: AlertCircle,
      color: 'bg-orange-500',
      description: 'Pending tasks'
    },
    {
      title: 'Urgent Tasks',
      value: urgentTasks,
      icon: AlertCircle,
      color: 'bg-red-500',
      description: 'High priority items'
    },
    {
      title: 'Team Members',
      value: project.teamMembers.length,
      icon: Users,
      color: 'bg-purple-500',
      description: 'Active contributors'
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {stats.map((stat, index) => {
        const Icon = stat.icon
        return (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-surface-900 dark:text-surface-100">
                  {stat.value}
                </div>
              </div>
            </div>
            <h3 className="font-semibold text-surface-900 dark:text-surface-100 mb-1">
              {stat.title}
            </h3>
            <p className="text-sm text-surface-600 dark:text-surface-400">
              {stat.description}
            </p>
          </motion.div>
        )
      })}
    </div>
  )
}

export default ProjectStats