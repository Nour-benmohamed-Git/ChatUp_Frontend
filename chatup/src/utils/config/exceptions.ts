export class CustomError extends Error {
  constructor(
    message: string = "An unexpected error occurred while fetching data. Please try again later."
  ) {
    super(message);
  }
}
