export interface IRequestQueryParams {
  date?: string;
  startDate?: string;
  endDate?: string;
}

export interface IRequestDateFilter {
  createdAt?: {
    gte?: Date;
    lt?: Date;
  };
}

interface IRequest {
  id: number;
  user: string;
  subject: string;
  message: string;
  statusName: string;
  solutionText: string | null;
  cancelText: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
}

export type TRequestList = IRequest[];
