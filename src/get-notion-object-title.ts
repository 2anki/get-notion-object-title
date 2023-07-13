import { isFullDatabase, isFullPage } from '@notionhq/client';
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { Icon } from './types';
import { parseText } from './parse-text';

const getEmoji = (icon: Icon) => {
  if (!icon || !('emoji' in icon)) {
    return null;
  }
  return icon.emoji;
};

function flattenTextItems(textItems: RichTextItemResponse[]): string {
  if (!Array.isArray(textItems)) {
    return '';
  }
  return textItems.map((item) => item.plain_text).join('');
}

export function getNotionBlockTitle(notionObject: unknown): any {
  const page = notionObject as PageObjectResponse;
  if (isFullPage(page) && page.object === 'page') {
    const properties = page.properties;
    if (!properties) {
      return null;
    }

    if (properties.title && 'title' in properties.title) {
      const richTextItems = properties.title.title as RichTextItemResponse[];
      return flattenTextItems(richTextItems);
    }

    if (properties.Page && 'title' in properties.Page) {
      const richTextItems = properties.Page.title as RichTextItemResponse[];
      const icon = getEmoji(page.icon) ?? '';
      return `${icon}${flattenTextItems(richTextItems)}`;
    }

    if (properties.Name && 'title' in properties.Name) {
      const richTextItems = properties.Name.title as RichTextItemResponse[];
      return flattenTextItems(richTextItems);
    }
  }

  const database = notionObject as DatabaseObjectResponse;
  if (isFullDatabase(database)) {
    if (database.icon) {
      const icon = getEmoji(page.icon) ?? '';
      return `${icon}${flattenTextItems(database.title)}`;
    }
    return flattenTextItems(database.title);
  }

  return parseText(notionObject);
}

export default getNotionBlockTitle;
