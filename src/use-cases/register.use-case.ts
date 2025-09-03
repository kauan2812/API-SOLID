import { hash } from "bcryptjs";
import type { UsersRepository } from "@/repositories/users.repository";
import { UserAlreadyExistsError } from "./_erros/user-alredy-exists.error";
import type { User } from "@/generated/prisma";

interface RegisterUserUseCaseRequest {
	name: string;
	email: string;
	password: string;
}

interface RegisterUserUseCaseResponse {
  user: User
}

export class RegisterUseCase {
	constructor(private usersRepository: UsersRepository) {}

	async execute({ name, email, password }: RegisterUserUseCaseRequest): Promise<RegisterUserUseCaseResponse> {
		const userWithSameEmail = await this.usersRepository.findByEmail(email);

		if (userWithSameEmail) {
			throw new UserAlreadyExistsError();
		}

		const password_hash = await hash(password, 6);

		const user = await this.usersRepository.create({
			name,
			email,
			password_hash,
		});

    return { user }
	}
}
