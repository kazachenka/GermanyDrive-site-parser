import { isString, removeEmptySymbols } from "./parser.utils.ts";
import { ProductPostItemType } from "@site-parser/shared"

export function getAutoscoutPageData(url = ''): ProductPostItemType | null {
  const container = document.querySelector('[class^="DetailPage_detailpage"] [data-cy=stage-section]');

  if (!container) {
    return null;
  }
  const imageGallery = container.querySelector('[class^="image-gallery-thumbnails-container"]');
  const imageElements = imageGallery?.querySelectorAll('[class^="image-gallery-thumbnail"] img')
  const bruttoElement = container?.querySelector('[class^="PriceInfo_price"]');

  const imageUrls: string[] = [];

  imageElements?.forEach((elem) => {
    const url = elem.getAttribute('src');
    if (isString(url) && url.includes('https://')) {
      imageUrls.push(url)
    }
  });

  return {
    url: url,
    imageUrls: imageUrls,
    title: container?.querySelector('[class^="StageTitle_boldClassifiedInfo"]')?.textContent || '',
    price: removeEmptySymbols(bruttoElement?.textContent || "").split('€ ')[1] || '' as string,
    engine: getEngineFromElementList(),
    distance: '',
    transmission: '',
    power: '',
    register: '',
    fuel: '',
    ...getVehicleData(),
  };
}

function getVehicleData(): Partial<ProductPostItemType> {
  const data: Partial<ProductPostItemType> = {};
  const items = document.querySelectorAll('div[class*="VehicleOverview_itemContainer"]');

  items.forEach((item) => {
    const titleElement = item.querySelector('div[class*="VehicleOverview_itemTitle"]');
    const valueElement = item.querySelector('div[class*="VehicleOverview_itemText"]');

    if (titleElement && valueElement) {
      const title = titleElement.textContent?.trim();
      const value = valueElement.textContent?.trim() || '';

      switch (title) {
        case 'Пробег':
          data.distance = value;
          break;
        case 'Коробка передач':
          data.transmission = value;
          break;
        case 'Первая регистрация':
          data.register = value;
          break;
        case 'Вид топлива':
          data.fuel = value;
          break;
        case 'Мощность':
          data.power = value;
          break;
      }
    }
  });

  return data;
}

function getEngineFromElementList(): string {
  const container = document.querySelector('[data-cy="technical-details-section"] [class^="DataGrid_defaultDlStyle"]');

  if (!container) {
    return '';
  }

  const labels = container.querySelectorAll('dt');
  const values = container.querySelectorAll('dd');

  const index = [...labels].findIndex((el) => ((el?.textContent?.toLowerCase() || '') === 'размер двигателя'));

  if (index > -1) {
    return values[index]?.textContent?.replace('см³', 'куб. см');
  }

  return '0';
}