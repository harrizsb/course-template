import { useEffect, useRef, useState } from 'preact/hooks';
import { GlobalWorkerOptions, getDocument, type PDFDocumentProxy } from 'pdfjs-dist';

interface PdfViewerProps {
  dataUri: string;
  title: string;
  fileName: string;
}

function dataUriToBytes(dataUri: string): Uint8Array {
  const comma = dataUri.indexOf(',');
  if (comma < 0) throw new Error('Invalid PDF data URI');
  const binary = atob(dataUri.slice(comma + 1));
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

export default function PdfViewer({ dataUri, title, fileName }: PdfViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pdfRef = useRef<PDFDocumentProxy | null>(null);
  const [error, setError] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);

  async function renderPage(document: PDFDocumentProxy, pageNumber: number) {
    if (!canvasRef.current) return;
    const page = await document.getPage(pageNumber);
    const viewport = page.getViewport({ scale: 1.25 });
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas rendering is unavailable');
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    await page.render({ canvasContext: context, viewport }).promise;
  }

  useEffect(() => {
    let cancelled = false;
    GlobalWorkerOptions.workerSrc = '/pdfjs/pdf.worker.min.mjs';

    async function loadDocument() {
      try {
        const document = await getDocument({ data: dataUriToBytes(dataUri) }).promise;
        if (cancelled) {
          void document.destroy();
          return;
        }
        pdfRef.current = document;
        setPageCount(document.numPages);
        setCurrentPage(1);
        await renderPage(document, 1);
      } catch {
        if (!cancelled) setError(true);
      }
    }

    void loadDocument();
    return () => {
      cancelled = true;
      void pdfRef.current?.destroy();
      pdfRef.current = null;
    };
  }, [dataUri]);

  const goToPage = async (pageNumber: number) => {
    const document = pdfRef.current;
    if (!document || pageNumber < 1 || pageNumber > pageCount || loading) return;
    setLoading(true);
    try {
      await renderPage(document, pageNumber);
      setCurrentPage(pageNumber);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  const buttonClass = 'inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-1.5 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-outline/50 disabled:pointer-events-none disabled:opacity-50';

  return (
    <div class="overflow-hidden border border-border" aria-label={`${title} PDF preview`}>
      <div class="flex flex-wrap items-center justify-between gap-2 border-b border-border bg-muted/30 px-4 py-2">
        <p class="text-sm text-muted-foreground">{pageCount > 0 ? `Page ${currentPage} of ${pageCount}` : 'Loading preview...'}</p>
        <div class="flex items-center gap-2">
          <button class={buttonClass} disabled={currentPage <= 1 || loading} onClick={() => void goToPage(currentPage - 1)}>Previous</button>
          <button class={buttonClass} disabled={currentPage >= pageCount || loading} onClick={() => void goToPage(currentPage + 1)}>Next</button>
        </div>
      </div>
      <div class="min-h-96 overflow-auto bg-muted/30 p-4">
        {error ? <p class="p-4 text-sm text-muted-foreground">This browser cannot display the PDF preview.</p> : <canvas ref={canvasRef} class="mx-auto h-auto max-w-full shadow-sm" aria-label={`${title} page ${currentPage}`} />}
      </div>
      <p class="border-t border-border p-4 text-sm text-muted-foreground">
        <a href={dataUri} download={fileName} class="text-primary underline underline-offset-4 hover:text-primary-accent outline-none focus-visible:ring-3 focus-visible:ring-outline/50">Download {title} (PDF)</a>
      </p>
    </div>
  );
}
