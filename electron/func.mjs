/**
 * 封装核心功能，供electron和express主进程调用
 */
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import process from 'node:process'
import { exec } from 'node:child_process'
import xml2json from 'xml2json'
import crypto from 'node:crypto'

import { fileURLToPath } from 'node:url'

export const __filename = fileURLToPath(import.meta.url)
export const __dirname = path.dirname(__filename)

let tappDataPath = path.join(os.homedir(), '.JavSPN')
let tnewLine = '\n'
if (process.platform == 'win32') {
  tnewLine = '\r\n'
  tappDataPath = path.join(os.homedir(), 'AppData', 'Roaming', 'JavSPN')
}

if (process.platform == 'darwin') {
  tappDataPath = path.join(os.homedir(), 'Library/Preferences/JavSPN')
}

export const appDataPath = tappDataPath
export const newLine = tnewLine

let JavSPChildProcess = null
let JavSPAbortCtrl = null

function tempfile(ext = 'json') {
  return `temp-${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${ext}`
}

export function result(data = '', errCode = 200, errMsg = '') {
  if (typeof data == 'object') {
    return { errCode, errMsg, data: JSON.stringify(data) }
  }
  return { errCode, errMsg, data }
}

/**
 * 对字符串做md5哈希
 * @param {string} str
 * @returns
 */
export function md5(str) {
  const hash = crypto.createHash('md5').update(str).digest('hex')
  return result(hash)
}

/**
 * 读取文件，解析ini配置文件
 * @param {string} iniString
 * @returns
 */
export function parseIni(configFile) {
  return new Promise((resolve) => {
    fs.readFile(configFile, { encoding: 'utf-8' }, (err, iniString) => {
      if (err) return resolve(result('', 500, err))
      const lines = iniString.split(newLine)
      const ini = {}
      let dictName = ''
      for (const idx in lines) {
        const line = lines[idx]
        // 注释，跳过
        if (line == '') continue
        if (line.startsWith('#')) continue
        if (line.startsWith('[')) {
          // 一个小节，对应一个字典
          dictName = line.replace('[', '').replace(']', '').trim()
          ini[dictName] = {}
          continue
        }
        // 用等号分割
        const tmpStr = line.split('=')
        const key = tmpStr[0].trim()
        const value = tmpStr[1].trim()
        ini[dictName][key] = value
      }
      return resolve(result(ini))
    })
  })
}

/**
 * 将ini配置写入到文件中
 * @param {string} configFile
 * @param {Object} iniObject
 * @returns
 */
export function saveIni(configFile, iniObject) {
  return new Promise((resolve) => {
    if (!iniObject) return resolve(result('', 404, 'ini data is empty'))
    const lines = []
    for (const dictName in iniObject) {
      lines.push(`[${dictName}]`)
      for (const key in iniObject[dictName]) {
        const value = iniObject[dictName][key]
        lines.push(`${key} = ${value}`)
      }
    }
    const iniString = lines.join(newLine)
    fs.writeFile(configFile, iniString, { encoding: 'utf-8' }, (err) => {
      if (err) return resolve(result('', 500, err))
      return resolve(result())
    })
  })
}

/**
 * 检查filename同名的nfo、封面、同人画等
 * 去filename的basename，然后检查basename-suffix.ext是否存在，然后检查dirname/name是否存在
 * 优先返回suffix，否则如果name存在则返回name，如果都不存在则返回空
 * @param {string} filename
 * @param {string} suffix
 * @param {string} name
 * @returns 优先返回dirname/basename-suffix.ext，否则如果name存在则返回dirname/name，如果都不存在则返回空
 */
export function checkMediaFile(filename, suffix, name) {
  const baseName = path.basename(filename, path.extname(filename))
  const baseDir = path.dirname(filename)
  const aName = path.join(baseDir, baseName) + suffix
  const bName = path.join(baseDir, name)
  const aE = fs.existsSync(aName)
  const bE = fs.existsSync(bName)
  if (aE) return aName
  if (bE) return bName
  return ''
}

/**
 * 读取本地数据文件
 * @returns
 */
export function loadLibraryData() {
  return new Promise((resolve) => {
    const dataCacheFile = path.join(appDataPath, 'data.json')
    if (!fs.existsSync(dataCacheFile))
      return resolve(result('', 404, `${dataCacheFile} is not exists`))
    fs.readFile(dataCacheFile, { encoding: 'utf-8' }, (err, data) => {
      if (err) return resolve(result('', 500, err))
      return resolve(result(data))
    })
  })
}

/**
 * 保存本地数据文件
 * @param {string} dataJsonString
 */
export function saveLibraryData(dataJsonString) {
  return new Promise((resolve) => {
    const dataCacheFile = path.join(appDataPath, 'data.json')
    fs.writeFile(dataCacheFile, dataJsonString, { encoding: 'utf-8' }, (err) => {
      if (err) return resolve(result('', 500, err))
      return resolve(result())
    })
  })
}

/**
 * 读取nfo文件的数据，并且转成json对象
 * @param {string} nfoFile nfo文件的路径
 * @returns
 */
export function loadNfo(nfoFile) {
  return new Promise((resolve) => {
    fs.readFile(nfoFile, { encoding: 'utf-8' }, (err, nfoData) => {
      if (err) return resolve(result('', 500, err))
      const data = xml2json.toJson(nfoData)
      return resolve(result(data))
    })
  })
}

export function scan(libraryPath, JAV_EXEC) {
  return new Promise((resolve) => {
    if (JavSPChildProcess != null) return resolve(result('', 500, 'JavSP正在运行中...'))
    const dataCacheFile = path.join(appDataPath, tempfile())
    JavSPAbortCtrl = new AbortController()
    const { signal } = JavSPAbortCtrl
    const command = `${JAV_EXEC} -i=${libraryPath} --only-scan --data-cache-file=${dataCacheFile}`
    console.log(command)
    JavSPChildProcess = exec(command, { signal }, () => {
      // 重置子进程，以供下次调用
      JavSPChildProcess = null
      JavSPAbortCtrl = null
      // 读取缓存文件
      fs.readFile(dataCacheFile, { encoding: 'utf-8' }, (err, data) => {
        // 删除临时文件
        fs.unlink(dataCacheFile, () => {})
        if (err) return resolve(result('', 500, err))
        if (!data) return resolve(result())
        const movies = JSON.parse(data)
        // 识别是否有Nfo，poster，fanart
        const l = movies.length
        for (let i = 0; i < l; i++) {
          const file = movies[i].files[0]
          movies[i].nfo_file = checkMediaFile(file, '.nfo', 'movie.nfo')
          movies[i].poster_file = checkMediaFile(file, '-poster.jpg', 'poster.jpg')
          movies[i].fanart_file = checkMediaFile(file, '-fanart.jpg', 'fanart.jpg')
        }
        return resolve(result(movies))
      })
    })
  })
}

/**
 * 将movieData格式化成Json字符串后写入临时文件
 * @param {any[]} data
 */
export function scrape(jsonString, JAV_EXEC) {
  return new Promise((resolve) => {
    if (JavSPChildProcess != null) return resolve(result('', 500, 'JavSP正在运行中...'))
    const dataCacheFile = path.join(appDataPath, tempfile())
    // 将要刮削的数据写入临时文件
    fs.writeFileSync(dataCacheFile, jsonString, { encoding: 'utf-8' })
    JavSPAbortCtrl = new AbortController()
    const { signal } = JavSPAbortCtrl
    const command = `${JAV_EXEC} -i=${appDataPath} --only-fetch --data-cache-file=${dataCacheFile}`
    exec(command, { signal }, () => {
      // 重置子进程，以供下次调用
      JavSPChildProcess = null
      JavSPAbortCtrl = null
      // 读取缓存文件
      fs.readFile(dataCacheFile, { encoding: 'utf-8' }, (err, data) => {
        // 删除临时文件
        fs.unlink(dataCacheFile, () => {})
        if (err) return resolve(result('', 500, err))
        if (!data) return resolve(result())
        return resolve(data)
      })
    })
  })
}
