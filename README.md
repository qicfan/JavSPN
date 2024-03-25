![icon](https://github.com/qicfan/JavSPN/assets/758655/2deb77c7-c3ac-4745-9f2b-05ae5fca581f)
# JavSPN
基于[JavSP](https://github.com/Yuukiy/JavSP)的小姐姐刮削和媒体文件管理器，图形界面基于Electron

## 功能
- [x] 多文件夹管理（可以手动区分有无码之类的）
- [x] 影片扫描（汇总多文件夹数据），基于JavSP
- [x] 自动识别已经刮削过的影片，不会重复刮削
- [x] 刮削，基于JavSP
- [x] 详情查看（显示nfo文件内容和图片）
- [x] JavSP配置项的可视化管理（只开放了一部分常用配置项）
- [x] 多语言支持（目前支持简体中文和English）
- [ ] 文件重命名（根据JavSP命名规则配置项）
- [ ] 文件整理到其他目录
- [ ] 文件筛选（按照待刮削，已刮削等维度做筛选），根据番号搜索等
- [ ] nfo内容编辑（添加tag，演员，修改错误信息等）
- [ ] 视频文件解析（分辨率，码率，声道，字幕等）
- [ ] 检查升级
- [ ] Docker支持

### Docker支持的构思
 - 使用Express代替Electon支持web ui
 - JavSP直接用源码执行
 - 媒体库文件夹映射到Docker中，将扫描媒体库改为监视媒体库
 - 下载器下载完成后，JavSPN监控到文件修改，会自动触发JavSP刮削

## 源码开发或打包

1. 请确保已安装 Node
```
git clone https://github.com/qicfan/JavSPN.git
cd JavSPN
npm install
```
2. 自行下载最新版本的[JavSP](https://github.com/Yuukiy/JavSP/releases)，放入根目录下的resources/JavSP/目录下，确保resources/JavSP/JavSP.exe存在，其他平台同理
3. release包已内含对应版本的JavSP，无需手动下载

### 开发调试
```
npm run dev
```

### 编译打包
```
npm run build
```

### 界面预览
![主界面](https://github.com/qicfan/JavSPN/assets/758655/de8f4e88-1d90-43f5-b030-f7c3ad987045)
![设置](https://github.com/qicfan/JavSPN/assets/758655/ae3378ae-7196-4746-a298-c76f54222154)

