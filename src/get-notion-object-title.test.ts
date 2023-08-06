import { describe, it, expect } from 'vitest';

import { getNotionObjectTitle } from './get-notion-object-title';

import databaseTitleMock from './__mocks/database-title.json';
import databaseEmojiTitleMock from './__mocks/database-emoji-title.json';
import pageEmojiTitleMock from './__mocks/page-emoji-title.json';
import pageTitleMock from './__mocks/page-title.json';
import pageNameMock from './__mocks/page-name.json';
import unknownPropKeyMock from './__mocks/unknown-prop-key.json';

describe('Get Notion Object Title', () => {
  it("page title should be 'Page Title'", () => {
    expect(getNotionObjectTitle(pageTitleMock)).toBe('Page Title');
  });

  it("page title should be '😺HTML test'", () => {
    expect(getNotionObjectTitle(pageEmojiTitleMock)).toBe('😺HTML test');
  });

  it("page title should be 'long name....'", () => {
    expect(getNotionObjectTitle(pageNameMock)).toBe(
      'What is the optimum daily learning time - SuperMemopedia'
    );
  });

  it("database title should be '💡TOPICS'", () => {
    expect(getNotionObjectTitle(databaseEmojiTitleMock)).toBe('💡TOPICS');
  });
  it("database title should be 'TOPICS'", () => {
    expect(getNotionObjectTitle(databaseTitleMock)).toBe('TOPICS');
  });

  it('Disable emoji in page', () => {
    expect(getNotionObjectTitle(pageEmojiTitleMock, { emoji: false })).toBe(
      'HTML test'
    );
  });

  it('It uses all keys in the properties', () => {
    expect(getNotionObjectTitle(unknownPropKeyMock, { emoji: false })).toBe(
      'How it stores'
    );
  });
});
