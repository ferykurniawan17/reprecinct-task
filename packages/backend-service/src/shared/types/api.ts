import { Request, Response } from "express";

export interface ApiRequest<T = any> extends Request {
  body: T;
}

export interface ApiResponse<T = any> extends Response {
  success?: boolean;
  data?: T;
  error?: string;
}
