import { Request, Response } from 'express';
import {
  getFilteredRequests,
  createRequest,
  startRequest,
  completeRequest,
  cancelRequest,
  cancelAllRequests,
} from '../services/request.service';
import { IRequestDateFilter } from '../types/interfaсes';

export const getFilteredRequestsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { date, startDate, endDate } = req.query;
  const where: IRequestDateFilter = {};

  if (date) {
    const targetDate = new Date(date as string);
    if (isNaN(targetDate.getTime())) {
      res.status(400).json({ error: 'Некорректная дата' });
      return;
    }

    const nextDate = new Date(targetDate);
    nextDate.setDate(targetDate.getDate() + 1);
    where.createdAt = { gte: targetDate, lt: nextDate };
  }

  if (startDate && endDate) {
    const start = new Date(startDate as string);
    const end = new Date(endDate as string);
    end.setDate(end.getDate() + 1)

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      res.status(400).json({ error: 'Некорректный диапазон дат' });
      return;
    }

    where.createdAt = { gte: start, lt: end };
  }

  if (!where.createdAt) {
    res.status(400).json({ error: 'Переданы неверные параметры фильтрации' });
    return;
  }

  try {
    const requests = await getFilteredRequests(where);
    res.json(requests);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при получении обращений' });
  }
};

export const createNewRequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { subject, message } = req.body;

  if (!subject || !message) {
    res.status(400).json({ error: 'Укажите тему и сообщение обращения' });
    return;
  }

  try {
    const newRequest = await createRequest(subject, message);
    res.status(201).json(newRequest);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка сервера' });
  }
};

export const startRequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);

  if (isNaN(id)) {
    res.status(400).json({ error: 'Некорректный ID обращения' });
    return;
  }

  try {
    const request = await startRequest(id);
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Не удалось взять обращение в работу' });
  }
};

export const completeRequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  const { solutionText } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: 'Некорректный ID обращения' });
    return;
  }

  if (!solutionText) {
    res.status(400).json({ error: 'Укажите решение обращения' });
    return;
  }

  try {
    const request = await completeRequest(id, solutionText);
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при закрытии обращения' });
  }
};

export const cancelRequestHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const id = Number(req.params.id);
  const { cancelText } = req.body;

  if (isNaN(id)) {
    res.status(400).json({ error: 'Некорректный ID обращения' });
    return;
  }

  if (!cancelText) {
    res.status(400).json({ error: 'Укажите причину отмены обращения' });
    return;
  }

  try {
    const request = await cancelRequest(id, cancelText);
    res.json(request);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при отмене обращения' });
  }
};

export const cancelAllRequestsHandler = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { cancelText } = req.body;

  if (!cancelText) {
    res.status(400).json({ error: 'Укажите причину отмены обращений' });
    return;
  }

  try {
    const request = await cancelAllRequests(cancelText);
    if (request.count === 0) {
      res.status(404).json({ message: 'Нет обращений в статусе "В работе"' });
    } else {
      res.status(200).json({
        message: `${request.count} обращений было отменено`,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Ошибка при отмене обращений' });
  }
};
