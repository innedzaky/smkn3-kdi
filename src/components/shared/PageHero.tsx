import Link from "next/link";

export default function PageHero({
  label,
  title,
  breadcrumb,
}: {
  label: string;
  title: string;
  breadcrumb: string;
}) {
  return (
    <div className="page-hero">
      <div className="section-inner">
        <div className="section-label">{label}</div>
        <h1 className="section-title">{title}</h1>
        <div className="breadcrumb">
          <Link href="/">Beranda</Link> / {breadcrumb}
        </div>
      </div>
    </div>
  );
}
