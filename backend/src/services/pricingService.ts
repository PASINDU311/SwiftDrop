const BASE_FEE = 100;
const PER_KM_FEE = 30;

export function calculateDeliveryFee(
  distanceKm: number,
  packageWeight: number
): number {
  let fee = BASE_FEE;

  // Distance charge
  fee += distanceKm * PER_KM_FEE;

  // Weight surcharge
  if (packageWeight > 5) {
    fee += (packageWeight - 5) * 20;
  }

  return Math.round(fee * 100) / 100;
}