import BLineAsset from '../assets/TfNSW_B-Line.svg.webp';
import BAsset from '../assets/TfNSW_B.svg.webp';
import MetroAsset from '../assets/TfNSW_M.svg.webp';
import TAsset from '../assets/TfNSW_T.svg.webp';
import T1Asset from '../assets/TfNSW_T1.svg.webp';
import T2Asset from '../assets/TfNSW_T2.svg.webp';
import T3Asset from '../assets/TfNSW_T3.svg.webp';
import T4Asset from '../assets/TfNSW_T4.svg.webp';
import T5Asset from '../assets/TfNSW_T5.svg.webp';
import T7Asset from '../assets/TfNSW_T7.svg.webp';
import T8Asset from '../assets/TfNSW_T8.svg.webp';
import T9Asset from '../assets/TfNSW_T9.svg.webp';

export const lineBadge = {
  size: 36,
  fontSize: 17,
  gap: 4,

  map: {
    M: { color: '#168388', textColor: '#fff', asset: MetroAsset },
    M1: { color: '#168388', textColor: '#fff', asset: MetroAsset },
    T: { color: '#EC6606', textColor: '#fff', asset: TAsset },
    T1: { color: '#F99D1C', asset: T1Asset },
    T2: { color: '#0098CD', asset: T2Asset },
    T3: { color: '#F37021', asset: T3Asset },
    T4: { color: '#005AA3', asset: T4Asset },
    T5: { color: '#C4258F', asset: T5Asset },
    T6: { color: '#7C3E21' },
    T7: { color: '#6F818E', asset: T7Asset },
    T8: { color: '#00954C', asset: T8Asset },
    T9: { color: '#D11F2F', asset: T9Asset },
    B: {
      color: '#009ED7',
      textColor: '#fff',
      asset: BAsset,
    },
    B1: { color: '#009ED7', textColor: '#fff', asset: BLineAsset },
    'B-LINE': { color: '#009ED7', textColor: '#fff', asset: BLineAsset },
    BMT: { color: '#F99D1C' },
    CCN: { color: '#D11F2F' },
  },
} as const;
