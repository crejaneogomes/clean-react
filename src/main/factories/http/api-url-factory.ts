export const makeApiUrl = (path: String): string => {
  return `${process.env.API_URL}${path}`
}
