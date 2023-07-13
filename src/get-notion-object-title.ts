import { isFullDatabase, isFullPage } from '@notionhq/client';
import {
  DatabaseObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { Icon } from './types';
import { parseText } from './parse-text';

const getEmoji = (icon: Icon) => (icon && 'emoji' in icon ? icon.emoji : null);

const flattenTextItems = (textItems: RichTextItemResponse[]): string =>
  Array.isArray(textItems)
    ? textItems.map((item) => item.plain_text).join('')
    : '';

const getTitleFromProperty = (property: any) =>
  property && 'title' in property
    ? flattenTextItems(property.title as RichTextItemResponse[])
    : null;

export const getNotionObjectTitle = (notionObject: unknown): any => {
  const page = notionObject as PageObjectResponse;
  if (isFullPage(page) && page.object === 'page' && page.properties) {
    const propertyKey = ['title', 'Page', 'Name'].find((key) =>
      getTitleFromProperty(page.properties[key])
    );
    if (propertyKey) {
      const icon = getEmoji(page.icon) ?? '';
      return `${icon}${getTitleFromProperty(page.properties[propertyKey])}`;
    }
  }

  const database = notionObject as DatabaseObjectResponse;
  if (isFullDatabase(database)) {
    const icon = getEmoji(page.icon) ?? '';
    return `${icon}${flattenTextItems(database.title)}`;
  }

  return parseText(notionObject);
};
