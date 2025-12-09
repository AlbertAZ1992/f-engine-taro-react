<p align="center">
  <h1 align="center">f-engine-taro-react</h1>
</p>

<p align="center">
  <a aria-label="Released version" target="_blank" href="https://www.npmjs.com/package/f-engine-taro-react">
    <img alt="NPM Version" src="https://img.shields.io/npm/v/f-engine-taro-react?color=5FAE9B&label=Released&style=for-the-badge">
  </a>
  <a aria-label="Downloads" href="https://www.npmjs.com/package/f-engine-taro-react">
    <img alt="Npm Downloads" src="https://img.shields.io/npm/dm/f-engine-taro-react?color=%23EEC578&style=for-the-badge">
  </a>
  <a aria-label="Minified Gzip" href="https://bundlephobia.com/result?p=f-engine-taro-react">
    <img alt="Minified Gzip" src="https://img.shields.io/bundlephobia/minzip/f-engine-taro-react?color=F47983&style=for-the-badge">
  </a>
  <a aria-label="Unpacked Size" href="https://www.npmjs.com/package/f-engine-taro-react?activeTab=code">
    <img alt="Unpacked Size" src="https://img.shields.io/npm/unpacked-size/f-engine-taro-react?color=F47983&style=for-the-badge">
  </a>
</p>

A React Canvas wrapper to use AntV F2 in Taro (Weapp/H5). It initializes Canvas and bridges click/touch events to F2.


## Overview

- This package is an extension of AntV FEngine: https://github.com/antvis/FEngine
- Fully supports latest FEngine v1.8+ and F2 v5 on Taro v4.
- For architecture details, see:
https://f2.antv.antgroup.com/tutorial/framework/overview

## Features
- Plug-and-play Canvas wrapper for F2 v5 on Taro v4.
- Works in Weapp and H5.
- Click/touch events forwarded to F2 charts.

## Installation
```bash
pnpm add f-engine-taro-react
# Peer deps (install in your app)
pnpm add react react-dom @tarojs/taro @tarojs/components @antv/f2
```


## Usage
> For a complete example, see `example/src/pages/index/index.tsx`.

```tsx
import { View, Text } from '@tarojs/components'
import { showToast } from '@tarojs/taro'
import { Chart, Interval, Axis, Tooltip } from '@antv/f2' // F2 v5
import FCanvasIndex from 'f-engine-taro-react'             // Taro v4

const data = [
  { genre: 'Sports', sold: 275 },
  { genre: 'Strategy', sold: 115 },
  { genre: 'Action', sold: 120 },
  { genre: 'Shooter', sold: 350 },
  { genre: 'Other', sold: 150 },
]

export default function Index() {
  const handlePlotClick = (ev) => {
    const { data: datum } = ev.data || {}
    if (datum) showToast({ title: `${datum.genre}: ${datum.sold}`, icon: 'none' })
  }

  return (
    <View className='index'>
      <Text>F2 Demo</Text>
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
```

## Notes
- Use a unique Canvas id so `createSelectorQuery` can find it (Weapp: `fields({ node: true, size: true })`).
- Ensure the Canvas container has non-zero width and height.

## License
MIT