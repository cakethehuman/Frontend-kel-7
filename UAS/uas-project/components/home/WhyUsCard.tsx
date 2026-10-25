type WhyUsCardProps = {
  icon: string;
  title: string;
  text: string;
};

export default function WhyUsCard({ icon, title, text }: WhyUsCardProps) {
  return (
    <div className="col-6 col-md-3">
      <div className="why-us-card p-4 bg-light rounded-4 shadow-sm h-100">
        <i className={`bi ${icon} why-us-icon`}></i>
        <h4 className="brand-heading fw-bold mt-3 mb-2">{title}</h4>
        <p className="text-secondary small mb-0">{text}</p>
      </div>
    </div>
  );
}
