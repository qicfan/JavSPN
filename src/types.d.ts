type scanCallback = (value: any) => void
type resultObj = { data: string; errCode: number; errMsg: string }
interface Window {
  electronAPI: {
    gersion(): Promise<resultObj>
    gname(): Promise<resultObj>
    gpath(): Promise<resultObj>
    md5(str: string): Promise<resultObj>
    openDirectory(): Promise<resultObj>
    loadIni(): Promise<resultObj>
    saveIni(obj: any): Promise<resultObj>
    loadLibraryData(): Promise<resultObj>
    saveLibraryData(items: string): Promise<resultObj>
    scan(p: string): Promise<resultObj>
    scrape(movies: string): Promise<resultObj>
    openSetting(): Promise<resultObj>
    LoadNfo(path: string): Promise<resultObj>
    editLibraryPath(): void
    onEditLibraryPath(callback: scanCallback): void
  }
}

type Movie = {
  dvdid: string
  cid: string
  info: {
    title: string
    [key: string]: any
  }
  files: string[]
  nfo_file: string
  poster_file: string
  fanart_file: string
  guid: string
  [key: string]: any
}

type DataItem = {
  code: string
  cid: string
  name: string
  files: string[]
  nfo: string
  poster: string
  fanart: string
  loading: boolean
  mask: boolean
  cn: boolean
  id: string // 由code和file_path组合后生成md5，文件被移动后重新生成；用来去重。
}
type DataItemDict = { [key: string]: DataItem }

interface MovieNfo {
  title: string
  originaltitle: string
  rating: string
  plot: string
  runtime: string
  genre: string[]
  tag: string[]
  country: string
  premiered: string
  studio: string
  actor: { name: string }[]
  [key: string]: any
}
