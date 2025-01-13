export function downloadImage(imageUrl: string): void {
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'palette.png';
  link.target = '_blank';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
