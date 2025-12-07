import { Canvas as FFCanvas } from '@antv/f-engine';
import { Canvas } from '@tarojs/components';
import Taro from '@tarojs/taro';
import { useEffect, useRef } from 'react';
import { isH5, isWeapp } from '../utils/env';

interface FCanvasIndexProps {
  id: string;
  children: any;
}

function convertTouches(touches: any) {
  if (!touches) return touches;
  return touches.map((touch: any) => {
    const nextTouch = { ...touch };
    const fallbackX = touch.x ?? touch.pageX ?? touch.clientX ?? 0;
    const fallbackY = touch.y ?? touch.pageY ?? touch.clientY ?? 0;
    nextTouch.pageX = touch.pageX ?? fallbackX;
    nextTouch.pageY = touch.pageY ?? fallbackY;
    nextTouch.clientX = touch.clientX ?? fallbackX;
    nextTouch.clientY = touch.clientY ?? fallbackY;
    return nextTouch;
  });
}

function dispatchEvent(el: any, event: any, type: string) {
  if (!el || !event) return;
  const evt = JSON.parse(JSON.stringify(event));
  if (!evt.preventDefault) {
    evt.preventDefault = function () {};
  }
  evt.type = type;
  evt.target = el;

  if (isH5()) {
    // el.dispatchEvent(event);
    return;
  }

  const { touches, changedTouches, detail } = evt;
  evt.touches = convertTouches(touches);
  evt.changedTouches = convertTouches(changedTouches);
  if (detail) {
    evt.clientX = detail.x;
    evt.clientY = detail.y;
  }

  el.dispatchEvent(evt);
}

export default function FCanvasIndex({ id, children }: FCanvasIndexProps) {
  const canvasRef = useRef<typeof Canvas>();
  const ffCanvasRef = useRef<FFCanvas | null>(null);
  const canvasElRef = useRef<any>(null);
  const childrenRef = useRef<any>();

  function onClick(e: any) {
    e.stopPropagation();
    e.preventDefault();
    dispatchEvent(canvasElRef.current, e, 'click');
  }

  function onTouchStart(e: any) {
    e.stopPropagation();
    e.preventDefault();
    dispatchEvent(canvasElRef.current, e, 'touchstart');
  }

  function onTouchEnd(e: any) {
    e.stopPropagation();
    e.preventDefault();
    dispatchEvent(canvasElRef.current, e, 'touchend');
  }

  function onTouchMove(e: any) {
    e.stopPropagation();
    e.preventDefault();
    dispatchEvent(canvasElRef.current, e, 'touchmove');
  }

  const onCanvasReady = () => {
    console.log('onCanvasReady')
    Taro.createSelectorQuery()
      .select(`#${id}`)
      .fields({
        node: true,
        size: true,
      })
      .exec((res) => {
        const result = Array.isArray(res) ? res[0] : null;
        const { node, width, height } = result || {};
        if (!node) {
          return;
        }

        // H5 环境下可能拿不到 width 和 height，需要降级处理
        let canvasWidth = width;
        let canvasHeight = height;

        if (!canvasWidth || !canvasHeight) {
          if (isH5()) {
            // H5 环境下尝试从 DOM 元素获取尺寸
            const canvasElement = document.getElementById(id);
            if (canvasElement) {
              const rect = canvasElement.getBoundingClientRect();
              canvasWidth = rect.width || 300;
              canvasHeight = rect.height || 200;
            } else {
              // 如果都拿不到，使用默认尺寸
              canvasWidth = 300;
              canvasHeight = 200;
            }
          } else if (isWeapp()) {
            // 微信小程序环境下，如果拿不到尺寸，使用默认值
            canvasWidth = width || 300;
            canvasHeight = height || 200;
          } else {
            // 其他环境使用默认尺寸
            canvasWidth = 300;
            canvasHeight = 200;
          }
        }

        const {
          createImage,
          requestAnimationFrame,
          cancelAnimationFrame,
        } = node;

        // 根据环境获取 pixelRatio
        let pixelRatio = 1;
        if (isWeapp()) {
          pixelRatio = Taro.getSystemInfoSync().pixelRatio;
        } else if (isH5()) {
          pixelRatio = window.devicePixelRatio || 1;
        }

        node.width = canvasWidth * pixelRatio;
        node.height = canvasHeight * pixelRatio;

        const context = node.getContext('2d');

        const ffCanvas = createCanvas({
          width: canvasWidth,
          height: canvasHeight,
          pixelRatio,
          context,
          createImage,
          requestAnimationFrame,
          cancelAnimationFrame,
        });
        ffCanvas?.render();
        ffCanvasRef.current = ffCanvas;
      });
  };

  const createCanvas = ({
    width,
    height,
    pixelRatio,
    context,
    createImage,
    requestAnimationFrame,
    cancelAnimationFrame,
  }: any) => {
    if (!width || !height) {
      return null;
    }

    const canvasConfig: any = {
      pixelRatio,
      width,
      height,
      context,
      children: childrenRef.current,
      createImage,
      requestAnimationFrame,
      cancelAnimationFrame,
      useNativeClickEvent: false,
      isTouchEvent: (e: any) => e.type.startsWith('touch'),
      isMouseEvent: (e: any) => e.type.startsWith('mouse'),
    };

    // 只在微信小程序环境下使用 offscreenCanvas
    if (isWeapp() && typeof Taro.createOffscreenCanvas === 'function') {
      try {
        canvasConfig.offscreenCanvas = Taro.createOffscreenCanvas({ type: '2d', width, height });
      } catch (error) {
        // 如果 createOffscreenCanvas 失败，忽略错误继续执行
        console.warn('createOffscreenCanvas failed:', error);
      }
    }

    const canvas = new FFCanvas(canvasConfig);
    ffCanvasRef.current = canvas;
    canvasElRef.current = canvas.getCanvasEl();
    return canvas;
  };

  useEffect(() => {
    childrenRef.current = children;
    if (ffCanvasRef.current) {
      ffCanvasRef.current.update({ children });
    }
  }, [children]);

  useEffect(() => {
    return () => {
      if (ffCanvasRef.current) {
        ffCanvasRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (canvasRef.current) {
      setTimeout(onCanvasReady);
    }
  }, [canvasRef]);

  return (
    <Canvas
      canvasId={id}
      id={id}
      ref={canvasRef}
      type="2d"
      style="width:100%;height:100%;display:block;padding: 0;margin: 0;zIndex: 0;"
      onClick={onClick}
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    />
  );
}