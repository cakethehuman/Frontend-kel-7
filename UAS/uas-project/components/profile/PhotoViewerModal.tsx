"use client";

import { Modal } from "react-bootstrap";

interface PhotoViewerModalProps {
  show: boolean;
  onHide: () => void;
  name: string;
  role: string;
  avatar: string;
  onOpenEdit: () => void;
}

export default function PhotoViewerModal({
  show,
  onHide,
  name,
  role,
  avatar,
  onOpenEdit,
}: PhotoViewerModalProps) {
  const hurufAvatar = name ? name.charAt(0).toUpperCase() : "W";

  return (
    <Modal
      show={show}
      onHide={onHide}
      centered
      contentClassName="bg-light pf-modal text-center"
    >
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title as="h2" className="h5">
          {name}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">
        <div className="pf-photo-viewer-box">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={avatar} alt={name} className="pf-photo-viewer-img" />
          ) : (
            hurufAvatar
          )}
        </div>
        <p className="pf-sub mt-3 mb-0">{role}</p>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 justify-content-center">
        <button
          type="button"
          className="btn btn-profile-outline"
          onClick={onHide}
        >
          Tutup
        </button>
        <button
          type="button"
          className="btn btn-profile"
          onClick={() => {
            onHide();
            onOpenEdit();
          }}
        >
          <i className="bi bi-camera-fill"></i> Ubah Foto
        </button>
      </Modal.Footer>
    </Modal>
  );
}