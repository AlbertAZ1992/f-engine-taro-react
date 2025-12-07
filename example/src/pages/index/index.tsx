import { View, Text } from '@tarojs/components'
import { useLoad, showToast } from '@tarojs/taro'
import { Chart, Interval, Axis, Tooltip } from '@antv/f2'
import FCanvasIndex from 'f-engine-taro-react'
// import FCanvasIndex from './engine-box'

import './index.scss'

const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
]

export default function Index() {
  useLoad(() => {
    console.log('Index page loaded.')
  })

  const handlePlotClick = (ev) => {
    const { data: datum } = ev.data || {}
    if (datum) {
      showToast({
        title: `${datum.genre}: ${datum.sold}`,
        icon: 'none',
      })
    }
  }

  return (
    <View className='index'>
      <Text className='index__title'>F2 柱状图 Demo（带点击）</Text>
      <View className='index__canvas'>
        <FCanvasIndex id='f2-demo-canvas'>
          <Chart data={data} padding='auto' onPlotClick={handlePlotClick}>
            <Axis field='genre' />
            <Axis field='sold' />
            <Interval x='genre' y='sold' color='genre' />
            <Tooltip />
          </Chart>
        </FCanvasIndex>
      </View>
    </View>
  )
}