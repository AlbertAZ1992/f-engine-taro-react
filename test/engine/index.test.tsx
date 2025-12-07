// @ts-nocheck
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import FCanvasIndex from '@/engine/index';

// Mock FFCanvas 实例和方法
const mockRender = jest.fn();
const mockUpdate = jest.fn();
const mockDestroy = jest.fn();
const mockGetCanvasEl = jest.fn(() => ({ dispatchEvent: jest.fn() }));
let mockFFCanvasInstance: any = null;

// Mock @antv/f-engine
jest.mock('@antv/f-engine', () => {
  const MockFFCanvas = jest.fn().mockImplementation(() => {
    mockFFCanvasInstance = {
      getCanvasEl: mockGetCanvasEl,
      render: mockRender,
      update: mockUpdate,
      destroy: mockDestroy,
    };
    return mockFFCanvasInstance;
  });
  return { Canvas: MockFFCanvas };
});

// Mock Taro
jest.mock('@tarojs/taro', () => {
  const selectorResult = {
    node: {
      width: 300,
      height: 200,
      getContext: () => ({}),
      createImage: () => ({}),
      requestAnimationFrame: (cb) => setTimeout(cb, 16),
      cancelAnimationFrame: (id) => clearTimeout(id),
    },
    width: 300,
    height: 200,
  };

  return {
    __esModule: true,
    default: {
      createSelectorQuery: () => ({
        select: () => ({
          fields: () => ({
            exec: (cb) => setTimeout(() => cb([selectorResult]), 0),
          }),
        }),
      }),
      getSystemInfoSync: () => ({ pixelRatio: 2 }),
      createOffscreenCanvas: jest.fn(),
    },
    createSelectorQuery: () => ({
      select: () => ({
        fields: () => ({
          exec: (cb) => setTimeout(() => cb([selectorResult]), 0),
        }),
      }),
    }),
    getSystemInfoSync: () => ({ pixelRatio: 2 }),
  };
});

// Mock 环境判断
jest.mock('@/utils/env', () => ({
  isH5: () => false,
  isWeapp: () => true,
}));

// Mock Canvas 组件
jest.mock('@tarojs/components', () => {
  const React = require('react');
  return {
    __esModule: true,
    Canvas: React.forwardRef((props, ref) => {
      const { canvasId, type, style, ...restProps } = props;
      return (
        <div id={props.id} data-testid="taro-canvas" ref={ref} {...restProps} />
      );
    }),
  };
});

describe('FCanvasIndex', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('应该渲染 Canvas 组件并初始化 FFCanvas', async () => {
    const { Canvas: FFCanvas } = require('@antv/f-engine');

    render(
      <FCanvasIndex id="test-canvas">
        <circle r={40} fill="red" />
      </FCanvasIndex>,
    );

    const canvas = screen.getByTestId('taro-canvas');
    expect(canvas).toBeInTheDocument();
    expect(canvas).toHaveAttribute('id', 'test-canvas');

    // 等待异步初始化完成
    await waitFor(
      () => {
        expect(FFCanvas).toHaveBeenCalled();
      },
      { timeout: 1000 },
    );

    // 验证 FFCanvas 实例被创建并调用了 render
    expect(mockFFCanvasInstance).toBeDefined();
    expect(mockRender).toHaveBeenCalled();
  });

  it('应该在 children 变化时更新 canvas', async () => {
    const { Canvas: FFCanvas } = require('@antv/f-engine');

    const { rerender } = render(
      <FCanvasIndex id="test-canvas">
        <circle r={40} />
      </FCanvasIndex>,
    );

    await waitFor(() => {
      expect(FFCanvas).toHaveBeenCalled();
    });

    jest.clearAllMocks();

    // 更新 children
    rerender(
      <FCanvasIndex id="test-canvas">
        <rect width={100} height={100} />
      </FCanvasIndex>,
    );

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalled();
    });

    expect(mockUpdate).toHaveBeenCalledWith({ children: expect.anything() });
  });

  it('应该在组件卸载时清理资源', async () => {
    const { Canvas: FFCanvas } = require('@antv/f-engine');

    const { unmount } = render(
      <FCanvasIndex id="test-canvas">
        <circle r={40} />
      </FCanvasIndex>,
    );

    await waitFor(() => {
      expect(FFCanvas).toHaveBeenCalled();
    });

    unmount();

    expect(mockDestroy).toHaveBeenCalled();
  });
});
