import { beforeEach, describe, expect, it } from "bun:test";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { SearchGymsUseCase } from "./search-gyms.use-case";

describe("Search gyms use case", () => {
	let gymsRepository: InMemoryGymsRepository;
	let sut: SearchGymsUseCase;

	beforeEach(async () => {
		gymsRepository = new InMemoryGymsRepository();
		sut = new SearchGymsUseCase(gymsRepository);
	});

	it("Should be able to search gyms", async () => {
		await gymsRepository.create({
			title: "Gym 01",
			description: "Gym 01 description",
			phone: "1234567890",
			latitude: -23.55052,
			longitude: -46.633309,
		});

		await gymsRepository.create({
			title: "Gym 02",
			description: "Gym 02 description",
			phone: "1234567890",
			latitude: -23.55052,
			longitude: -46.633309,
		});

		const { gyms } = await sut.execute({
			query: "Gym 01",
			page: 1,
		});

		expect(gyms.length).toEqual(1);
		expect(gyms).toEqual([expect.objectContaining({ title: "Gym 01" })]);
	});

	it("Should be search paginated gyms", async () => {
		for (let i = 1; i <= 22; i++) {
			await gymsRepository.create({
				title: `Gym ${i}`,
				description: `Gym ${i} description`,
				phone: "1234567890",
				latitude: -23.55052,
				longitude: -46.633309,
			});
		}

		const { gyms } = await sut.execute({
			query: "Gym",
			page: 2,
		});

		expect(gyms.length).toEqual(2);
		expect(gyms).toEqual([
			expect.objectContaining({ title: "Gym 21" }),
			expect.objectContaining({ title: "Gym 22" }),
		]);
	});
});
