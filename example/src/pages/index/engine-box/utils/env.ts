import { 
  getEnv,
  ENV_TYPE,
} from '@tarojs/taro';

export function isH5() {
  return getEnv() === ENV_TYPE.WEB;
}

export function isWeapp() {
  return getEnv() === ENV_TYPE.WEAPP;
}