import { PrismaUsersRepository } from "@/repositories/prisma/prisma-users.reporitory";
import { RegisterUseCase } from "../register.use-case";

export const MakeRegisterUseCase = () => {
	const usersRepository = new PrismaUsersRepository();
	const registerUseCase = new RegisterUseCase(usersRepository);

	return registerUseCase;
};
