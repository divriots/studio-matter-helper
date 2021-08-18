import yamljs from 'yamljs';

function parseMatter(s: string): any {
  if (s.trim().startsWith('{')) {
    return JSON.parse(s);
  }
  return yamljs.parse(s);
}

const matter = (
  content: string,
  regexp: RegExp
): { data?: any; content: string } => {
  const match = regexp.exec(content);
  if (match && match[1]) {
    let data = {};
    try {
      data = parseMatter(match[1]);
      const slicedContent = content.slice(match[0].length);
      return { data, content: slicedContent };
    } catch (e) {
      return {
        content: ['```js', e.toString(), '```', content].join('\n'),
      };
    }
  }
  return { content };
};

const matterRegexp = (begin: string, end: string): RegExp =>
  new RegExp(`^${begin}(?:json)?(?=\\n)(.*?)\\n${end}\\n`, 's');

export const matterHTML = (content: string): { data?: any; content: string } =>
  matter(content, matterRegexp('<!--', '-->'));
export const matterMD = (content: string): { data?: any; content: string } =>
  matter(content, matterRegexp('---', '---'));
