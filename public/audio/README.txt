背景音乐上传说明
================

1. 把 mp3 / m4a / ogg 等浏览器可播放的音乐文件放到：
   public/audio/tracks/

2. 然后编辑 public/audio/playlist.json，把文件加入对应歌单。

示例：
{
  "autoplay": true,
  "defaultVolume": 0.18,
  "playlists": [
    {
      "name": "Focus",
      "tracks": [
        { "title": "Song 01", "src": "/audio/tracks/song-01.mp3" },
        { "title": "Song 02", "src": "/audio/tracks/song-02.mp3" }
      ]
    },
    {
      "name": "Night",
      "tracks": [
        { "title": "Song 03", "src": "/audio/tracks/song-03.mp3" }
      ]
    }
  ]
}

说明：
- defaultVolume 建议 0.12 ~ 0.22，当前默认 0.18。
- 歌曲会按当前歌单顺序播放，播完自动下一首并循环整个歌单。
- 可以建立多个歌单，网页右下角可直接切换。
- 浏览器通常禁止“带声音的无交互自动播放”。页面会先尝试自动播放；若被拦截，用户第一次点击/按键时会自动解锁播放。
- 文件名建议只使用英文字母、数字、短横线，避免部署平台对中文或空格路径处理不一致。
