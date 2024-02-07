import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { makeUpdateOrderStatusUseCase } from '@/use-cases/factories/make-update-order-status-use-case'

export async function cancelOrderController(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const createOrderParamsSchema = z.object({
    id: z.string(),
  })

  const { id } = createOrderParamsSchema.parse(request.params)

  const updateOrderStatusUseCase = makeUpdateOrderStatusUseCase()

  await updateOrderStatusUseCase.execute({
    id,
    status: 'canceled',
  })

  return reply.status(200).send()
}
