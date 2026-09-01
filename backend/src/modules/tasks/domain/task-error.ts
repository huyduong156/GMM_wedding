export type TaskErrorCode =
  | 'TASK_NOT_FOUND'
  | 'TASK_EVENT_NOT_FOUND'
  | 'TASK_TEMPLATE_NOT_FOUND'
  | 'TASK_REVISION_CONFLICT'
  | 'TASK_STATUS_INVALID'
  | 'TASK_REORDER_INVALID'
  | 'TASK_PARENT_INVALID'
export class TaskError extends Error {
  constructor(
    readonly code: TaskErrorCode,
    readonly status: number,
    message: string,
  ) {
    super(message)
    this.name = 'TaskError'
  }
}
