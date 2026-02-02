export interface Config {
  /**
   * @deepVisibility frontend
   */
  msforms?: {
    entityMapping?: Array<{
      kind: string;
      name: string;
      namespace?: string;
      url: string;
    }>;
  };
}
