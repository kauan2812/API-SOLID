import type { CheckIn } from "@/generated/prisma";
import type { CheckInsRepository } from "@/repositories/check-ins.repository";

interface FetchUserCheckInsHistoryUseCaseRequest {
	userId: string;
	page: number;
}

interface FetchUserCheckInsHistoryUseCaseResponse {
	checkIns: CheckIn[];
}

export class FetchUserCheckInsHistoryUseCase {
	constructor(private checkInsRepository: CheckInsRepository) {}

	async execute({
		userId,
		page,
	}: FetchUserCheckInsHistoryUseCaseRequest): Promise<FetchUserCheckInsHistoryUseCaseResponse> {
		const checkIns = await this.checkInsRepository.findManyById(userId, page);

		return {
			checkIns,
		};
	}
}
