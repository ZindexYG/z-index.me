---
title: 关于 Audio 自定义样式
date: 2021-03-05 19:50:42
tags:
    - JavaScript
    - React
    - css
cover: /images/accessible-js-Library-Development.jpg
description: 是的，再不看书，书里的知识就过时了
---

![](/images/Audio_Diy_Style.png)

> 菜还是那道菜，料不一样了

<!-- more -->

- 前置
- 关于 css 来设置 audio 样式
- 关于 JavaScript 来设置样式
- 关于 React 写一个自定义的 Audio 组件
- 总结

### 前置

- 大致了解 audio [属性][mdn_audio_attributes]
- 懂一点点 CSS
- 懂一点点 JS 与 audio [事件][mdn_audio_events]
- 懂一点点 React

### 关于 css 来设置 audio 样式

引用 MDN 中的话 [使用 CSS 设置样式][mdn_audio_css]

- audio 元素没有自带的固有视觉样式，除非如果声明了 controls 属性，则会显示浏览器的默认控件。
- 默认控件的 display 的默认值为 inline。将该值设为 block 通常会对定位和布局有好处，除非你想将控件放在文本块或类似元素中。
- 你可以使用作用于整个控件的属性来为其设置样式。例如可用 border、border-radius、padding, margin 等等。但你不能设置音频播放器中的单个组件（如改变按钮大小、改变图标或字体等）。控件在不同的浏览器中也有所不同。
- 如果在跨浏览器中得到一致的外观和体验，你需要创建自定义控件；自定义控件可以根据你的需求任意设置样式，还可以使用 JavaScript 和 HTMLMediaElement API 来设置更多功能。
- [视频播放器样式基础][video_player_styling_basics] 提供了一些有用的样式技术，这篇文章围绕 video 而写，但大部分都可以用于 audio。

总上所述，关键就是在于 css 可操作性相对少，且会产生关于兼容性的问题，个人也仅作为

### 关于 JavaScript 来设置 audio 样式

说是 JavaScript ，依然也需要配合到 css 里面来的（不然不好看

1. 准备一个,最简单的带有 audio 的 html，并把布置好布局
2. 关键 JavaScript 代码
   - 2.1 准备参数
   - 2.2 播放 && 暂停 && 进度更新
   - 2.3 拖动进度条
3. 配合 css 食用

4. 准备一个,最简单的带有 audio 的 html，并把布置好布局

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Audio DIY</title>
    <link rel="stylesheet" type="text/css" href="./style.css" />
  </head>
  <body>
    <audio
      id='audio'
      src='https://interactive-examples.mdn.mozilla.net/media/cc0-audio/t-rex-roar.mp3''
      preload='metadata' ></audio>
    <div class="audio-container">
      <div class="audio-toggle" id="control">
        播放
      </div>
      <div class="audio-progress-box" id='progress'>
        <span class="progressDot" id="control-dot"></span>
        <div class="audio-progress-bar" id="control-progress"></div>
      </div>
      <div class="audio-time" id="‘time’">
        <span id='current'>00:00</span> / <span id='duration'>00:00</span>
      </div>
    </div>
  </body>
  <script src="./audio.js"></script>
</html>

```

2.1 准备参数

```JavaScript
const Audio              = document.querySelector('#audio');
const contorl            = document.querySelector('#control');
const contorlDot         = document.querySelector('#control-dot');
const contorlProgress    = document.querySelector('#control-progress');
const contorlProgressBox = document.querySelector('#progress');
const current            = document.querySelector('#current');
const duration           = document.querySelector('#duration');

// 工具函数
// 时分秒转换
function transTime(value) {
  var time = '';
  var h = parseInt(`${value / 3600}`);
  value %= 3600;
  var m = parseInt(`${value / 60}`);
  var s = parseInt(`${value % 60}`);
  if (h > 0) {
    time = formatTime(h + ':' + m + ':' + s);
  } else {
    time = formatTime(m + ':' + s);
  }

  return time;
}
// 补零
function formatTime(value) {
  var time = '';
  var s = value.split(':');
  var i = 0;
  for (; i < s.length - 1; i++) {
    time += s[i].length === 1 ? '0' + s[i] : s[i];
    time += ':';
  }
  time += s[i].length === 1 ? '0' + s[i] : s[i];

  return time;
}
```

2.2 播放 && 暂停 && 进度更新

```JavaScript
contorl.addEventListener('click', e => {
  if (e.target.innerText === '播放') {
    e.target.innerText = '暂停';
    Audio.play();
  } else {
    e.target.innerText = '播放';
    Audio.pause();
  }
});

Audio.addEventListener('loadedmetadata', e => {
  duration.innerText = transTime(e.target.duration);
});

Audio.addEventListener('timeupdate', e => {
  let value = e.target.currentTime / Audio.duration;
  current.innerText = transTime(e.target.currentTime);
  contorlProgress.style.width = `${value * 100}%`;
  contorlDot.style.left = `${value * 100}%`;
});

Audio.addEventListener('ended', e => {
  contorlProgress.style.width = '0%';
  contorlDot.style.left = '0%';
  contorl.innerText = '播放';
});
```

2.3 拖动进度条

```JavaScript
// 鼠标按下
contorlDot.addEventListener('mousedown', down, false);
contorlDot.addEventListener('touchstart', down, false);

// 开始拖动
document.addEventListener('mousemove', move, false);
document.addEventListener('touchmove', move, false);

// 拖动结束
document.addEventListener('mouseup', end, false);
document.addEventListener('touchend', end, false);

const position  = {
  oriOffestLeft : 0, // 移动开始时进度条的点距离进度条的偏移值
  oriX          : 0, // 移动开始时的x坐标
  maxLeft       : 0, // 向左最大可拖动距离
  maxRight      : 0, // 向右最大可拖动距离
};
let flag        = false; // 标记是否拖动开始

const down = event => {
  if (!Audio.pause || Audio.currentTime !== 0) {
    flag = true;

    position.oriOffestLeft = contorlDot.offsetLeft;
    position.oriX          = event.touches ?
                             event.touches[0].clientX :
                             event.clientX;
    // 要同时适配mousedown和touchstart事件
    position.maxLeft       = position.oriOffestLeft;
    // 向左最大可拖动距离
    position.maxRight      = contorlProgressBox.offsetWidth -
                             position.oriOffestLeft; // 向右边最大可拖动距离

    if (event && event.preventDefault) event.preventDefault();
    else event.returnValue = false;

    if (event && event.stopPropagation) event.stopPropagation();
    else window.event.cancelBubble = true;
  }
};
const move = event => {
  if (flag) {
    let clientX = event.touches ? event.touches[0].clientX : event.clientX;
    let length  = clientX - position.oriX;
    if (length > position.maxRight) {
      length = position.maxRight;
    } else if (length < -position.maxLeft) {
      length = -position.maxLeft;
    }

    let pgsWidth = parseFloat(
      window.getComputedStyle(contorlProgressBox, null).width.replace('px'),
    );

    let rate = (position.oriOffestLeft + length) / pgsWidth;

    Audio.currentTime = Audio.duration * rate;
  }
};

const end = () => {
  flag = false;
};
```

### 关于 React 写一个自定义的 Audio 组件

框架加持会让组件更加简单，chch

```JavaScript
import React, {
  useRef,
  useLayoutEffect,
  useState,
  useEffect,
  MouseEvent,
} from 'react';
import './Audio.css';


function transTime(value: number) {
  var time = '';
  var h = parseInt(`${value / 3600}`);
  value %= 3600;
  var m = parseInt(`${value / 60}`);
  var s = parseInt(`${value % 60}`);
  if (h > 0) {
    time = formatTime(h + ':' + m + ':' + s);
  } else {
    time = formatTime(m + ':' + s);
  }

  return time;
}

function formatTime(value: string) {
  var time = '';
  var s = value.split(':');
  var i = 0;
  for (; i < s.length - 1; i++) {
    time += s[i].length === 1 ? '0' + s[i] : s[i];
    time += ':';
  }
  time += s[i].length === 1 ? '0' + s[i] : s[i];

  return time;
}

export const Audio: React.FC<any> = props => {
  const { src, width = '80%', height = '30px' } = props;

  const audioRef                      = useRef<HTMLAudioElement>(null);
  const barBgRef                      = useRef<HTMLDivElement>(null);
  const barRef                        = useRef<HTMLDivElement>(null);
  const dotRef                        = useRef<HTMLSpanElement>(null);
  const uidRef                        = useRef<string>(uniqueId());

  const [toggle, setToggle]           = useState<boolean>(true);
  const [progress, setProgress]       = useState<number>(0);
  const [duration, setDuration]       = useState<string>('00 : 00');
  const [currentTime, setCurrentTime] = useState<string>('00:00');

  useLayoutEffect(() => {
    if (audioRef.current && src) {
      audioRef.current.addEventListener('play', (e: Event) => {
        const pid    = (e.target as HTMLAudioElement).getAttribute('pid');
        const audios = document.querySelectorAll('audio');
        console.log('pid', pid);
        audios.forEach((element, index) => {
          if (element.getAttribute('pid') === pid) return;
          element.pause();
        });
      });

      audioRef.current.addEventListener('loadedmetadata', e => {
        const duration = transTime(
          (e.target as HTMLAudioElement).duration as number,
        );
        setDuration(duration);
      });
      audioRef.current.addEventListener('play', _res => {
        setToggle(false);
      });
      audioRef.current.addEventListener('pause', () => {
        setToggle(true);
      });
      audioRef.current.addEventListener('timeupdate', e => {
        let value =
          (e.target as HTMLAudioElement).currentTime /
          (audioRef.current as HTMLAudioElement).duration;
        setProgress(value * 100);
        setCurrentTime(transTime((e.target as HTMLAudioElement).currentTime));
        // console.log('timeupdate res', res.target.currentTime);
      });
    }
    return () => {};
  }, [src]);

  useEffect(() => {
    if (dotRef.current && src) {
      const position  = {
        oriOffestLeft : 0, // 移动开始时进度条的点距离进度条的偏移值
        oriX          : 0, // 移动开始时的x坐标
        maxLeft       : 0, // 向左最大可拖动距离
        maxRight      : 0, // 向右最大可拖动距离
      };
      let flag        = false; // 标记是否拖动开始

      // 按下
      const down = (event: TouchEvent | MouseEvent) => {
        if (!audioRef.current?.paused || audioRef.current.currentTime !== 0) {
          flag                   = true;
          position.oriOffestLeft = dotRef.current?.offsetLeft ?? 0; // 初始位置
          position.oriX          = position.oriX =
            event instanceof TouchEvent
              ? event.touches[0].clientX
                                 : event.clientX; // 要同时适配mousedown和touchstart事件
          position.maxLeft       = position.oriOffestLeft; // 向左最大可拖动距离
          position.maxRight      =
            barBgRef.current?.offsetWidth ?? 0 - position.oriOffestLeft; // 向右边最大可拖动距离

          if (event && event.preventDefault) {
            event.preventDefault();
          } else {
            (event as TouchEvent).returnValue = false;
          }

          // 禁止事件冒泡
          if (event && event.stopPropagation) {
            event.stopPropagation();
          }
        }
      };
      // 移动
      const move = (event: TouchEvent | MouseEvent) => {
        if (flag && barBgRef.current) {
          let clientX =
                        event instanceof TouchEvent
                        ? event.touches[0].clientX
                        : event.clientX; // 要同时适配mousemove和touchmove事件

          let length  = clientX - position.oriX;
          if (length > position.maxRight) {
            length = position.maxRight;
          } else if (length < -position.maxLeft) {
            length = -position.maxLeft;
          }
          // let pgsWidth = barBgRef.current?.offsetWidth;
          let pgsWidth = parseFloat(
            window.getComputedStyle(barBgRef.current).width.replace('px', ''),
          );
          let rate = (position.oriOffestLeft + length) / pgsWidth;

          console.log('===', position.oriOffestLeft, length);

          console.log(
            '偏移总长比例',
            (audioRef.current as HTMLAudioElement).duration * rate,
            rate,
          );
          (audioRef.current as HTMLAudioElement).currentTime =
            (audioRef.current as HTMLAudioElement).duration * rate;
        }
      };
      // 结束
      const end = () => {
        flag = false;
      };

      // 鼠标按下时
      dotRef.current.addEventListener('mousedown', down as any, false);
      dotRef.current.addEventListener('touchstart', down, false);

      // 开始拖动
      document.addEventListener('mousemove', move as any, false);
      document.addEventListener('touchmove', move, false);

      // 拖动结束
      document.addEventListener('mouseup', end, false);
      barBgRef.current?.addEventListener('touchend', end, false);
    }
  }, [src]);

  const handlePaly = () => {
    if (toggle && src) {
      audioRef.current?.play();
      return;
    }
    audioRef.current?.pause();
    return;
  };

  return (
    <>
      <audio
        // @ts-ignore
        pid={uidRef.current}
        controls={false}
        src={src}
        preload='metadata'
        ref={audioRef}>
        您的浏览器不支持 audio 标签
      </audio>
      <div className='audio-container' style={{ width, height }}>
        <div className='audio-toggle' onClick={handlePaly}>
          {toggle && src ? '>' : '||'}
        </div>
        <div className='audio-progress-bar-bg' ref={barBgRef}>
          <span
            ref={dotRef}
            className='progressDot'
            style={{ left: `${progress - 2}%` }}></span>
          <div
            ref={barRef}
            className='audio-progress-bar'
            style={{
              width: `${progress}%`,
            }}></div>
        </div>
        <div className='audio-time'>
          {currentTime}/{duration}
        </div>
      </div>
    </>
  );
};

export default Audio;
```

### 总结

``PS：原生内有个功能是下载，这里并没有实现``

关于 JS 代码部分，大部分参考至这里 [H5 audio 音频标签自定义样式修改以及添加播放控制事件][H5_AUDIO]

需求原因，原生样式似乎并不能满足产品，就会出现需要 DIY 的情况，个人参照了很多网上相关的 Blog，如有错误，敬请指教

感谢阅读

``参考文章``

- [H5 audio 音频标签自定义样式修改以及添加播放控制事件][H5_AUDIO]
- [HTML audio基础API完全使用指南][HTML_AUDIO]
- [MDN <audio>][MDN_AUDIO]


---
[video_player_styling_basics]: https://developer.mozilla.org/en-US/docs/Web/Guide/Audio_and_video_delivery/Video_player_styling_basics
[mdn_audio_css]: https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio#%E4%BD%BF%E7%94%A8_css_%E8%AE%BE%E7%BD%AE%E6%A0%B7%E5%BC%8F
[mdn_audio_attributes]: https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio#%E5%B1%9E%E6%80%A7
[mdn_audio_events]: https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio#%E4%BA%8B%E4%BB%B6
[MDN_AUDIO]: https://developer.mozilla.org/zh-CN/docs/Web/HTML/Element/audio
[H5_AUDIO]: https://blog.csdn.net/Dandelion_drq/article/details/77645659
[HTML_AUDIO]: https://www.zhangxinxu.com/wordpress/2019/07/html-audio-api-guide/
