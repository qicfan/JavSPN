import { ref } from 'vue'

import { defineStore } from 'pinia'

export const useLibraryStore = defineStore('library', () => {
  const libraryListIds = ref(<string[]>[])
  const libraryData = ref(<DataItemDict>{})
  const initLoading = ref(true)
  const ignores = ref(<string[]>[])

  // 从localstorage中初始化
  const storedIgnoreJson = window.localStorage.getItem('library-ignores')
  if (storedIgnoreJson) {
    const storedIgnoreData = JSON.parse(storedIgnoreJson)
    if (storedIgnoreData) {
      ignores.value = storedIgnoreData
    }
  }

  const genId = async (dataItem: DataItem | Movie | any) => {
    let nameList: string[] = []
    if (dataItem.code) {
      nameList = [dataItem.code].concat(dataItem.files)
    }
    if (dataItem.dvdid) {
      nameList = [dataItem.dvdid].concat(dataItem.files)
    }
    const nameString = nameList.join('')
    return window.electronAPI.md5(nameString)
  }

  const baseName = (url: string) => {
    const userAgent = window.navigator.userAgent
    const isWindows = /Windows/.test(userAgent)
    let delimiter = '/'
    if (isWindows) {
      delimiter = '\\'
    }
    const urlMap = url.split(delimiter)
    return urlMap[urlMap.length - 1]
  }

  const loadLocalLibrary = () => {
    window.electronAPI.onLoadLibraryDataFinish(async (data: any[]) => {
      if (!data.length) return (initLoading.value = false)
      for (const idx in data) {
        const item = data[idx]
        const id = item.id
        libraryListIds.value.unshift(id)
        libraryData.value[id] = item
      }
      initLoading.value = false
    })
    window.electronAPI.loadLibraryData()
  }

  const movieToDataItem = (movie: Movie, id?: string) => {
    let guid: string = ''
    if (movie.guid) {
      guid = movie.guid
    } else if (id != undefined) {
      guid = id
    }
    return {
      code: movie.dvdid,
      cid: movie.cid,
      name: movie.info ? movie.info.title : baseName(movie.files[0]),
      files: movie.files,
      nfo: movie.nfo_file,
      poster: movie.poster_file,
      fanart: movie.fanart_file,
      loading: false,
      mask: false,
      cn: false,
      id: guid
    }
  }

  const dataItemToMovie = (dataItem: DataItem): Movie => {
    return {
      dvdid: dataItem.code,
      cid: dataItem.cid,
      files: dataItem.files,
      info: { title: '' },
      nfo_file: dataItem.nfo,
      poster_file: dataItem.poster,
      fanart_file: dataItem.fanart,
      guid: dataItem.id
    }
  }

  const updateLibrary = (p: string) => {
    return new Promise((resolve) => {
      window.electronAPI.onScanFinish(async (data: any) => {
        if (!data.length) resolve(true)
        for (const idx in data) {
          const item: Movie = data[idx]
          const id = await genId(item)
          if (libraryListIds.value.includes(id) || ignores.value.includes(id)) continue
          libraryListIds.value.unshift(id)

          libraryData.value[id] = movieToDataItem(item, id)
        }
        resolve(true)
      })
      window.electronAPI.scan(p)
    })
  }

  /**
   * 忽略一个条目，下次扫描时会跳过他
   * @param id
   */
  const ignoreDataItem = (id: string) => {
    if (ignores.value.includes(id)) return
    ignores.value.push(id)
    // 从数据列表中删除
    const idx = libraryListIds.value.indexOf(id)
    if (idx > -1) {
      libraryListIds.value.splice(idx, 1)
      delete libraryData.value[id]
    }
    window.localStorage.setItem('library-ignores', JSON.stringify(ignores.value))
  }

  // 修改番号
  const saveCode = (id: string, code: string) => {
    libraryData.value[id].code = code
  }

  const saveLibraryData = () => {
    return new Promise((resolve) => {
      const storeItems: DataItem[] = []
      libraryListIds.value.forEach((id: string) => {
        const need =
          libraryData.value[id].code &&
          !libraryData.value[id].nfo &&
          libraryData.value[id].code != '无法识别番号'
        if (need) return
        storeItems.push(libraryData.value[id])
      })
      window.electronAPI.saveLibraryData(JSON.stringify(storeItems))
      resolve(true)
    })
  }

  /**
   * 刮削
   * 1. 组合未刮削并且包含code的条目
   * 2. 生成JavSP可以识别的MovieList，写入临时文件
   * 3. 调用JavSP开始刮削
   * 4. 读取刮削完成的临时文件
   * 5. 根据ID更新数据
   * 6. 持久化
   */
  const scrape = () => {
    return new Promise((resolve) => {
      const scrapeItems: Movie[] = []
      libraryListIds.value.forEach((id: string) => {
        const need =
          libraryData.value[id].code &&
          !libraryData.value[id].nfo &&
          libraryData.value[id].code != '无法识别番号'
        if (!need) return
        libraryData.value[id].loading = true // 要操作的数据触发oading状态
        scrapeItems.push(dataItemToMovie(libraryData.value[id]))
      })
      window.electronAPI.onSrapeFinish((data: string) => {
        console.log('scrape-finish call ok:', data)
        if (!data) resolve(true)
        const movies: Movie[] = JSON.parse(data)
        movies.forEach(async (mov: Movie) => {
          const id = mov.guid
          const newId = await genId(mov)
          const dataItem = movieToDataItem(mov)
          if (id == newId) {
            libraryData.value[id] = dataItem
          } else {
            // 需要变更Id
            libraryData.value[newId] = dataItem
            const idx = libraryListIds.value.indexOf(id)
            if (idx > -1) {
              libraryListIds.value.splice(idx, 1)
              delete libraryData.value[id]
            }
            libraryListIds.value.push(newId)
          }
        })
        resolve(true)
      })
      window.electronAPI.scrape(JSON.stringify(scrapeItems))
    })
  }

  return {
    libraryListIds,
    libraryData,
    initLoading,
    loadLocalLibrary,
    ignoreDataItem,
    updateLibrary,
    saveCode,
    scrape,
    saveLibraryData
  }
})
