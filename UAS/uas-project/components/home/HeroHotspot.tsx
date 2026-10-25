type HeroHotspotProps = {
  buttonClass: string;
  infoClass: string;
  title: string;
  description: string;
};

export default function HeroHotspot({
  buttonClass,
  infoClass,
  title,
  description,
}: HeroHotspotProps) {
  return (
    <>
      <a className={`plus-button ${buttonClass}`}>
        <i className="bi bi-plus"></i>
      </a>

      <div className={`${infoClass} p-2`}>
        <h6 className="text-warning font-weight-bold">{title}</h6>
        <p className="info-description text-white">{description}</p>
      </div>
    </>
  );
}
