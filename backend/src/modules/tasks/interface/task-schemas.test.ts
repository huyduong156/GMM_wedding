import { describe, expect, it } from 'vitest'
import { applyTemplateSchema, bulkCreateTaskSchema, createTaskSchema, taskQuerySchema, updateTaskSchema } from './task-schemas'

describe('task schemas', () => {
  it('accepts an event-linked child task', () => {
    const result = createTaskSchema.parse({ title: 'Đặt hoa', eventId: '11111111-1111-4111-8111-111111111111', parentTaskId: '22222222-2222-4222-8222-222222222222' })
    expect(result.priority).toBe('MEDIUM')
    expect(result.parentTaskId).toBeTruthy()
  })
  it('validates task filters and revision updates', () => {
    expect(taskQuerySchema.parse({ withoutEvent: 'true', withoutParent: 'true' }).limit).toBe(50)
    expect(updateTaskSchema.parse({ status: 'DONE', parentTaskId: null, revision: 1 }).status).toBe('DONE')
  })
  it('accepts a root-task bulk payload and rejects parentTaskId', () => {
    expect(bulkCreateTaskSchema.parse({ tasks: [{ title: 'Đặt hoa', priority: 'MEDIUM' }] }).tasks).toHaveLength(1)
    expect(() => bulkCreateTaskSchema.parse({ tasks: [{ title: 'Task con', parentTaskId: '11111111-1111-4111-8111-111111111111' }] })).toThrow()
  })
  it('accepts applying a template to an event', () => {
    expect(applyTemplateSchema.parse({ templateKey: 'wedding-prep', templateVersion: 1, eventId: '11111111-1111-4111-8111-111111111111' }).templateVersion).toBe(1)
  })
})
