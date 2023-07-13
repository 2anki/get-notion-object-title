import { describe, it, expect } from 'vitest';

import { getNotionBlockTitle } from './get-notion-object-title';

import databaseTitleMock from './__mocks/database-title.json';
import databaseEmojiTitleMock from './__mocks/database-emoji-title.json';
import pageEmojiTitleMock from './__mocks/page-emoji-title.json';
import pageTitleMock from './__mocks/page-title.json';
import pageNameMock from './__mocks/page-name.json';

describe('Get Notion Object Title', () => {
  it("page title should be 'Page Title'", () => {
    expect(getNotionBlockTitle(pageTitleMock)).toBe('Page Title');
  });

  it("page title should be '😺HTML test'", () => {
    expect(getNotionBlockTitle(pageEmojiTitleMock)).toBe('😺HTML test');
  });

  it("page title should be 'long name....'", () => {
    expect(getNotionBlockTitle(pageNameMock)).toBe(
      'What is the optimum daily learning time - SuperMemopedia'
    );
  });

  it("database title should be '💡TOPICS'", () => {
    expect(getNotionBlockTitle(databaseEmojiTitleMock)).toBe('💡TOPICS');
  });
  it("database title should be 'TOPICS'", () => {
    expect(getNotionBlockTitle(databaseTitleMock)).toBe('TOPICS');
  });
});

// describe('Bad path', () => {
//   it('should return null if no properties', () => {
//     expect(getNotionBlockTitle({} as PageObjectResponse)).toBe(null);
//   });
// });
