export async function getNDIACatalogue(year: string) {
  // Static placeholder catalogue
  return Promise.resolve({
    services: [
      {
        code: '01_011_0107_1_1',
        name: 'Daily Personal Activities',
        tiers: [{ name: 'Standard', maxRate: 62.17 }],
      },
    ],
    year,
  });
}
