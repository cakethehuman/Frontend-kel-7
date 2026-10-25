import type { ReactNode } from "react";

interface FavoriteCardProps {
  region: string;
  done: boolean;
  onMark: () => void;
  onDelete: () => void;
  children: ReactNode;
}

export default function FavoriteCard(props: FavoriteCardProps) {
  const doneClass = props.done ? " is-done" : "";
  const statusText = props.done ? "Sudah dicoba" : "Belum dicoba";
  const markText = props.done ? "Batal Tandai" : "Tandai Sudah";
  const markIcon = props.done ? "bi-arrow-counterclockwise" : "bi-check-lg";

  return (
    <div className="col-md-6 col-xl-4 fav-item">
      <article className={"pf-fav-card" + doneClass}>
        <span className="pf-region">
          <i className="bi bi-geo-alt-fill"></i> {props.region}
        </span>
        <h3 className="pf-fav-name">{props.children}</h3>
        <span className="pf-status">{statusText}</span>
        <div className="pf-fav-actions">
          <button
            type="button"
            className="btn btn-profile btn-mark flex-grow-1"
            onClick={props.onMark}
          >
            <i className={"bi " + markIcon}></i> {markText}
          </button>
          <button
            type="button"
            className="btn btn-trash btn-del"
            onClick={props.onDelete}
          >
            <i className="bi bi-trash3-fill"></i>
          </button>
        </div>
      </article>
    </div>
  );
}