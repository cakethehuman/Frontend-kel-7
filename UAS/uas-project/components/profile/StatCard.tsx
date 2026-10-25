export default function StatCard(props: any) {
  return (
    <div className="col-12 col-sm-4">
      <article className="pf-card pf-stat">
        <i className={"bi " + props.icon}></i>
        <div className="pf-stat-num">{props.angka}</div>
        <div className="pf-stat-label">{props.children}</div>
      </article>
    </div>
  );
}