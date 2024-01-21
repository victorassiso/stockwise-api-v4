import { Customer } from '@prisma/client'

import { CustomersRepository } from '@/repositories/customers-repository'
import { WorkspacesRepository } from '@/repositories/workspaces-repository'

import { EmailAlreadyExistsError } from './errors/email-already-exists-error'
import { PhoneAlreadyExistsError } from './errors/phone-already-exists-error'
import { ResourceNotFoundError } from './errors/resource-not-found-error'

interface CreateCustomerUseCaseRequest {
  name: string
  workspace_id: string
  phone: string
  email: string
  address: string
}

interface CreateCustomerUseCaseReply {
  customer: Customer
}

export class CreateCustomerUseCase {
  constructor(
    private customersRepository: CustomersRepository,
    private workspacesRepository: WorkspacesRepository,
  ) {}

  async execute({
    name,
    workspace_id,
    phone,
    email,
    address,
  }: CreateCustomerUseCaseRequest): Promise<CreateCustomerUseCaseReply> {
    // Validate Workspace
    const workspace = await this.workspacesRepository.findById(workspace_id)

    if (!workspace) {
      throw new ResourceNotFoundError()
    }

    // Validate Phone
    const samePhone = await this.customersRepository.findByPhone({
      phone,
      workspace_id,
    })

    if (samePhone) {
      throw new PhoneAlreadyExistsError()
    }

    // Validate Email
    const sameEmail = await this.customersRepository.findByEmail({
      email,
      workspace_id,
    })

    if (sameEmail) {
      throw new EmailAlreadyExistsError()
    }

    // Create Customer
    const customer = await this.customersRepository.create({
      name,
      workspace_id,
      phone,
      email,
      address,
    })

    return { customer }
  }
}
