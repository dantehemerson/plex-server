export function extractMovieTitle(message: string): string {
  const movieTitleFormatregex = /^.*?\s\((\d{4})\)/;

  return movieTitleFormatregex.exec(message)?.[0];
}
