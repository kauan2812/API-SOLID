import type { CheckIn, Prisma } from "@/generated/prisma";

export interface CheckInsRepository {
	create: (data: Prisma.CheckInUncheckedCreateInput) => Promise<CheckIn>;
	findManyById(userId: string, page: number): Promise<CheckIn[]>;
	findByUserIdOnDate(userId: string, date: Date): Promise<CheckIn | null>;
	countByUserId(userId: string): Promise<number>;
}
