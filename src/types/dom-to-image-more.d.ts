declare module "dom-to-image-more" {
  interface Options {
    quality?: number;
    bgcolor?: string;
  }

  interface DomToImage {
    toJpeg(node: HTMLElement, options?: Options): Promise<string>;
  }

  const domtoimage: DomToImage;
  export default domtoimage;
}
