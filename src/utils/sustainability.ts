// Sustainability Calculator based on ICCT formulas
// Reference: International Council on Clean Transportation

// Constants for calculations
const CO2_PER_KM_CAR = 0.21; // kg CO2 per km for average car in Pakistan
const CO2_PER_KM_BIKE = 0.08; // kg CO2 per km for motorcycle
const FUEL_CONSUMPTION_CAR = 0.08; // liters per km (12.5 km/L average)
const FUEL_CONSUMPTION_BIKE = 0.025; // liters per km (40 km/L average)
const FUEL_PRICE_PKR = 280; // PKR per liter (approximate)
const TREES_PER_TON_CO2 = 45; // Trees needed to absorb 1 ton of CO2 per year

export interface RideSavings {
  co2Saved: number; // kg
  fuelSaved: number; // liters
  moneySaved: number; // PKR
  treesEquivalent: number;
}

export interface SustainabilityMetrics {
  totalCo2Saved: number;
  totalFuelSaved: number;
  totalMoneySaved: number;
  treesEquivalent: number;
  congestionReduction: number; // percentage
  averageSavingsPerRide: RideSavings;
}

/**
 * Calculate CO2 savings for a single shared ride
 * Formula: (Solo emissions - Shared emissions) = CO2 saved
 * Sharing reduces emissions by ~50% for 2 people, ~66% for 3, ~75% for 4
 */
export function calculateRideCo2Savings(
  distanceKm: number,
  vehicle: 'car' | 'bike',
  passengers: number
): number {
  const emissionRate = vehicle === 'car' ? CO2_PER_KM_CAR : CO2_PER_KM_BIKE;
  const soloEmissions = distanceKm * emissionRate;
  
  // With carpooling, emissions are shared among all occupants
  // Each passenger saves (1 - 1/totalOccupants) of solo emissions
  const totalOccupants = passengers + 1; // +1 for driver
  const sharedEmissionsPerPerson = soloEmissions / totalOccupants;
  const savingsPerPassenger = soloEmissions - sharedEmissionsPerPerson;
  
  return Number((savingsPerPassenger * passengers).toFixed(2));
}

/**
 * Calculate fuel savings for a shared ride
 */
export function calculateRideFuelSavings(
  distanceKm: number,
  vehicle: 'car' | 'bike',
  passengers: number
): number {
  const consumptionRate = vehicle === 'car' ? FUEL_CONSUMPTION_CAR : FUEL_CONSUMPTION_BIKE;
  const soloFuel = distanceKm * consumptionRate;
  
  const totalOccupants = passengers + 1;
  const sharedFuelPerPerson = soloFuel / totalOccupants;
  const savingsPerPassenger = soloFuel - sharedFuelPerPerson;
  
  return Number((savingsPerPassenger * passengers).toFixed(2));
}

/**
 * Calculate money saved from fuel savings
 */
export function calculateMoneySaved(fuelSavedLiters: number): number {
  return Math.round(fuelSavedLiters * FUEL_PRICE_PKR);
}

/**
 * Convert CO2 saved to equivalent trees planted
 * Based on: One tree absorbs ~22 kg CO2 per year
 */
export function calculateTreesEquivalent(co2SavedKg: number): number {
  return Number((co2SavedKg / 22).toFixed(1));
}

/**
 * Calculate complete savings for a ride
 */
export function calculateRideSavings(
  distanceKm: number,
  vehicle: 'car' | 'bike',
  passengers: number
): RideSavings {
  const co2Saved = calculateRideCo2Savings(distanceKm, vehicle, passengers);
  const fuelSaved = calculateRideFuelSavings(distanceKm, vehicle, passengers);
  const moneySaved = calculateMoneySaved(fuelSaved);
  const treesEquivalent = calculateTreesEquivalent(co2Saved);
  
  return {
    co2Saved,
    fuelSaved,
    moneySaved,
    treesEquivalent,
  };
}

/**
 * Calculate cumulative sustainability metrics
 */
export function calculateCumulativeMetrics(
  totalRides: number,
  totalCo2Saved: number,
  totalFuelSaved: number
): SustainabilityMetrics {
  const totalMoneySaved = calculateMoneySaved(totalFuelSaved);
  const treesEquivalent = calculateTreesEquivalent(totalCo2Saved);
  
  // Congestion reduction estimate: ~15-20% with active carpooling adoption
  // Based on 30% carpool rate reducing peak traffic by 15-20%
  const congestionReduction = Math.min(20, (totalRides / 100) * 15);
  
  const averageSavingsPerRide: RideSavings = totalRides > 0 ? {
    co2Saved: Number((totalCo2Saved / totalRides).toFixed(2)),
    fuelSaved: Number((totalFuelSaved / totalRides).toFixed(2)),
    moneySaved: Math.round(totalMoneySaved / totalRides),
    treesEquivalent: Number((treesEquivalent / totalRides).toFixed(2)),
  } : {
    co2Saved: 0,
    fuelSaved: 0,
    moneySaved: 0,
    treesEquivalent: 0,
  };
  
  return {
    totalCo2Saved,
    totalFuelSaved,
    totalMoneySaved,
    treesEquivalent,
    congestionReduction,
    averageSavingsPerRide,
  };
}

/**
 * Estimate distance between two coordinates using Haversine formula
 */
export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Number((R * c).toFixed(1));
}

function toRad(deg: number): number {
  return deg * (Math.PI / 180);
}

/**
 * Format CO2 for display (kg or tons)
 */
export function formatCo2(kg: number): string {
  if (kg >= 1000) {
    return `${(kg / 1000).toFixed(1)} tons`;
  }
  return `${kg.toFixed(1)} kg`;
}

/**
 * Format fuel for display
 */
export function formatFuel(liters: number): string {
  return `${liters.toFixed(1)} L`;
}

/**
 * Format money for display in PKR
 */
export function formatMoney(pkr: number): string {
  return new Intl.NumberFormat('en-PK', {
    style: 'currency',
    currency: 'PKR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(pkr);
}
