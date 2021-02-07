import { Request, Response, NextFunction } from "express";

export enum Gender {
  male = "MALE",
  female = "FEMALE",
  notKnown = "NOT_KNOWN",
  notApplicable = "NOT_APPLICABLE",
}

export interface PatientsInterface {
  id: number;
  first_name: string;
  last_name: string | null;
  email: string;
  dob: Date;
  gender: Gender;
  phone_no: string | null;
  address: string | null;
  city: string | null;
  zipcode: string | null;
  created_at: Date;
  updated_at: Date | null;
}

export interface PatientsInsertInterface {
  first_name: string;
  last_name: string | null;
  email: string;
  dob: Date;
  gender: Gender;
  phone_no: string | null;
  address: string | null;
  city: string | null;
  zipcode: string | null;
}

export interface RawPatientsInterface {
  first_name: string;
  last_name: string;
  email: string;
  dob: string;
  gender: string;
  phone_no: string;
  address: string;
  city: string;
  zipcode: string;
}

interface PageLimitInterface {
  page: number;
  limit: number;
}

interface PaginatedResultsInterface {
  results: PatientsInterface[];
  totalCount: number;
  next?: PageLimitInterface;
  previous?: PageLimitInterface;
}

export interface PaginationMiddlewareResponse extends Response {
  paginatedResults: PaginatedResultsInterface;
}

export interface PaginationMiddlewareRequest extends Request {
  query: {
    page: string | undefined;
    limit: string | undefined;
    search: string | undefined;
  };
}

export type PaginationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => void;
