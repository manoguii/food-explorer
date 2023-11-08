import { DataTable } from './components/data-table'
import { promises as fs } from 'fs'
import path from 'path'
import { z } from 'zod'
import { columns } from './components/columns'
import { taskSchema } from './data/schema'

async function getTasks() {
  const data = await fs.readFile(
    path.join(process.cwd(), 'src/app/dashboard/orders/data/tasks.json'),
  )

  const tasks = JSON.parse(data.toString())

  return z.array(taskSchema).parse(tasks)
}

export default async function Orders() {
  const tasks = await getTasks()

  return (
    <div className="space-y-5">
      <h1 className="text-2xl font-semibold">Pedidos</h1>

      <DataTable data={tasks} columns={columns} />
    </div>
  )
}
