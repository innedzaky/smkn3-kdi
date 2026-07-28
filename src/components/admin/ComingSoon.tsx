export function ComingSoon({
  title,
  description,
  icon = "🚧",
}: {
  title: string;
  description: string;
  icon?: string;
}) {
  return (
    <div>
      <div className="admin-page-header">
        <div>
          <h1>{title}</h1>
        </div>
      </div>
      <div className="admin-card">
        <div className="admin-soon">
          <div className="admin-soon-icon">{icon}</div>
          <h2>Segera Hadir</h2>
          <p>{description}</p>
        </div>
      </div>
    </div>
  );
}
