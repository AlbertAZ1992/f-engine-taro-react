// @ts-nocheck
import { isH5, isWeapp } from '@/utils/env';
import { getEnv, ENV_TYPE } from '@tarojs/taro';

jest.mock('@tarojs/taro', () => ({
  __esModule: true,
  getEnv: jest.fn(),
  ENV_TYPE: {
    WEB: 'WEB',
    WEAPP: 'WEAPP',
  },
}));

describe('utils/env', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('isH5', () => {
    it('应该在 H5 环境下返回 true', () => {
      (getEnv as jest.Mock).mockReturnValue(ENV_TYPE.WEB);
      expect(isH5()).toBe(true);
    });

    it('应该在非 H5 环境下返回 false', () => {
      (getEnv as jest.Mock).mockReturnValue(ENV_TYPE.WEAPP);
      expect(isH5()).toBe(false);
    });
  });

  describe('isWeapp', () => {
    it('应该在微信小程序环境下返回 true', () => {
      (getEnv as jest.Mock).mockReturnValue(ENV_TYPE.WEAPP);
      expect(isWeapp()).toBe(true);
    });

    it('应该在非微信小程序环境下返回 false', () => {
      (getEnv as jest.Mock).mockReturnValue(ENV_TYPE.WEB);
      expect(isWeapp()).toBe(false);
    });
  });
});
