// @ts-nocheck
// Mock @tarojs/components 避免 ESM 模块问题
jest.mock('@tarojs/components', () => ({
  __esModule: true,
  Canvas: () => null,
}))

// Mock @tarojs/taro
jest.mock('@tarojs/taro', () => ({
  __esModule: true,
  default: {},
  getEnv: () => 'WEB',
  ENV_TYPE: { WEB: 'WEB', WEAPP: 'WEAPP' },
}))

import FCanvasIndex from '@/index'
import * as utils from '@/utils'

describe('index.ts', () => {
  it('应该导出默认组件', () => {
    expect(FCanvasIndex).toBeDefined()
    expect(typeof FCanvasIndex).toBe('function')
  })

  it('应该导出 utils', () => {
    expect(utils.isH5).toBeDefined()
    expect(utils.isWeapp).toBeDefined()
  })
})

