export default (t: number = 1): Promise<void> => {
  return new Promise<void>(resolve => setTimeout(resolve, t));
}