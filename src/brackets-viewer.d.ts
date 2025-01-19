// src/@types/brackets-viewer.d.ts

declare module "brackets-viewer" {
    interface BracketsViewerOptions {
      selector: HTMLElement | null;
      data: any; // Replace `any` with the specific type of your data structure if known
    }
  
    class BracketsViewer {
      constructor(options: BracketsViewerOptions);
    }
  
    export default BracketsViewer;
  }
  