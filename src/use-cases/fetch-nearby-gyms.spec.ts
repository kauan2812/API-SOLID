import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { FetchNearbyGymsUseCase } from "./fetch-nearby-gyms.use-case";

describe("Fetch nearby gyms use case", () => {
	let gymsRepository: InMemoryGymsRepository;
	let sut: FetchNearbyGymsUseCase;

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new FetchNearbyGymsUseCase(gymsRepository);
	});

	it("Should be able to fetch nearby gyms", async () => {
		await gymsRepository.create({
			title: "Near gym",
			description: "Gym 01 description",
			phone: "1234567890",
			latitude: -23.55052,
			longitude: -46.633309,
		});

		await gymsRepository.create({
			title: "Far Gym",
			description: "Gym 02 description",
			phone: "1234567890",
			latitude: -27.5780974,
			longitude: -48.4887233,
		});

		const { gyms } = await sut.execute({
			userLatitude: -23.55052,
			userLongitude: -46.633309,
		});

		expect(gyms.length).toEqual(1);
		expect(gyms).toEqual([expect.objectContaining({ title: "Near gym" })]);
	});
});
