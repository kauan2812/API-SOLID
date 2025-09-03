import { beforeEach, describe, expect, it } from "bun:test";
import { compare } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { UserAlreadyExistsError } from "./_erros/user-alredy-exists.error";
import { RegisterUseCase } from "./register.use-case";

describe("Register use case", () => {
	let usersRepository: InMemoryUsersRepository;
	let sut: RegisterUseCase;

	beforeEach(() => {
		usersRepository = new InMemoryUsersRepository();
		sut = new RegisterUseCase(usersRepository);
	});

	it("Should be able to register", async () => {
		const { user } = await sut.execute({
			name: "John Doe",
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("Should hash user password upon registration", async () => {
		const password = "123456";

		const { user } = await sut.execute({
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
		const email = "johndoe@example.com";

		await sut.execute({
			name: "John Doe",
			email,
			password: "123456",
		});

		expect(
			sut.execute({
				name: "John Doe",
				email,
				password: "123456",
			}),
		).rejects.toBeInstanceOf(UserAlreadyExistsError);
	});
});
