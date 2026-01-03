---
title: 关于录音 Recorder.js
pubDate: 2021-09-21 15:51:57
tags:
    - js
cover: /posts/Recorder-js.png
description: 看看，学学，又做做
---

![](/posts/Recorder-js.png)

> 看，学，做

<!-- more -->

### 关于目录

- 关于关键 Api
- 关于关键代码实现
- 关于 audio  标签的细节

### 关于实现所需 API

- navigator.mediaDevices.getUserMedia() 获取客户端录音流
- AudioContext 音频处理对象
  - AudioContext.createMediaStreamSource(stream) 关联录音流
  - AudioContext.createScriptProcessor(option) 获取音频流

### 关于关键代码实现

首要必须是获取客户端录音权限，并给予一些错误提示

```javascript
/*
  @type           constraints = { audio: true, video: true }
  @description    一个 MediaStreamConstraints 对象，
                  指定了请求的媒体类型和相对应的参数。
*/
navigator.mediaDevices.getUserMedia([constraints])
.(function(stream) {
  /* 使用这个 stream stream */
  const context = new AudioContext({ sampleRate: 48000 });
  const audioInput = context.createMediaStreamSource(stream);
  const recorder = context.createScriptProcessor(4096, 1, 1);
})
.catch(function(err) {
  /*
    处理error
    ------------
    可能有的错误
    AbortError              [中止错误]
    NotAllowedError         ［拒绝错误］
    NotFoundError           ［找不到错误］
    NotReadableError        ［无法读取错误］
    OverConstrainedError    ［无法满足要求错误］
    SecurityError           ［安全错误］
    TypeError               ［类型错误］
  */
  switch(err.message || err.name){
    case 'PERMISSION_DENIED':
    case 'PermissionDeniedError':
      alert('用户拒绝提供信息。');
      break;
    case 'NOT_SUPPORTED_ERROR':
    case 'NotSupportedError':
      alert('浏览器不支持硬件设备。');
      break;
    case 'MANDATORY_UNSATISFIED_ERROR':
    case 'MandatoryUnsatisfiedError':
      alert('无法发现指定的硬件设备。');
      break;
    default:
      alert('无法打开麦克风。异常信息:' + (err.code || err.name));
      break;
  }
});
```

有权限录音流后，目前所见的常用做法，是放入一个对象内，
对象有些根据所传入的配置要求初始化，并初始化缓存数据，
最后暴露出简单的方法

#### 对象初始化

```javascript

class Recorder{
  // 初始化 config 与需要的数据流
  constructor(stream, config, callback){
    // 配置初始化
    this.callback   = callback
    this.sampleBits = config.sampleBits || 16
    this.sampleRate = config.sampleRate || 16000
    this.context    = new AudioContext({ sampleRate: 48000 })
    this.audioInput = this.context.createMediaStreamSource(stream)
    this.recorder   = this.context.createScriptProcessor(4096,1,1)

    // Audio Source 数据缓存
    this.size             = 0
    this.buffer           = []
    this.inputSampleRate  = 48000
    this.inputSampleBits  = 16
    this.outputSampleRate = this.sampleRate
    this.outputSampleBits = this.sampleBits
    this.objUrl           = null
  }
}

```

`Tip：如果 AudioContext 对象无配置采样率，则会根据系统变化，已知 Mac 默认是 44100， Window 默认是 48000`

#### 编写内置工具函数

内置需要一些压缩与输出的算法工具函数

- clear() 清空缓存数据 or 上一次数据
- input（） 存储过程数据
- compress（） 压缩算法
- encode（） 输出格式，可自行百度获取

```javascript
class Recorder{
  /* ... */
  /* 清空数据 */
  claer(){
    this.buffer = [];
    this.size   = 0;
  }
  /* 数据缓存 */
  input(inputBuffer){
    this.buffer.push(new Float32Array(inputBuffer));
    this.size += inputBuffer.length;
  }
  /* 数据合并压缩 */
  compress(){
    // 合并
    const data = new Float32Array(this.size);
    for (let i = 0, offset = 0; i < this.buffer.length; i++) {
      data.set(this.buffer[i], offset);
      offset += this.buffer[i].length;
    }
    //压缩
    const compression = this.inputSampleRate / this.outputSampleRate;
    const length = data.length / compression;
    const result = new Float32Array(length);
    for (let i = 0; i < length; i += compression) {
      result.push(this.buffer[i]);
    }
    return result
  }
}
```

`encode()` 方法有几种，主要是为了输出不同的格式，以满足不同的需求，
这里只描绘一下 Wav

`这里也是网上拿下来的`

```javascript
class Recorder {
  encodeWAV(){
    const sampleRate = Math.min(this.inputSampleRate, this.outputSampleRate);
    const sampleBits = Math.min(this.inputSampleBits, this.outputSampleBits);
    const bytes = this.compress();
    const dataLength = bytes.length * (sampleBits / 8);
    const buffer = new ArrayBuffer(44 + dataLength);
    const data = new DataView(buffer);
    const channelCount = 1; //单声道
    let offset = 0;
    const writeString = function (str: string) {
      for (let i = 0; i < str.length; i++) {
        data.setUint8(offset + i, str.charCodeAt(i));
      }
    };
    // 资源交换文件标识符
    writeString('RIFF');
    offset += 4;
    // 下个地址开始到文件尾总字节数,即文件大小-8
    data.setUint32(offset, 36 + dataLength, true);
    offset += 4;
    // WAV文件标志
    writeString('WAVE');
    offset += 4;
    // 波形格式标志
    writeString('fmt ');
    offset += 4;
    // 过滤字节,一般为 0x10 = 16
    data.setUint32(offset, 16, true);
    offset += 4;
    // 格式类别 (PCM形式采样数据)
    data.setUint16(offset, 1, true);
    offset += 2;
    // 通道数
    data.setUint16(offset, channelCount, true);
    offset += 2;
    // 采样率,每秒样本数,表示每个通道的播放速度
    data.setUint32(offset, sampleRate, true);
    offset += 4;
    // 波形数据传输率 (每秒平均字节数) 单声道×每秒数据位数×每样本数据位/8
    data.setUint32(offset, channelCount * sampleRate * (sampleBits / 8), true);
    offset += 4;
    // 快数据调整数 采样一次占用字节数 单声道×每样本的数据位数/8
    data.setUint16(offset, channelCount * (sampleBits / 8), true);
    offset += 2;
    // 每样本数据位数
    data.setUint16(offset, sampleBits, true);
    offset += 2;
    // 数据标识符
    writeString('data');
    offset += 4;
    // 采样数据总数,即数据总大小-44
    data.setUint32(offset, dataLength, true);
    offset += 4;
    // 写入采样数据
    if (sampleBits === 8) {
      for (let i = 0; i < bytes.length; i++, offset++) {
        const s = Math.max(-1, Math.min(1, Number(bytes[i])));
        const val = s < 0 ? s * 0x8000 : s * 0x7fff;
        val = 255 / (65535 / (val + 32768));
        data.setInt8(offset, val);
      }
    } else {
      for (let i = 0; i < bytes.length; i++, offset += 2) {
        const s = Math.max(-1, Math.min(1, Number(bytes[i])));
        data.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7fff, true);
      }
    }
    return new Blob([data], { type: 'audio/wav' });
  }
}

```

#### 编写可暴露的数据

- start() 开始记录录音数据
- stop() 停止记录录音数据
- getAudioUrl() 获取录音数据

```javascript
class Recorder {
  /* ... */
  // 开始
  start(){
    console.log('recorder start');
    this.audioInput.connect(this.recorder);
    this.recorder.connect(this.context.destination);
    this.recorder.onaudioprocess = e => {
      const inputBuffer = e.inputBuffer.getChannelData(0);
      this.input(inputBuffer);
    };
  }
  // 停止
  stop(){
    this.recorder.disconnect();
  }
  // 获取可播放 url
  getAudioUrl(){
    const url = this.encodeWAV();
    if (this.objUrl) {
      URL.revokeObjectURL(this.objUrl);
    }
    this.objUrl = URL.createObjectURL(wav);
    return this.objUrl
  }
}
```

``实时传送录音数据流``

- 需要进行一次压缩
- 需要一个回调函数

```javascript
class Recorder {
  /* ... */
  sendData(){
    const compression = this.inputSampleRate / this.outputSampleRate;
    const length = inputBuffer.length / compression;
    const result = new Float32Array(length);
    let index = 0,
      j = 0;
    while (index < length) {
      result[index] = inputBuffer[j];
      j += compression;
      index++;
    }
    const dataLength = result.length * (16 / 8);
    const buffer = new ArrayBuffer(dataLength);
    const blockData = new Uint8Array(buffer);
    blockData && this.callback  && this.callback(blockData)
  }
}
```

### 关于小结

``尚未解决的问题``

createScriptProcessor 已经不推荐使用，然在大部分浏览器内尚可运行，
且新的录音 Api 尚未有新鲜可循的 blog 文教授

本文大致才是参照，网上诸多老旧 blog 以及已有的插件组成的，大致可以看作是一片缝合水文，
本文目的在于记录自己开发前置需求中的一些思考，以及找寻到的 blog

感谢阅读

---

参照文章

- [jqpeng 的技术记事本][https://www.cnblogs.com/xiaoqi/p/6993912.html]
- [Recorder 用于 html5 录音][https://github.com/xiangyuecn/Recorder]
- [使用 html5 在网页录音和保存][http://luoma.pro/Content/Detail/503?parentId=1]

