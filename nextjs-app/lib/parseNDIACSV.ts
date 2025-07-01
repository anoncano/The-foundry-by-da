import Papa from 'papaparse';

interface Service {
  code: string;
  name: string;
  tiers: { name: string; maxRate: number }[];
}

export function parseNDIACSV(csvText: string): { services: Service[] } {
  const parsed = Papa.parse<Record<string, string>>(csvText.trim(), { header: true });
  if (parsed.errors.length) {
    throw new Error(parsed.errors[0].message);
  }
  const services: Service[] = [];
  for (const row of parsed.data) {
    if (!row.code || !row.name || !row.maxRate) continue;
    const rate = parseFloat(row.maxRate as string);
    if (isNaN(rate)) continue;
    services.push({
      code: String(row.code).trim(),
      name: String(row.name).trim(),
      tiers: [
        { name: row.tierName ? String(row.tierName).trim() : 'Standard', maxRate: rate }
      ]
    });
  }
  return { services };
}
