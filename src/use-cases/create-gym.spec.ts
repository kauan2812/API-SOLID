import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { CreateGymUseCase } from "./create-gym.use-case";

describe("Create gym use case", () => {
	let gymsRepository: InMemoryGymsRepository;
	let sut: CreateGymUseCase;

	beforeEach(() => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new CreateGymUseCase(gymsRepository);
	});

	it("Should be able to create a gym", async () => {
		const { gym } = await sut.execute({
			title: "My new Gym",
			latitude: -27.5901048,
			longitude: -48.5829061,
		});

		expect(gym.id).toEqual(expect.any(String));
	});
});
