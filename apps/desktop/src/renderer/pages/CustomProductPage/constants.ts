import { MobileDeRuPostItemType } from "@site-parser/shared"
import {DropdownOption} from "../../shared/ui/AppDropdown/AppDrodpown.tsx";

export const defaultCustomProductState: MobileDeRuPostItemType  = {
  url: '',
  imageUrls: [],
  title: '',
  register: '',
  engine: '',
  transmission: 'Механическая',
  power: '',
  distance: '',
  fuel: 'Бензин',
  price: ''
}

export const transmissionOptions: DropdownOption<string>[]  = [
  {
    label: 'Механическая',
    value: 'Механическая'
  },
  {
    label: 'Автоматическая',
    value: 'Автоматическая'
  },
  {
    label: 'Роботизированная',
    value: 'Роботизированная'
  },
  {
    label: 'Бесступенчатая',
    value: 'Бесступенчатая'
  },
]

export const fuelOptions: DropdownOption<string>[]  = [
  {
    label: 'Бензин',
    value: 'Бензин'
  },
  {
    label: 'Дизельное топливо',
    value: 'Дизельное топливо'
  },
  {
    label: 'Газ',
    value: 'Газ'
  },
  {
    label: 'Электричество',
    value: 'Электричество'
  },
  {
    label: 'Гибридное',
    value: 'Гибридное'
  },
]