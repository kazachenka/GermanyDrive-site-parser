import { isString, removeEmptySymbols } from "./parser.utils.ts";
import { ProductPostItemType } from "@site-parser/shared"

export function getMobileDePageData(
  rootElement: HTMLElement | null,
  url = ''
): ProductPostItemType | null {
  if (!rootElement) return null;

  const container =
    rootElement.querySelector('[class*="ViewItemPage-module__"]');

  console.log('container: ', container);

  if (!container) {
    return null;
  }
  const imageContainer = container?.querySelector('[data-testid=gallery-main-focus-container]');

  const imageElements = imageContainer?.querySelectorAll('[data-testid="thumbnail-gallery"] [data-testid^="thumbnail-"] img');

  //const nettoElement = this._document.querySelector('[class^="MainPriceArea_mainPrice"]');
  const bruttoElement = document.querySelector('[data-testid="vip-price-label"]');
  const desc = document.querySelector('[data-testid=vip-key-features-box]');
  // const desc2 = this._document.querySelector('.further-tec-data');

  const imageUrls: string[] = [];

  imageElements?.forEach((elem) => {
    const url = elem.getAttribute('src');
    if (isString(url) && url.includes('https://')) {
      imageUrls.push(url)
    }
  })

  console.log('imageUrls: ', imageUrls);

  return {
    url: url,
    imageUrls: imageUrls,
    title: container.querySelector('[data-testid="main-cta-box"] h2')?.textContent || '',
    // price: (nettoElement?.textContent || bruttoElement?.textContent)?.split(' ')[0] || '' as string,
    price: removeEmptySymbols(bruttoElement?.textContent || "").split('€')[0] || '' as string,
    distance: desc?.querySelector('[data-testid=vip-key-features-list-item-mileage] [class*="KeyFeatures"][class*="value"]')?.textContent || '',
    transmission: desc?.querySelector('[data-testid=vip-key-features-list-item-transmission] [class*="KeyFeatures"][class*="value"]')?.textContent || '',
    power: desc?.querySelector('[data-testid=vip-key-features-list-item-power] [class*="KeyFeatures"][class*="value"]')?.textContent || '',
    register: desc?.querySelector('[data-testid=vip-key-features-list-item-firstRegistration] [class*="KeyFeatures"][class*="value"]')?.textContent || '',
    fuel: desc?.querySelector('[data-testid=vip-key-features-list-item-fuel] [class*="KeyFeatures"][class*="value"]')?.textContent || '',
    engine: removeEmptySymbols(container.querySelector('[data-testid="cubicCapacity-item"] + dd')?.textContent?.replace('ccm', 'куб. см') || ''),
  }
}