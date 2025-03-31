declare module "dom-to-image" {
  interface Options {
    quality?: number;
    bgcolor?: string;
    style?: Record<string, string>;
    filter?: (node: HTMLElement) => boolean;
    width?: number;
    height?: number;
    styleTransform?: string;
    styleTransformOrigin?: string;
    cacheBust?: boolean;
    imagePlaceholder?: string;
    skipAutoScale?: boolean;
    scale?: number;
    useCSSTransform?: boolean;
  }

  interface DomToImage {
    toPng(node: HTMLElement, options?: Options): Promise<string>;
    toJpeg(node: HTMLElement, options?: Options): Promise<string>;
    toBlob(node: HTMLElement, options?: Options): Promise<Blob>;
    toPixelData(node: HTMLElement, options?: Options): Promise<number[]>;
  }

  const domtoimage: DomToImage;
  export = domtoimage;
}
