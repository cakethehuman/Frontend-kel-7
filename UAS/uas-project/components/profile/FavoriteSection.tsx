"use client";

import { useState, type FormEvent } from "react";
import { Modal } from "react-bootstrap";
import FavoriteCard from "@/components/profile/FavoriteCard";
import type { FavoriteItem } from "@/components/profile/ProfileHero";
import { useSiteContent } from "@/lib/siteContent";
import { apiFetch } from "@/lib/api";

interface FavoriteSectionProps {
  favorites: FavoriteItem[];
  setFavorites: (daftarBaru: FavoriteItem[]) => void;
  messageText: string;
  messageType: string;
  tampilkanPesan: (teksPesan: string, tipe: string) => void;
}

export default function FavoriteSection({
  favorites,
  setFavorites,
  messageText,
  messageType,
  tampilkanPesan,
}: FavoriteSectionProps) {
  const { teks } = useSiteContent("profile");
  const daftarPilihanWilayah = teks("profile.regions")
    .split("\n")
    .map((w) => w.trim())
    .filter((w) => w !== "");

  const [inputName, setInputName] = useState("");
  const [inputRegion, setInputRegion] = useState("Sumatra");
  const wilayahDipilih = daftarPilihanWilayah.includes(inputRegion)
    ? inputRegion
    : (daftarPilihanWilayah[0] ?? "");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState("");

  const urlFav = "/favorites";

  async function tambahKuliner(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const namaBersih = inputName.trim();

    if (namaBersih.length < 3) {
      tampilkanPesan("Nama kuliner minimal 3 karakter ya.", "error");
      return;
    }

    let sudahAda = false;
    for (let i = 0; i < favorites.length; i++) {
      const itemFav = favorites[i];
      if (itemFav && itemFav.name.toLowerCase() === namaBersih.toLowerCase()) {
        sudahAda = true;
      }
    }

    if (sudahAda) {
      tampilkanPesan(namaBersih + " sudah ada di daftarmu.", "error");
      return;
    }

    try {
      const res = await apiFetch(urlFav, {
        method: "POST",
        body: JSON.stringify({
          name: namaBersih,
          region: wilayahDipilih,
        }),
      });

      if (res.ok) {
        const itemBaru: FavoriteItem = await res.json();
        const daftarBaru = [itemBaru, ...favorites];
        setFavorites(daftarBaru);

        setInputName("");
        setSearchKeyword("");
        setActiveFilter("all");
        tampilkanPesan(namaBersih + " berhasil ditambahkan!", "ok");
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function tandaiKuliner(id: number) {
    let statusBaru = false;
    for (let i = 0; i < favorites.length; i++) {
      const itemFav = favorites[i];
      if (itemFav && itemFav.id === id) {
        statusBaru = !itemFav.done;
      }
    }

    try {
      const res = await apiFetch(urlFav, {
        method: "PATCH",
        body: JSON.stringify({
          id: id,
          done: statusBaru,
        }),
      });

      if (res.ok) {
        const daftarBaru = favorites.map(function (item) {
          if (item.id === id) {
            return {
              id: item.id,
              name: item.name,
              region: item.region,
              done: statusBaru,
            };
          }
          return item;
        });
        setFavorites(daftarBaru);
      }
    } catch (e) {
      console.log(e);
    }
  }

  function bukaModalHapus(item: FavoriteItem) {
    setDeleteTargetId(item.id);
    setDeleteTargetName(item.name);
    setShowDeleteModal(true);
  }

  async function konfirmasiHapus() {
    if (deleteTargetId === null) return;

    try {
      const res = await apiFetch(urlFav, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: deleteTargetId }),
      });

      if (res.ok) {
        const daftarBaru = favorites.filter(function (item) {
          return item.id !== deleteTargetId;
        });
        setFavorites(daftarBaru);
        setShowDeleteModal(false);
        setDeleteTargetId(null);
        tampilkanPesan("Kuliner berhasil dihapus.", "ok");
      }
    } catch (e) {
      console.log(e);
    }
  }

  const kulinerTampil = favorites.filter(function (item) {
    const kataKunci = searchKeyword.trim().toLowerCase();
    const cocokNama = item.name.toLowerCase().includes(kataKunci);
    const cocokWilayah = item.region.toLowerCase().includes(kataKunci);
    const cocokTeks = cocokNama || cocokWilayah;

    let cocokStatus = true;
    if (activeFilter === "sudah") {
      cocokStatus = item.done === true;
    } else if (activeFilter === "belum") {
      cocokStatus = item.done === false;
    }

    return cocokTeks && cocokStatus;
  });

  return (
    <>
      <section
        className="pf-fav container"
        id="favorit"
        aria-labelledby="fav-title"
      >
        <header className="text-center mb-4">
          <p className="pf-label">{teks("profile.fav.label")}</p>
          <h2 className="pf-heading" id="fav-title">
            {teks("profile.fav.title")}
          </h2>
          <p className="pf-sub">{teks("profile.fav.subtitle")}</p>
        </header>

        <div className="pf-card pf-tools">
          <form
            id="fav-form"
            className="row g-2 align-items-end"
            onSubmit={tambahKuliner}
            noValidate
          >
            <div className="col-md-5">
              <label htmlFor="fav-input-name" className="form-label fw-bold">
                Nama Kuliner
              </label>
              <input
                type="text"
                className="form-control"
                id="fav-input-name"
                placeholder="cth: Teh Pucuk"
                maxLength={40}
                autoComplete="off"
                value={inputName}
                onChange={(e) => setInputName(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label htmlFor="fav-input-region" className="form-label fw-bold">
                Asal Wilayah
              </label>
              <select
                className="form-select"
                id="fav-input-region"
                value={wilayahDipilih}
                onChange={(e) => setInputRegion(e.target.value)}
              >
                {daftarPilihanWilayah.map((wilayah) => (
                  <option key={wilayah} value={wilayah}>
                    {wilayah}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-3">
              <button type="submit" className="btn btn-profile w-100">
                <i className="bi bi-plus-lg"></i> Tambah
              </button>
            </div>
          </form>

          <p
            id="fav-message"
            className={
              "pf-message " +
              (messageType === "error" ? "pf-msg-error" : "pf-msg-ok")
            }
            role="status"
          >
            {messageText}
          </p>

          <hr className="pf-divider" />

          <div className="row g-2 align-items-center">
            <div className="col-lg-6">
              <label htmlFor="fav-search" className="visually-hidden">
                Cari Kuliner
              </label>
              <div className="input-group">
                <span className="input-group-text pf-search-icon">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="search"
                  className="form-control"
                  id="fav-search"
                  placeholder="Cari nama atau wilayah..."
                  autoComplete="off"
                  value={searchKeyword}
                  onChange={(e) => setSearchKeyword(e.target.value)}
                />
              </div>
            </div>
            <div className="col-lg-6">
              <div
                className="pf-filters"
                role="group"
                aria-label="Filter status"
              >
                <button
                  type="button"
                  className={
                    activeFilter === "all" ? "pf-filter active" : "pf-filter"
                  }
                  onClick={() => setActiveFilter("all")}
                >
                  Semua
                </button>
                <button
                  type="button"
                  className={
                    activeFilter === "belum" ? "pf-filter active" : "pf-filter"
                  }
                  onClick={() => setActiveFilter("belum")}
                >
                  Belum dicoba
                </button>
                <button
                  type="button"
                  className={
                    activeFilter === "sudah" ? "pf-filter active" : "pf-filter"
                  }
                  onClick={() => setActiveFilter("sudah")}
                >
                  Sudah dicoba
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="pf-counter" id="fav-counter">
          Menampilkan {kulinerTampil.length} dari {favorites.length} kuliner
        </p>

        <div className="row g-3" id="fav-list">
          {kulinerTampil.map(function (item) {
            return (
              <FavoriteCard
                key={item.id}
                region={item.region}
                done={item.done}
                onMark={() => tandaiKuliner(item.id)}
                onDelete={() => bukaModalHapus(item)}
              >
                {item.name}
              </FavoriteCard>
            );
          })}
        </div>

        {kulinerTampil.length === 0 && (
          <div className="pf-empty" id="fav-empty">
            <i className="bi bi-emoji-neutral"></i>
            <p id="fav-empty-text" className="mb-0">
              {favorites.length === 0
                ? "Daftarmu masih kosong. Yuk tambah kuliner pertamamu!"
                : "Tidak ada kuliner yang cocok dengan pencarian atau filter ini."}
            </p>
          </div>
        )}
      </section>

      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
        contentClassName="bg-light pf-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title as="h2" className="h4" id="deleteTitle">
            Hapus dari daftar?
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-0">
            <b id="delete-name">{deleteTargetName}</b> akan dihapus dari daftar
            favoritmu.
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <button
            type="button"
            className="btn btn-profile-outline"
            onClick={() => setShowDeleteModal(false)}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-profile"
            id="confirm-delete"
            onClick={konfirmasiHapus}
          >
            Ya, Hapus
          </button>
        </Modal.Footer>
      </Modal>
    </>
  );
}