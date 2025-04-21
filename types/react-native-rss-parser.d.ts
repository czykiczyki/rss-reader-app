declare module 'react-native-rss-parser' {
  interface RSSItem {
    id?: string;
    title?: string;
    links?: Array<{ url: string }>;
    published?: string;
    content?: string;
    description?: string;
    authors?: Array<{ name: string }>;
    categories?: string[];
    enclosures?: Array<{
      url: string;
      type?: string;
    }>;
  }

  interface RSSFeed {
    title?: string;
    description?: string;
    items: RSSItem[];
  }

  export default class RSSParser {
    static parse(xml: string): Promise<RSSFeed>;
  }
} 