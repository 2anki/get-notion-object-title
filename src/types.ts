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
