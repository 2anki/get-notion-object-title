import { isFullDatabase, isFullPage } from '@notionhq/client';
import {
  BlockObjectResponse,
  DatabaseObjectResponse,
  PageObjectResponse,
  RichTextItemResponse,
} from '@notionhq/client/build/src/api-endpoints';

import { getTextFromBlock } from './getTextFromBlock';

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

const getTitleFromProperty = (property: any) => {
  if (!property) {
    return '';
  }

  if ('rich_text' in property) {
    return flattenTextItems(property.rich_text as RichTextItemResponse[]);
  }

  if ('title' in property) {
    return flattenTextItems(property.title as RichTextItemResponse[]);
  }
};

export type GetNotionObjectTitleOptions = {
  emoji?: boolean;
};

export const getNotionObjectTitle = (
  notionObject: unknown,
  options: GetNotionObjectTitleOptions = { emoji: true }
): any => {
  const page = notionObject as PageObjectResponse;
  if (isFullPage(page) && page.object === 'page' && page.properties) {
    const propertyKey = ['title', 'Page', 'Name', 'Topic'].find((key) =>
      getTitleFromProperty(page.properties[key])
    );
    const icon = getEmoji(page.icon) ?? '';

    if (propertyKey) {
      if (!options.emoji) {
        return getTitleFromProperty(page.properties[propertyKey]);
      }
      return `${icon}${getTitleFromProperty(page.properties[propertyKey])}`;
    }

    let pageTitleFromAnyProperty = Object.keys(page.properties)
      .reverse()
      .map((key) => getTitleFromProperty(page.properties[key]))
      .filter((property) => property)
      .reduce((acc, curr) => acc + ' ' + (curr as string), '');

    if (!options.emoji) {
      return pageTitleFromAnyProperty;
    }

    return `${icon}${pageTitleFromAnyProperty}`;
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

  return (notionObject as BlockObjectResponse)?.type !== undefined
    ? getTextFromBlock(notionObject)
    : 'Untitled';
};
