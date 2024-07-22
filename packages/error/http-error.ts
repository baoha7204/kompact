export class HttpError extends Error {
  public status: number;
  // will be change number to an enum or object later
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}
