type scanCallback = (value: any) => void
interface Window {
  electronAPI: {
    gersion()
    gname()
    gpath()
    md5(str: string)
    openDirectory()
    scan(string)
    onScanFinish(callback: scanCallback)
    loadIni()
    onLoadIniFinish(callback: scanCallback)
    loadLibraryData()
    onLoadLibraryDataFinish(callback: scanCallback)
    scrape(movies: string)
    onSrapeFinish(callback: scanCallback)
    saveLibraryData(items: string)
    openSetting()
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