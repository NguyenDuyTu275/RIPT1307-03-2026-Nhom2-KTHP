export function transformImageUrl(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  if (url.includes('drive.google.com')) {
    const match = url.match(/id=([^&]+)/);
    if (match && match[1]) {
      return `https://drive.google.com/thumbnail?id=${match[1]}&sz=w1000`;
    }
  }
  return url;
}
