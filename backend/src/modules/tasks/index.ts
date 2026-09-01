import { prisma } from '@/platform/database/prisma'
import { TaskService } from './application/task-service'
import { PrismaTaskRepository } from './infrastructure/prisma-task-repository'
let service: TaskService | undefined
export function getTaskService() {
  service ??= new TaskService(new PrismaTaskRepository(prisma))
  return service
}
