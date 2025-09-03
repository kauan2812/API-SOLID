import { beforeEach, describe, expect, it } from "bun:test";
import { hash } from "bcryptjs";
import { InMemoryUsersRepository } from "@/repositories/in-memory/in-memory-users-repository";
import { ResourceNotFoundError } from "./_erros/resource-not-found.error";
import { GetUserProfileUseCase } from "./get-user-profile.use-case";

describe("Get user profile use case", () => {
	let userRepository: InMemoryUsersRepository;
	let sut: GetUserProfileUseCase;

	beforeEach(() => {
		userRepository = new InMemoryUsersRepository();
		sut = new GetUserProfileUseCase(userRepository);
	});

	it("Shoud be able to get user profile", async () => {
		const createdUser = await userRepository.create({
			name: "John Doe",
			email: "johndoe@example.com",
			password_hash: await hash("123456", 1),
		});

		const { user } = await sut.execute({
			userId: createdUser.id,
		});

		expect(user.name).toEqual("John Doe");
	});

	it("Shoud not be able to get user profile with wrong id", async () => {
		expect(
			sut.execute({
				userId: "non-existing-id",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});
});
