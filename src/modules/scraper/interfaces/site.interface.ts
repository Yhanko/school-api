export interface ISites {
  readonly objectId: string;
  readonly url: string;
  scrapy(): Promise<boolean>;
  saveDatas(): Promise<boolean>;
}
