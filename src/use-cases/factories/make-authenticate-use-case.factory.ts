import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users.reporitory";
import { AuthenticateUseCase } from "../authenticate.use-case";

export const MakeAuthenticateUseCase = () => {
	const usersRepository = new PrismaUsersRepository();
	const authenticateUseCase = new AuthenticateUseCase(usersRepository);

	return authenticateUseCase;
};
