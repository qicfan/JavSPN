// 包装API
export enum RESULT_CODE {
  OK = 200,
  NOT_FOUND = 404,
  ERROR = 500
}

export const NO_CODE = '无法识别番号'

let api
if (window.electronAPI) {
  // 如果在electron环境下
  api = window.electronAPI
} else {
  // 在node express环境下，接口全部改为发送http请求
  api = {
    gersion: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    gname: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    gpath: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    md5: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    openDirectory: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    loadIni: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    saveIni: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    loadLibraryData: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    saveLibraryData: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    scan: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    scrape: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    openSetting: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    LoadNfo: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    editLibraryPath: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    },
    onEditLibraryPath: (): Promise<resultObj> => {
      return new Promise((resolve) => resolve({ data: '', errCode: 200, errMsg: '' }))
    }
  }
}
export const API = api
