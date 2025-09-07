import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	setSystemTime,
} from "bun:test";
import { Decimal } from "@/generated/prisma/runtime/library";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins.repository";
import { InMemoryGymsRepository } from "@/repositories/in-memory/in-memory-gyms.repository";
import { MaxDistanceError } from "./_erros/max-distance.error";
import { MaxNumberOfCheckInsError } from "./_erros/max-number-of-check-ins.error";
import { CheckInUseCase } from "./check-in.use-case";

describe("CheckIn use case", () => {
	let checkInsRepository: InMemoryCheckInsRepository;
	let gymsRepository: InMemoryGymsRepository;
	let sut: CheckInUseCase;

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		gymsRepository = new InMemoryGymsRepository();
		sut = new CheckInUseCase(checkInsRepository, gymsRepository);

		await gymsRepository.create({
			id: "gym-01",
			title: "academia",
			description: "academia",
			phone: "",
			latitude: 0,
			longitude: 0,
		});
	});

	afterEach(() => {
		setSystemTime();
	});

	it("Should be able to check in", async () => {
		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		console.log(checkIn.created_at);

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("Should not be able to check in twice on the same day", async () => {
		setSystemTime(new Date("2025-1-10 10:00:00"));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(
			sut.execute({
				gymId: "gym-01",
				userId: "user-01",
				userLatitude: 0,
				userLongitude: 0,
			}),
		).rejects.toBeInstanceOf(MaxNumberOfCheckInsError);
	});

	it("Should not be able to check in twice but in different days", async () => {
		setSystemTime(new Date("2025-1-10 10:00:00"));

		await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		setSystemTime(new Date("2025-1-11 10:00:00"));

		const { checkIn } = await sut.execute({
			gymId: "gym-01",
			userId: "user-01",
			userLatitude: 0,
			userLongitude: 0,
		});

		expect(checkIn.id).toEqual(expect.any(String));
	});

	it("Should not be able to check in on on distant gym", async () => {
		gymsRepository.items.push({
			id: "gym-02",
			title: "academia",
			description: "academia",
			phone: "",
			latitude: new Decimal(-27.5901048),
			longitude: new Decimal(-48.5829061),
		});

		expect(
			sut.execute({
				gymId: "gym-01",
				userId: "user-01",
				userLatitude: -27.5780974,
				userLongitude: -48.4887233,
			}),
		).rejects.toBeInstanceOf(MaxDistanceError);
	});
});
