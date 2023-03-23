export const assertExhaustive = (value: never, message = 'Not exhaustive switch'): never => {
  throw new Error(message);
};
