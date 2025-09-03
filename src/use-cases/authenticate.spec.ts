import { InMemoryUsersRepository } from '@/repositories/in-memory/in-memory-users-repository'
import { describe, expect, expectTypeOf, it } from 'bun:test'
import { AuthenticateUseCase } from './authenticate.use-case'
import { hash } from 'bcryptjs'
import { InvalidCredentialsError } from './_erros/invalid-credentials.error'

describe('Authenticate use case', () => {
  it('Shoud be able to authenticate', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 1),
    })

    const { user } = await sut.execute({
      email: 'johndoe@example.com',
      password: '123456'
    })

    expect(user.id).toEqual(expect.any(String));
  })

  it('Shoud not be able to authenticate with wrong email', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(userRepository)

    expect(sut.execute({
        email: 'johndoe@example.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })

  it('Shoud not be able to authenticate with wrong password', async () => {
    const userRepository = new InMemoryUsersRepository()
    const sut = new AuthenticateUseCase(userRepository)

    await userRepository.create({
      name: 'John Doe',
      email: 'johndoe@example.com',
      password_hash: await hash('123456', 1),
    })

    expect(sut.execute({
        email: 'johndoe@example.com',
        password: '1234567'
      })
    ).rejects.toBeInstanceOf(InvalidCredentialsError)
  })
})