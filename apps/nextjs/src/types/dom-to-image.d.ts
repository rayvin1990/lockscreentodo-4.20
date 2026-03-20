declare module 'dom-to-image' {
  export function toPng(node: Node, options?: {
    width?: number;
    height?: number;
    quality?: number;
    bgcolor?: string;
    style?: object;
  }): Promise<string>;
}
