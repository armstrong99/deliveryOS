export interface IRes<T> {
    data?: T;
    status: boolean;
    message: string;
    statusCode:number
  }