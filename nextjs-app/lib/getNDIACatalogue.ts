export async function getNDIACatalogue(year: string) {
  // Placeholder fetch logic
  const res = await fetch(`/api/catalogue/${year}`);
  return res.json();
}
