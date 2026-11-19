import fs from 'node:fs';
import path from 'node:path';
import axios from 'axios';
import * as cheerio from 'cheerio';

const DOUBAN_ID = '141874159'; // 你的 ID
const DATA_DIR = path.join(process.cwd(), 'src/data/douban');
const IMAGE_DIR = path.join(process.cwd(), 'public/library');
const PUBLIC_IMAGE_PREFIX = '/library';
const RECENT_LIMIT = 30;

// 简单的 User-Agent 池
const USER_AGENTS = [
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36",
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15",
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/115.0"
];

const getRandomHeader = () => ({
  'User-Agent': USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)],
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
  'Accept-Language': 'zh-CN,zh;q=0.9,en;q=0.8',
  'Referer': 'https://www.douban.com/'
});

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// 解析器：影视和图书 (Grid View)
function parseGridItem($item) {
  const title = $item.find('.title a').text().trim().replace(/[\n\s]+/g, ' ');
  const link = $item.find('.title a').attr('href');
  const cover = $item.find('.pic img').attr('src')?.replace('ipst', 'spst');
  const date = $item.find('.date').text().trim();
  const ratingClass = $item.find('[class^="rating"]').attr('class');
  const rating = ratingClass ? parseInt(ratingClass.replace(/\D/g, '')) : 0;
  const comment = $item.find('.comment').text().trim();

  return { title, link, cover, date, rating, comment };
}

// 解析器：游戏 (List View)
function parseGameItem($item) {
  const title = $item.find('.title a').text().trim();
  const link = $item.find('.title a').attr('href');
  const cover = $item.find('.pic img').attr('src');

  // 游戏页面的日期和评分结构不同
  const date = $item.find('.date').text().trim();
  const ratingClass = $item.find('[class^="allstar"]').attr('class'); // e.g. allstar40
  const rating = ratingClass ? parseInt(ratingClass.replace(/\D/g, '')) / 10 : 0;
  const comment = $item.find('.comment').text().trim();

  return { title, link, cover, date, rating, comment };
}

// 解析器：图书 (List View)
function parseBookItem($item) {
  const title = $item.find('.info h2 a').text().trim().replace(/[\n\s]+/g, ' ');
  const link = $item.find('.info h2 a').attr('href');
  const cover = $item.find('.pic img').attr('src')?.replace('ipst', 'spst');

  const rawDate = $item.find('.short-note .date').text().trim();
  const dateMatch = rawDate.match(/\d{4}-\d{2}-\d{2}/);
  const date = dateMatch ? dateMatch[0] : rawDate; // 如果没匹配到，保留原值（可能是 YYYY-MM）

  const ratingClass = $item.find('.short-note [class^="rating"]').attr('class');
  const rating = ratingClass ? parseInt(ratingClass.replace(/\D/g, '')) : 0;
  const comment = $item.find('.short-note .comment').text().trim();

  return { title, link, cover, date, rating, comment };
}

// 抓取单页数据
async function fetchPage(category, start = 0) {
  let url;
  let isGame = category === 'game';
  let isBook = category === 'book';

  if (isGame) {
    url = `https://www.douban.com/people/${DOUBAN_ID}/games?action=collect&start=${start}`;
  } else if (isBook) {
    url = `https://${category}.douban.com/people/${DOUBAN_ID}/collect?start=${start}&sort=time&rating=all&filter=all&mode=grid`;
  } else {
    url = `https://${category}.douban.com/people/${DOUBAN_ID}/collect?start=${start}&sort=time&rating=all&filter=all&mode=grid`;
  }

  console.log(`正在抓取 ${category} 第 ${Math.floor(start / 15) + 1} 页...`);

  try {
    const { data } = await axios.get(url, { headers: getRandomHeader() });
    const $ = cheerio.load(data);
    const items = [];

    if (isGame) {
      $('.game-list .common-item').each((_, el) => {
        items.push(parseGameItem($(el)));
      });
    } else if (isBook) {
      $('.interest-list .subject-item').each((_, el) => {
        items.push(parseBookItem($(el)));
      });
    } else {
      $('.grid-view .item').each((_, el) => {
        items.push(parseGridItem($(el)));
      });
    }

    return items;
  } catch (error) {
    if (error.response && error.response.status === 403) {
      console.error(`⚠️ 触发豆瓣反爬 (403 Forbidden)，停止抓取 ${category}`);
      throw error;
    }
    console.error(`抓取失败: ${url}`, error.message);
    return [];
  }
}

// 抓取某个分类的所有数据
// mode: 'full' (全量) | 'recent' (每个分类最近 30 条)
async function fetchCategory(category, mode = 'full') {
  let allItems = [];
  let start = 0;
  let hasMore = true;
  let errorCount = 0;

  while (hasMore) {
    try {
      const items = await fetchPage(category, start);
      if (items.length === 0) {
        hasMore = false;
      } else {
        // recent 模式按豆瓣时间倒序抓取，直到覆盖最近 30 条
        if (mode === 'recent') {
          allItems = allItems.concat(items);

          if (allItems.length >= RECENT_LIMIT) {
            console.log(`📚 已获取 ${allItems.length} 条，停止抓取`);
            hasMore = false;
          }
        } else {
          allItems = allItems.concat(items);
        }

        if (hasMore) {
          start += 15;
          errorCount = 0;
          await sleep(2000 + Math.random() * 3000);
        }
      }

      // 安全限制
      if (start > 2000) hasMore = false;

    } catch (error) {
      errorCount++;
      if (errorCount >= 3) {
        console.error('❌ 连续失败 3 次，放弃当前分类剩余数据');
        hasMore = false;
      } else {
        console.log('⏳ 等待 10 秒后重试...');
        await sleep(10000);
      }
    }
  }

  return mode === 'recent'
    ? allItems
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, RECENT_LIMIT)
    : allItems;
}

// 下载图片并返回本地路径
async function downloadImage(url, category, filenamePrefix = '') {
  if (!url || url.startsWith(PUBLIC_IMAGE_PREFIX)) return url;

  try {
    const categoryDir = path.join(IMAGE_DIR, category);
    if (!fs.existsSync(categoryDir)) fs.mkdirSync(categoryDir, { recursive: true });

    // 从 URL 提取文件名，例如 p2897599026.jpg
    const urlParts = url.split('/');
    let filename = urlParts[urlParts.length - 1];

    // 如果文件名太长或不合法，使用简单的 hash 或 timestamp (这里简单处理)
    if (filename.length > 50 || !filename.match(/\.(jpg|jpeg|png|webp|avif|gif)$/i)) {
      filename = `img_${Date.now()}_${Math.random().toString(36).slice(2)}.jpg`;
    }

    if (filenamePrefix) {
      filename = `${filenamePrefix}_${filename}`;
    }

    const filepath = path.join(categoryDir, filename);
    const publicPath = `${PUBLIC_IMAGE_PREFIX}/${category}/${filename}`;

    // 如果文件已存在，直接返回
    if (fs.existsSync(filepath)) {
      return publicPath;
    }

    // 下载图片
    // console.log(`Downloading: ${url} -> ${filename}`);
    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: getRandomHeader(),
      timeout: 10000
    });

    fs.writeFileSync(filepath, response.data);
    await sleep(200); // 稍微停顿一下，避免太快
    return publicPath;

  } catch (error) {
    console.error(`Failed to download image: ${url}`, error.message);
    // 下载失败则保留原 URL
    return url;
  }
}

// 合并新旧数据 (去重)
function mergeData(oldData, newData) {
  const map = new Map();
  oldData.forEach(item => map.set(item.link, item));
  // 新数据覆盖旧数据
  newData.forEach(item => map.set(item.link, item));

  // 转回数组并按时间倒序
  return Array.from(map.values()).sort((a, b) => new Date(b.date) - new Date(a.date));
}

async function main() {
  const args = process.argv.slice(2);
  const mode = args.includes('recent') ? 'recent' : 'full';
  const targets = [];

  if (args.includes('movie')) targets.push('movie');
  if (args.includes('book')) targets.push('book');
  if (args.includes('game')) targets.push('game');
  if (args.includes('tv')) {
    if (!targets.includes('movie')) targets.push('movie');
  }

  // 默认抓取所有
  if (targets.length === 0) targets.push('movie', 'book', 'game');

  console.log(`🚀 启动抓取: 模式=${mode}, 目标=${targets.join(',')}`);

  if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
  if (!fs.existsSync(IMAGE_DIR)) fs.mkdirSync(IMAGE_DIR, { recursive: true });

  for (const category of targets) {
    console.log(`\n=== 开始处理 ${category} ===`);
    const newItems = await fetchCategory(category, mode);

    // 为每个 item 添加 category 属性，方便 recent.json 区分分类
    newItems.forEach(item => {
      if (!item.category) item.category = category;
    });

    const filePath = path.join(DATA_DIR, `${category}.json`);
    let finalItems = newItems;

    // 如果是 recent 模式，需要读取旧文件进行合并
    if (mode === 'recent' && fs.existsSync(filePath)) {
      try {
        const oldItems = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        console.log(`📥 读取旧数据 ${oldItems.length} 条，合并新数据 ${newItems.length} 条...`);
        finalItems = mergeData(oldItems, newItems);
      } catch (e) {
        console.error('读取旧文件失败，将只保存新数据');
      }
    }

    // 下载图片
    if (finalItems.length > 0) {
      console.log(`📥 正在下载 ${category} 图片 (${finalItems.length} 张)...`);
      // 使用 Promise.all 并限制并发，避免请求过快
      // 也可以简单地串行
      for (let i = 0; i < finalItems.length; i++) {
        // 更新封面路径
        finalItems[i].cover = await downloadImage(finalItems[i].cover, category);
        if ((i + 1) % 50 === 0) process.stdout.write('.');
      }
      console.log(''); // 换行

      fs.writeFileSync(filePath, JSON.stringify(finalItems, null, 2));
      console.log(`✅ ${category} 处理完成，当前共 ${finalItems.length} 条`);
    } else {
      console.log(`⚠️ ${category} 未获取到数据`);
    }
  }

  // 从完整分类档案中选取跨分类时间最新的 30 条
  const recentFilePath = path.join(DATA_DIR, 'recent.json');
  const categories = ['movie', 'book', 'game'];
  const allItems = categories.flatMap(category => {
    const filePath = path.join(DATA_DIR, `${category}.json`);
    if (!fs.existsSync(filePath)) return [];

    return JSON.parse(fs.readFileSync(filePath, 'utf-8')).map(item => ({
      ...item,
      category: item.category || category,
    }));
  });

  const finalRecentItems = allItems
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, RECENT_LIMIT);

  // 下载 recent 图片 (虽然大部分可能已经在上面处理过了，但如果是从旧 recent.json 读出来的可能还没有下载)
  if (finalRecentItems.length > 0) {
    console.log(`📥 正在检查 recent 图片 (${finalRecentItems.length} 张)...`);
    for (let i = 0; i < finalRecentItems.length; i++) {
      const item = finalRecentItems[i];
      item.cover = await downloadImage(item.cover, item.category || 'movie');
    }
  }

  fs.writeFileSync(recentFilePath, JSON.stringify(finalRecentItems, null, 2));
  console.log(`\n✅ 最近 ${RECENT_LIMIT} 条数据已保存至 recent.json，共 ${finalRecentItems.length} 条`);
}

main();
