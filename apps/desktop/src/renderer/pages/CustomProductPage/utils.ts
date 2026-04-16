import { ProductPostItemType } from "@site-parser/shared"

export function processProductData(data: ProductPostItemType): ProductPostItemType {
  return {
    ...data,
    distance: processDistance(data.distance),
    power: processPower(data.power),
    engine: processEngine(data.engine),
  };
}

function processDistance(distance: string): string {
  if (distance.includes("км")) {
    return distance;
  }

  if (!distance.length) {
    return '';
  }

  return `${distance} км`;
}

function processPower(power: string): string {
  if (power.includes('кВт') || power.includes('л. c.')) {
    return power;
  }

  if (!power.length) {
    return '';
  }

  return `${power} л.с.`;
}

function processEngine(engine: string): string {
  if (engine.includes("куб. см")) {
    return engine;
  }

  if (!engine.length) {
    return '';
  }

  return `${engine} куб. см`;
}