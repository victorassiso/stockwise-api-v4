import { FastifyReply, FastifyRequest } from 'fastify'
import { z } from 'zod'

import { InvalidCredentialsError } from '@/use-cases/errors/invalid-credentials-error'
import { makeAuthenticateUserUseCase } from '@/use-cases/factories/make-authenticate-user-use-case'

export async function authenticateUserControler(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const authenticateUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
  })

  const { email, password } = authenticateUserSchema.parse(request.body)

  try {
    const authenticateUserUseCase = makeAuthenticateUserUseCase()

    const { user } = await authenticateUserUseCase.execute({ email, password })

    const token = await reply.jwtSign(
      {},
      {
        sign: {
          sub: user.id,
        },
      },
    )

    return reply.status(200).send({ token })
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }
}