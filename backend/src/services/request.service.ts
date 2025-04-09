import { Request } from '@prisma/client';
import { prisma } from '../../prisma/client';
import { STATUSES } from '../constants/statuses';
import { IRequestDateFilter, TRequestList } from '../types/interfaсes';
import { checkRequestExists } from '../utils/checkRequestExists';

export const getFilteredRequests = async (
  where: IRequestDateFilter
): Promise<TRequestList> => {
  if (!where) throw new Error(`Отсутсвует дата`);

  return prisma.request.findMany({
    where,
    orderBy: {
      createdAt: 'desc',
    },
  });
};

export const createRequest = async (
  subject: string,
  message: string
): Promise<Request> => {
  const status = await prisma.status.findUnique({
    where: { name: STATUSES.NEW },
  });

  if (!status) throw new Error(`Статус ${STATUSES.NEW} не найден`);

  return prisma.request.create({
    data: {
      user: 'anonymous',
      subject,
      message,
      statusId: status.id,
      statusName: status.name,
    },
  });
};

export const startRequest = async (id: number): Promise<Request> => {
  const status = await prisma.status.findUnique({
    where: { name: STATUSES.IN_PROGRESS },
  });

  if (!status) throw new Error(`Статус ${STATUSES.IN_PROGRESS} не найден`);

  await checkRequestExists(id);

  const updatedRequest = await prisma.request.update({
    where: { id },
    data: {
      statusId: status.id,
      statusName: status.name,
      solutionText: null,
      cancelText: null,
    },
  });

  return updatedRequest;
};

export const completeRequest = async (
  id: number,
  solutionText: string
): Promise<Request> => {
  const status = await prisma.status.findUnique({
    where: { name: STATUSES.COMPLETED },
  });

  if (!status) throw new Error(`Статус ${STATUSES.COMPLETED} не найден`);

  await checkRequestExists(id);

  const updatedRequest = await prisma.request.update({
    where: { id },
    data: {
      statusId: status.id,
      statusName: status.name,
      solutionText,
      cancelText: null,
    },
  });

  return updatedRequest;
};

export const cancelRequest = async (
  id: number,
  cancelText: string
): Promise<Request> => {
  const status = await prisma.status.findUnique({
    where: { name: STATUSES.CANCELED },
  });

  if (!status) throw new Error(`Статус ${STATUSES.CANCELED} не найден`);

  await checkRequestExists(id);

  const updatedRequest = await prisma.request.update({
    where: { id },
    data: {
      statusId: status.id,
      statusName: status.name,
      solutionText: null,
      cancelText,
    },
  });

  return updatedRequest;
};

export const cancelAllRequests = async (
  cancelText: string
): Promise<{ count: number }> => {
  const inProgressStatus = await prisma.status.findUnique({
    where: { name: STATUSES.IN_PROGRESS },
  });

  const canceledStatus = await prisma.status.findUnique({
    where: { name: STATUSES.CANCELED },
  });

  if (!inProgressStatus || !canceledStatus)
    throw new Error('Не найдены нужные статусы');

  const updatedRequests = await prisma.request.updateMany({
    where: {
      statusId: inProgressStatus.id,
      statusName: inProgressStatus.name,
    },
    data: {
      statusId: canceledStatus.id,
      statusName: canceledStatus.name,
      cancelText,
    },
  });

  return updatedRequests;
};
