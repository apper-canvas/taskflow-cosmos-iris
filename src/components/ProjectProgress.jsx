import { useEffect, useRef } from 'react'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'
import { Doughnut, Bar } from 'react-chartjs-2'

ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement)

const ProjectProgress = ({ project, tasks }) => {
  const taskStatusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1
    return acc
  }, {})

  const taskPriorityCounts = tasks.reduce((acc, task) => {
    acc[task.priority] = (acc[task.priority] || 0) + 1
    return acc
  }, {})

  const statusData = {
    labels: ['Completed', 'In Progress', 'To Do'],
    datasets: [
      {
        data: [
          taskStatusCounts.completed || 0,
          taskStatusCounts['in-progress'] || 0,
          taskStatusCounts.todo || 0,
        ],
        backgroundColor: [
          '#22c55e',
          '#3b82f6',
          '#ef4444',
        ],
        borderWidth: 0,
      },
    ],
  }

  const priorityData = {
    labels: ['Urgent', 'High', 'Medium', 'Low'],
    datasets: [
      {
        label: 'Tasks by Priority',
        data: [
          taskPriorityCounts.urgent || 0,
          taskPriorityCounts.high || 0,
          taskPriorityCounts.medium || 0,
          taskPriorityCounts.low || 0,
        ],
        backgroundColor: [
          '#ef4444',
          '#f59e0b',
          '#3b82f6',
          '#22c55e',
        ],
      },
    ],
  }

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Task Status Chart */}
        <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Task Status Distribution
          </h3>
          <div className="h-64">
            <Doughnut data={statusData} options={chartOptions} />
          </div>
        </div>

        {/* Priority Distribution Chart */}
        <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100 mb-4">
            Priority Distribution
          </h3>
          <div className="h-64">
            <Bar data={priorityData} options={chartOptions} />
          </div>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="bg-surface-50 dark:bg-surface-700 rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-surface-900 dark:text-surface-100">
            Overall Project Progress
          </h3>
          <span className="text-2xl font-bold text-primary">
            {project.progress}%
          </span>
        </div>
        <div className="w-full bg-surface-200 dark:bg-surface-600 rounded-full h-4">
          <div
            className="h-4 rounded-full bg-gradient-to-r from-primary to-primary-light transition-all duration-1000"
            style={{ width: `${project.progress}%` }}
          />
        </div>
        <div className="flex justify-between text-sm text-surface-600 dark:text-surface-400 mt-2">
          <span>Start: {new Date(project.startDate).toLocaleDateString()}</span>
          <span>End: {new Date(project.endDate).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  )
}

export default ProjectProgress