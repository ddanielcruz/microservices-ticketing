import { Ticket } from '../ticket'

describe('Ticket', () => {
  it('implements optimistic concurrency control', async () => {
    const ticket = Ticket.build({ title: 'any-title', userId: 'any-user', price: 10 })
    await ticket.save()

    const firstInstance = await Ticket.findById(ticket.id)
    const secondInstance = await Ticket.findById(ticket.id)

    firstInstance!.set({ price: 20 })
    secondInstance!.set({ price: 20 })

    await firstInstance!.save()
    await expect(secondInstance!.save()).rejects.toThrow()
  })

  it('increments the version number on multiple saves', async () => {
    const ticket = Ticket.build({ title: 'any-title', userId: 'any-user', price: 10 })
    await ticket.save()
    expect(ticket.version).toBe(0)
    await ticket.save()
    expect(ticket.version).toBe(1)
    await ticket.save()
    expect(ticket.version).toBe(2)
  })
})
