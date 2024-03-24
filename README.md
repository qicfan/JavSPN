![icon](https://github.com/qicfan/JavSPN/assets/758655/2deb77c7-c3ac-4745-9f2b-05ae5fca581f)
# JavSPN
基于[JavSP](https://github.com/Yuukiy/JavSP)的小姐姐刮削和媒体文件管理器，图形界面基于Electron

## 功能
- [x] 多文件夹管理（可以手动区分有无码之类的）
- [x] 影片扫描（汇总多文件夹数据），基于JavSP
- [x] 刮削，基于JavSP
- [x] 详情查看（显示nfo文件内容和图片）
- [x] JavSP配置项的可视化管理（只开放了一部分常用配置项）
- [x] 多语言支持（目前支持简体中文和English）
- [ ] 文件重命名（根据JavSP命名规则配置项）
- [ ] 文件整理到其他目录
- [ ] nfo内容编辑（添加tag，演员，修改错误信息等）
- [ ] 视频文件解析（分辨率，码率，声道，字幕等）

## 源码开发或打包

1. 请确保已安装 Node
```
git clone https://github.com/qicfan/JavSPN.git
cd JavSPN
npm install
```
2.  自行下载最新版本的[JavSP](https://github.com/Yuukiy/JavSP/releases)，放入根目录下的resources/JavSP/目录下，确保resources/JavSP/JavSP.exe存在，其他平台同理
3. release包已内涵对应版本的JavSP，无需手动下载

### 开发调试
```
npm run dev
```

### 编译打包
```
npm run build
```
