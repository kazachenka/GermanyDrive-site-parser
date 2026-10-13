import { isString, removeEmptySymbols } from "./parser.utils.ts";
import { ProductPostItemType } from "@site-parser/shared"

export function getMobileDePageData(
  container: HTMLElement | null,
  url = ''
): ProductPostItemType | null {
  if (!container) return null;

  console.log('container: ', container);


  const imageElements = container.querySelectorAll('[data-testid="image-gallery"] img');

  const bruttoElement = container.querySelector('[data-testid="vip-price-label"]');

  const desc = container.querySelector('[data-testid="vip-key-features-box"]');

  const imageUrls: string[] = [];

  imageElements?.forEach((elem) => {
    let url = elem.getAttribute('src');

    if (isString(url) && url.includes('https://')) {
      imageUrls.push(url);
    }
  });

  console.log('imageUrls: ', imageUrls);

  return {
    url: url,
    imageUrls: imageUrls,
    title: container.querySelector('[data-testid="vip-ad-title"]')?.textContent ||
      container.querySelector('[data-testid="image-0"] img')?.getAttribute('alt') || '',
    price: removeEmptySymbols(bruttoElement?.textContent || "").split('€')[0] || '' as string,
    distance: desc?.querySelector('[data-testid="vip-key-features-list-item-mileage"] h4')?.textContent || '',
    transmission: desc?.querySelector('[data-testid="vip-key-features-list-item-transmission"] h4')?.textContent || '',
    power: desc?.querySelector('[data-testid="vip-key-features-list-item-power"] h4')?.textContent || '',
    register: desc?.querySelector('[data-testid="vip-key-features-list-item-firstRegistration"] h4')?.textContent || '',
    fuel: desc?.querySelector('[data-testid="vip-key-features-list-item-fuel"] h4')?.textContent || '',
    engine: removeEmptySymbols(
      container.querySelector('[data-testid="cubicCapacity-item"] + dd')?.textContent?.replace('ccm', 'куб. см') || ''
    ),
  };
}