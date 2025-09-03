import { beforeEach, describe, expect, it } from "bun:test";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { InvalidCredentialsError } from "./_erros/invalid-credentials.error";
import { AuthenticateUseCase } from "./authenticate.use-case";

describe("Authenticate use case", () => {
	let userRepository: InMemoryUsersRepository;
	let sut: AuthenticateUseCase;

	beforeEach(() => {
		userRepository = new InMemoryUsersRepository();
		sut = new AuthenticateUseCase(userRepository);
	});

	it("Shoud be able to authenticate", async () => {
		await userRepository.create({
			name: "John Doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 1),
		});

		const { user } = await sut.execute({
			email: "johndoe@example.com",
			password: "123456",
		});

		expect(user.id).toEqual(expect.any(String));
	});

	it("Shoud not be able to authenticate with wrong email", async () => {
		expect(
			sut.execute({
				email: "johndoe@example.com",
				password: "123456",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});

	it("Shoud not be able to authenticate with wrong password", async () => {
		await userRepository.create({
			name: "John Doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 1),
		});

		expect(
			sut.execute({
				email: "johndoe@example.com",
				password: "1234567",
			}),
		).rejects.toBeInstanceOf(InvalidCredentialsError);
	});
});
