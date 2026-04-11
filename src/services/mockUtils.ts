/** Small helper so mock services feel async like a real network call. */
export const mockDelay = (ms = 200) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));
