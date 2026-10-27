import * as echarts from 'echarts/core';
import { LineChart } from 'echarts/charts';
import {
  DataZoomInsideComponent,
  GridComponent,
  MarkAreaComponent,
  MarkLineComponent,
  TooltipComponent,
} from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import ReactEChartsCore from 'echarts-for-react/esm/core';
import type { EChartsReactProps } from 'echarts-for-react/lib/types';

echarts.use([
  LineChart,
  GridComponent,
  TooltipComponent,
  DataZoomInsideComponent,
  MarkLineComponent,
  MarkAreaComponent,
  CanvasRenderer,
]);

export default function EChartsView(props: EChartsReactProps) {
  return <ReactEChartsCore echarts={echarts} {...props} />;
}
