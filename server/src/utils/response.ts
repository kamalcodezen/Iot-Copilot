import { Response } from 'express';

// Success envelope helpers. Each one emits exactly the JSON shape the
// controllers used to build inline, so API responses are unchanged.

export function sendData<T>(res: Response, data: T, status = 200) {
  res.status(status).json({ success: true, data });
}

export function sendPaginated<T>(res: Response, data: T, page: number, limit: number, total: number) {
  res.json({
    success: true,
    data,
    pagination: { page, limit, total, pages: Math.ceil(total / limit) },
  });
}

export function sendMessage(res: Response, message: string, status = 200) {
  res.status(status).json({ success: true, message });
}
