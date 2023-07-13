# Get Notion Object Title

The [Notion API](https://developers.notion.com/reference/intro) does not provide a simple way to retrieve the title of an object.
This module provides you with a simple API where you can pass in a Notion Object
and receive a human readable string.

## Usage

```typescript
import getNotionObjectTitle from 'get-notion-object-title';

getNotionObjectTitle(yourBlock); // returns "Human readable block title"
```

## How does it work?

The `getNotionObjectTitle` takes a Notion object as input and returns a string.
Depending on the type of the object there are some rules that are applied.

### Page

If the [page](https://developers.notion.com/reference/page) has any of the following properties they will be used and they do exclude each other:

- Title
- Page
- Name

### Database

The [database](https://developers.notion.com/reference/database) uses the top level `title` attribute.

### Other

The remaining blocks are converted to plain text using the [rich text items](https://developers.notion.com/reference/rich-text).

## License

Unless otherwise specified in the source:

The code is licensed under the [MIT](./LICENSE) Copyright (c) 2023, Alexander Alemayhu.
