import {
	afterEach,
	beforeEach,
	describe,
	expect,
	it,
	setSystemTime,
} from "bun:test";
import { InMemoryCheckInsRepository } from "@/repositories/in-memory/in-memory-check-ins.repository";
import { LateCheckInValidationError } from "./_erros/late-check-in-validate.error";
import { ResourceNotFoundError } from "./_erros/resource-not-found.error";
import { ValidateCheckInUseCase } from "./validate-check-in.use-case";

describe("CheckIn use case", () => {
	let checkInsRepository: InMemoryCheckInsRepository;
	let sut: ValidateCheckInUseCase;

	beforeEach(async () => {
		checkInsRepository = new InMemoryCheckInsRepository();
		sut = new ValidateCheckInUseCase(checkInsRepository);
	});

	afterEach(() => {
		setSystemTime();
	});

	it("Should be able to check in", async () => {
		await checkInsRepository.create({
			id: "check-in-01",
			gym_id: "gym-01",
			user_id: "user-01",
			created_at: new Date(),
			validated_at: null,
		});

		const { checkIn } = await sut.execute({
			checkInId: "check-in-01",
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
		expect(checkInsRepository.items[0].validated_at).toEqual(expect.any(Date));
	});

	it("Should not be able to validate a inexistent check-in", async () => {
		expect(
			sut.execute({
				checkInId: "inexistent-check-in-01",
			}),
		).rejects.toBeInstanceOf(ResourceNotFoundError);
	});

	it("Should not be able to validate check-in before 20 minutes of its creation", async () => {
		setSystemTime(new Date("2025-1-10 10:00:00"));
		await checkInsRepository.create({
			id: "check-in-01",
			gym_id: "gym-01",
			user_id: "user-01",
		});

		setSystemTime(new Date("2025-1-10 10:19:00"));

		const { checkIn } = await sut.execute({
			checkInId: "check-in-01",
		});

		expect(checkIn.validated_at).toEqual(expect.any(Date));
	});

	it("Should not be able to validate check-in after 20 minutes of its creation", async () => {
		setSystemTime(new Date("2025-1-10 10:00:00"));
		await checkInsRepository.create({
			id: "check-in-01",
			gym_id: "gym-01",
			user_id: "user-01",
		});

		setSystemTime(new Date("2025-1-10 11:00:00"));
		expect(
			sut.execute({
				checkInId: "check-in-01",
			}),
		).rejects.toBeInstanceOf(LateCheckInValidationError);
	});
});
