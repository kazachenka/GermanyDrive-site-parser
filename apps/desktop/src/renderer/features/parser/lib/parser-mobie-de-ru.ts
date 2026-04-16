import { isString, removeEmptySymbols } from "./parser.utils.ts";
import { ProductPostItemType } from "@site-parser/shared"

export function getMobileDePageData(url = ''): ProductPostItemType | null {
  const container = document.querySelector('[class^="ViewItemPage_content"]');

  if (!container) {
    return null;
  }
  const imageGallery = document.querySelector('[class^="InlineView_galleryContainer"]');
  const imageElements = imageGallery?.querySelectorAll('[class^="clickable_Clickable"] img');
  //const nettoElement = this._document.querySelector('[class^="MainPriceArea_mainPrice"]');
  const bruttoElement = document.querySelector('[class^="MainPriceArea_mainPrice"]');
  const desc = document.querySelector('[data-testid=vip-key-features-box]');
  // const desc2 = this._document.querySelector('.further-tec-data');

  const imageUrls: string[] = [];

  imageElements?.forEach((elem) => {
    const url = elem.getAttribute('src');
    if (isString(url) && url.includes('https://')) {
      imageUrls.push(url)
    }
  })

  return {
    url: url,
    imageUrls: imageUrls,
    title: container.querySelector('h2[class^=typography_headline]')?.textContent || '',
    // price: (nettoElement?.textContent || bruttoElement?.textContent)?.split(' ')[0] || '' as string,
    price: removeEmptySymbols(bruttoElement?.textContent || "").split('€')[0] || '' as string,
    distance: desc?.querySelector('[data-testid=vip-key-features-list-item-mileage] [class^=KeyFeatures_value]')?.textContent || '',
    transmission: desc?.querySelector('[data-testid=vip-key-features-list-item-transmission] [class^=KeyFeatures_value]')?.textContent || '',
    power: desc?.querySelector('[data-testid=vip-key-features-list-item-power] [class^=KeyFeatures_value]')?.textContent || '',
    register: desc?.querySelector('[data-testid=vip-key-features-list-item-firstRegistration] [class^=KeyFeatures_value]')?.textContent || '',
    fuel: desc?.querySelector('[data-testid=vip-key-features-list-item-fuel] [class^=KeyFeatures_value]')?.textContent || '',
    engine: getEngineFromElementList(document.querySelector('[class^="DataList_alternatingColorsList"]')),
  }
}

function getEngineFromElementList(container: HTMLDivElement): string {
  const labels = container.querySelectorAll('[class^=typography_label]');
  const values = container.querySelectorAll('[class^=DataListItem]');

  const index = [...labels].findIndex((el) => ((el?.textContent?.toLowerCase() || '') === 'объем двигателя'));

  if (index > -1) {
    return values[index]?.textContent?.replace('ccm', 'куб. см');
  }

  return '0';
}