import { isFullDatabase, isFullPage } from '@notionhq/client';
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { parseText } from './parse-text';

export type Icon =
  | {
      type: 'emoji';
      emoji: string;
    }
  | null
  | {
      type: 'external';
      external: {
        url: string;
      };
    }
  | null
  | {
      type: 'file';
      file: {
        url: string;
        expiry_time: string;
      };
    }
  | null;

const getEmoji = (icon: Icon) => (icon && 'emoji' in icon ? icon.emoji : null);

const flattenTextItems = (textItems: RichTextItemResponse[]): string =>
  Array.isArray(textItems)
    ? textItems.map((item) => item.plain_text).join('')
    : '';

const getTitleFromProperty = (property: any) =>
  property && 'title' in property
    ? flattenTextItems(property.title as RichTextItemResponse[])
    : null;

export type GetNotionObjectTitleOptions = {
  emoji?: boolean;
};

export const getNotionObjectTitle = (
  notionObject: unknown,
  options: GetNotionObjectTitleOptions = { emoji: true }
): any => {
  const page = notionObject as PageObjectResponse;
  if (isFullPage(page) && page.object === 'page' && page.properties) {
    const propertyKey = ['title', 'Page', 'Name'].find((key) =>
      getTitleFromProperty(page.properties[key])
    );
    if (propertyKey) {
      if (!options.emoji) {
        return getTitleFromProperty(page.properties[propertyKey]);
      }
      const icon = getEmoji(page.icon) ?? '';
      return `${icon}${getTitleFromProperty(page.properties[propertyKey])}`;
    }
  }

  const database = notionObject as DatabaseObjectResponse;
  if (isFullDatabase(database)) {
    const title = flattenTextItems(database.title);

    if (!options.emoji) {
      return title;
    }

    const icon = getEmoji(page.icon) ?? '';
    return `${icon}${title}`;
  }

  return parseText(notionObject);
};
