"use client";

import QRCode from "qrcode";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";

type BranchQrCodeProps = {
  branchName: string;
  publicUrl: string;
};

function downloadTextFile(filename: string, content: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function downloadDataUrl(filename: string, dataUrl: string) {
  const anchor = document.createElement("a");
  anchor.href = dataUrl;
  anchor.download = filename;
  anchor.click();
}

export function BranchQrCode({ branchName, publicUrl }: BranchQrCodeProps) {
  const [svg, setSvg] = useState("");
  const [pngDataUrl, setPngDataUrl] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function generateQr() {
      const [nextSvg, nextPng] = await Promise.all([
        QRCode.toString(publicUrl, {
          type: "svg",
          margin: 2,
          color: {
            dark: "#2b1836",
            light: "#ffffff",
          },
        }),
        QRCode.toDataURL(publicUrl, {
          width: 960,
          margin: 2,
          color: {
            dark: "#2b1836",
            light: "#ffffff",
          },
        }),
      ]);

      if (!isMounted) {
        return;
      }

      setSvg(nextSvg);
      setPngDataUrl(nextPng);
    }

    generateQr();

    return () => {
      isMounted = false;
    };
  }, [publicUrl]);

  const filenameBase = branchName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return (
    <div className="space-y-3">
      <div className="grid aspect-square w-36 place-items-center rounded-3xl border border-[#ead9f0] bg-white p-3">
        {svg ? (
          <div
            className="w-full"
            aria-label={`QR code for ${branchName}`}
            dangerouslySetInnerHTML={{ __html: svg }}
          />
        ) : (
          <div className="size-full animate-pulse rounded-2xl bg-[#f2e7f6]" />
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => downloadDataUrl(`${filenameBase}-qr.png`, pngDataUrl)}
          disabled={!pngDataUrl}
          className="inline-flex items-center gap-2 rounded-full bg-[#fff3c6] px-3 py-2 text-xs font-semibold text-[#4a3155] disabled:opacity-50"
        >
          <Download className="size-3" aria-hidden="true" />
          PNG
        </button>
        <button
          type="button"
          onClick={() =>
            downloadTextFile(`${filenameBase}-qr.svg`, svg, "image/svg+xml")
          }
          disabled={!svg}
          className="inline-flex items-center gap-2 rounded-full bg-[#fbf7fc] px-3 py-2 text-xs font-semibold text-[#4a3155] disabled:opacity-50"
        >
          <Download className="size-3" aria-hidden="true" />
          SVG
        </button>
      </div>
    </div>
  );
}
