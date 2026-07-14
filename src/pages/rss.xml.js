import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import sanitizeHtml from 'sanitize-html';
import MarkdownIt from 'markdown-it';
const parser = new MarkdownIt();

const FEED_ID = '230918040866381824';
const USER_ID = 56922066987581440;

// 移除 XML 不允许的控制字符，防止 RSS 报错 (PCDATA invalid Char value)
const removeInvalidChars = (str) => {
  return str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
};

export async function GET(context) {
  const posts = await getCollection("posts");

  // 构造站点与 favicon 的绝对 URL（RSS 要求 image 使用绝对 URL）
  const siteUrl = context?.site ? String(context.site) : '';
  const faviconUrl = siteUrl ? new URL('/favicon.svg', siteUrl).toString() : '/favicon.svg';

  // 按日期降序排序（最新的在前）
  const sortedPosts = posts.sort((a, b) => new Date(b.data.pubDate) - new Date(a.data.pubDate));

  return rss({
    title: 'z-index | 👋 hi，今日饮点咩呀~',
    description: '这里是 YiGe 的时之物语。',
    site: context.site,
    items: sortedPosts.map((post) => ({
      title: post.data.title,
      link: `/posts/${post.id.split('/').pop()}`,
      content: removeInvalidChars(sanitizeHtml(parser.render(post.body), {
        allowedTags: sanitizeHtml.defaults.allowedTags.concat(['img']), //渲染组件
      })),
      ...post.data,
    })),
    customData: `
      <image>
        <url>${faviconUrl}</url>
        <title>z-index</title>
        <link>${siteUrl}</link>
      </image>
      <language>zh-CN</language>
      <generator>Astro</generator>
      <follow_challenge>
        <feedId>${FEED_ID}</feedId>
        <userId>${USER_ID}</userId>
      </follow_challenge>

    `
  });
}
