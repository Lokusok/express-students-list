export type TGetStudentsParams =
  | {
      where?: {
        role: string | any;
      };
      offset: number | string | any;
      limit: number | string | any;
    }
  | {};
