import { describe, expect, it } from "bun:test";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./_erros/user-alredy-exists.error";
import { RegisterUseCase } from "./register.use-case";

describe("Register use case", () => {
	it("Should be able to register", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const { user } = await registerUseCase.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("Should hash user password upon registration", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const password = "123456";

		const { user } = await registerUseCase.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password,
		});

		const isPasswordCorrectlyHashed = await compare(
			password,
			user.password_hash,
		);

		expect(isPasswordCorrectlyHashed).toBe(true);
	});

	it("Should not be able to  register with same email twice", async () => {
		const usersRepository = new InMemoryUsersRepository();
		const registerUseCase = new RegisterUseCase(usersRepository);

		const email = "johndoe@example.com";

		await registerUseCase.execute({
			name: "John Doe",
			email,
			password: "123456",
		});

		expect(
			registerUseCase.execute({
				name: "John Doe",
				email,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
