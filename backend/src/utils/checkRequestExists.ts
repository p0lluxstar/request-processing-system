import { prisma } from '../../prisma/client';

export const checkRequestExists = async (id: number): Promise<void> => {
  const request = await prisma.request.findUnique({
    where: { id },
  });

  if (!request) throw new Error(`Обращение с id ${id} не найдено`);
};
