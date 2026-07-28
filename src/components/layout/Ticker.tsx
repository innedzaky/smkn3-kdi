import Link from "next/link";
import type { Pengumuman } from "@/lib/types";

export default function Ticker({ pengumuman }: { pengumuman: Pengumuman[] }) {
  const item = pengumuman[0];
  if (!item) return null;

  return (
    <div className="ticker-wrap">
      <div className="ticker-inner">
        <div className="ticker-label">🎓 INFO SPMB</div>
        <div className="ticker-text">
          {item.judul}
          <Link href={item.link_url ?? "/spmb"} className="ticker-btn-cta">
            Lihat Info →
          </Link>
        </div>
      </div>
    </div>
  );
}
