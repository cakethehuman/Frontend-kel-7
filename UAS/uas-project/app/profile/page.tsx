"use client";

import { useState, useEffect, type FormEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal, Spinner } from "react-bootstrap";
import ProfileCard from "@/components/profile/ProfileCard";
import StatCard from "@/components/profile/StatCard";
import FavoriteCard from "@/components/profile/FavoriteCard";
import { useSiteContent } from "@/lib/siteContent";
import { useAuth } from "@/lib/AuthContent";
import { API_URL } from "@/lib/api";

interface FavoriteItem {
  id: number;
  user_id?: number;
  name: string;
  region: string;
  done: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const { user, loading, logout, refresh } = useAuth();
  const { teks } = useSiteContent("profile");
  const daftarPilihanWilayah = teks("profile.regions")
    .split("\n")
    .map((w) => w.trim())
    .filter((w) => w !== "");

  // Data profil diambil dari `user` (hasil /api/auth/me), bukan dari nilai dummy.
  const name = user?.name ?? "";
  const email = user?.email ?? "";
  const role = user?.role ?? "";
  const bio = user?.bio ?? "";
  const tags = (user?.tags ?? "")
    .split(",")
    .map((t) => t.trim())
    .filter((t) => t !== "");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editRole, setEditRole] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editTags, setEditTags] = useState("");
  const [editError, setEditError] = useState("");

  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [inputName, setInputName] = useState("");
  const [inputRegion, setInputRegion] = useState("Sumatra");
  const wilayahDipilih = daftarPilihanWilayah.includes(inputRegion)
    ? inputRegion
    : (daftarPilihanWilayah[0] ?? "");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("ok");

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [deleteTargetName, setDeleteTargetName] = useState("");

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/auth/login");
      return;
    }

    async function ambilFavorit() {
      try {
        const res = await fetch(API_URL + "/api/favorites", {
          credentials: "include",
        });
        if (res.status === 401) {
          router.replace("/auth/login");
          return;
        }
        if (res.ok) setFavorites(await res.json());
      } catch (e) {
        console.log(e);
      }
    }

    ambilFavorit();
  }, [loading, user, router]);

  function tampilkanPesan(teks: string, tipe: string) {
    setMessageText(teks);
    setMessageType(tipe);
    setTimeout(function () {
      setMessageText("");
    }, 3000);
  }

  async function tambahKuliner(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const namaBersih = inputName.trim();

    if (namaBersih.length < 3) {
      tampilkanPesan("Nama kuliner minimal 3 karakter ya.", "error");
      return;
    }

    let sudahAda = false;
    for (let i = 0; i < favorites.length; i++) {
      if (favorites[i].name.toLowerCase() === namaBersih.toLowerCase()) {
        sudahAda = true;
      }
    }

    if (sudahAda) {
      tampilkanPesan(namaBersih + " sudah ada di daftarmu.", "error");
      return;
    }

    try {
      const res = await fetch(API_URL + "/api/favorites", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
      if (favorites[i].id === id) {
        statusBaru = !favorites[i].done;
      }
    }

    try {
      const res = await fetch(API_URL + "/api/favorites", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
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
      const res = await fetch(API_URL + "/api/favorites", {
        method: "DELETE",
        credentials: "include",
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

  function bukaModalEdit() {
    setEditRole(role);
    setEditBio(bio);
    setEditTags(tags.join(", "));
    setEditError("");
    setShowEditModal(true);
  }

  async function simpanProfil() {
    const roleBaru = editRole.trim();
    const bioBaru = editBio.trim();

    if (roleBaru.length < 3) {
      setEditError("Role minimal 3 karakter ya.");
      return;
    }

    const potonganTag = editTags.split(",");
    const tagBersih: string[] = [];
    for (let i = 0; i < potonganTag.length; i++) {
      const t = potonganTag[i].replace(/#/g, "").trim();
      if (t !== "" && tagBersih.length < 6) {
        tagBersih.push(t);
      }
    }

    try {
      const res = await fetch(API_URL + "/api/profile", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          role: roleBaru,
          bio: bioBaru,
          tags: tagBersih.join(","),
        }),
      });

      if (res.ok) {
        await refresh(); // sinkronkan data user di AuthContext
        setShowEditModal(false);
      }
    } catch (e) {
      console.log(e);
    }
  }

  async function handleLogout() {
    await logout(); // hapus cookie di server + reset user di context
    router.replace("/auth/login");
  }

  const totalFavorit = favorites.length;
  let totalSudahDicoba = 0;
  const daftarWilayah: string[] = [];

  for (let i = 0; i < favorites.length; i++) {
    if (favorites[i].done === true) {
      totalSudahDicoba = totalSudahDicoba + 1;
      if (!daftarWilayah.includes(favorites[i].region)) {
        daftarWilayah.push(favorites[i].region);
      }
    }
  }

  const totalWilayah = daftarWilayah.length;
  const persentaseProgress =
    totalFavorit === 0
      ? 0
      : Math.round((totalSudahDicoba / totalFavorit) * 100);

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

  const hurufAvatar = name ? name.charAt(0).toUpperCase() : "?";

  // Jangan render apa pun dari halaman profile sebelum status login jelas.
  if (loading || !user) {
    return (
      <main className="d-flex flex-column align-items-center justify-content-center flex-grow-1 py-5">
        <Spinner animation="border" />
      </main>
    );
  }

  return (
    <main className="pf-page">
      <section className="pf-hero container" aria-labelledby="pf-name">
        <div className="row g-4">
          <div className="col-lg-4">
            <ProfileCard className="pf-id-card h-100">
              <figure className="pf-cover m-0">
                <Image
                  src="/IMG/mie_belitung_muantap.webp"
                  alt="Mie Belitung, kuliner favorit utama"
                  width={400}
                  height={190}
                  className="pf-cover-img"
                  priority
                />
                <figcaption className="pf-cover-caption">
                  <i className="bi bi-heart-fill"></i> {teks("profile.cover.caption")}
                </figcaption>
              </figure>
              <div className="pf-avatar" id="pf-avatar" aria-hidden="true">
                {hurufAvatar}
              </div>
              <div className="pf-id-body text-center">
                <h1 className="pf-name" id="pf-name">
                  {name}
                </h1>
                <p className="pf-email" id="pf-email">
                  {email}
                </p>
                <p className="pf-loc">
                  <i className="bi bi-geo-alt-fill"></i> {teks("profile.location")}
                </p>
                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <button
                    type="button"
                    className="btn btn-profile"
                    onClick={bukaModalEdit}
                  >
                    <i className="bi bi-pencil-square"></i> Edit Profil
                  </button>
                  <button
                    type="button"
                    className="btn btn-logout"
                    onClick={handleLogout}
                  >
                    <i className="bi bi-door-closed"></i> Logout
                  </button>
                </div>
              </div>
            </ProfileCard>
          </div>

          <div className="col-lg-8 d-flex flex-column gap-4">
            <ProfileCard className="pf-bio">
              <p className="pf-label">{teks("profile.about.label")}</p>
              <h2 className="pf-title" id="pf-title">
                {role}
              </h2>
              <p className="pf-bio-text" id="pf-bio-text">
                {bio}
              </p>
              <div className="d-flex flex-wrap gap-2" id="pf-tags">
                {tags.map(function (tag, index) {
                  return (
                    <span key={index} className="pf-tag">
                      #{tag}
                    </span>
                  );
                })}
              </div>
            </ProfileCard>

            <div className="row g-3">
              <StatCard icon="bi-bookmark-heart-fill" angka={totalFavorit}>
                Total Favorit
              </StatCard>

              <StatCard icon="bi-check-circle-fill" angka={totalSudahDicoba}>
                Sudah Dicoba
              </StatCard>

              <StatCard icon="bi-compass-fill" angka={totalWilayah}>
                Wilayah Dijelajahi
              </StatCard>
            </div>

            <aside
              className="pf-card pf-progress"
              aria-label="Progres jelajah kuliner"
            >
              <div className="d-flex justify-content-between align-items-center mb-2">
                <span className="fw-bold">Progres Jelajah Kuliner</span>
                <span className="pf-progress-text" id="pf-progress-text">
                  {persentaseProgress}%
                </span>
              </div>
              <div
                className="progress"
                role="progressbar"
                aria-label="Progres jelajah"
                aria-valuenow={persentaseProgress}
                aria-valuemin={0}
                aria-valuemax={100}
                id="pf-progress"
              >
                <div
                  className="progress-bar"
                  id="pf-progress-bar"
                  style={{ width: persentaseProgress + "%" }}
                ></div>
              </div>
            </aside>
          </div>
        </div>
      </section>

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
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        centered
        contentClassName="bg-light pf-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title as="h2" className="h4" id="editTitle">
            Edit Profil
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="mb-3">
            <label htmlFor="edit-name" className="form-label fw-bold">
              Nama
            </label>
            <input
              type="text"
              className="form-control"
              id="edit-name"
              value={name}
              disabled
              readOnly
            />
            <div className="form-text">
              Nama sesuai akun pendaftaran dan tidak dapat diubah.
            </div>
          </div>
          <div className="mb-3">
            <label htmlFor="edit-role" className="form-label fw-bold">
              Role
            </label>
            <input
              type="text"
              className="form-control"
              id="edit-role"
              maxLength={40}
              placeholder="cth: Student & Programmer"
              value={editRole}
              onChange={(e) => setEditRole(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="edit-bio" className="form-label fw-bold">
              Bio
            </label>
            <textarea
              className="form-control"
              id="edit-bio"
              rows={4}
              maxLength={220}
              value={editBio}
              onChange={(e) => setEditBio(e.target.value)}
            ></textarea>
          </div>
          <div className="mb-2">
            <label htmlFor="edit-tags" className="form-label fw-bold">
              Hashtag
            </label>
            <input
              type="text"
              className="form-control"
              id="edit-tags"
              maxLength={120}
              placeholder="cth: AnimLovers, Full Stack Developer, Untarian"
              value={editTags}
              onChange={(e) => setEditTags(e.target.value)}
            />
            <div className="form-text">
              Pisahkan dengan koma, maksimal 6 hashtag.
            </div>
          </div>
          <p id="edit-error" className="pf-message pf-msg-error mb-0">
            {editError}
          </p>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <button
            type="button"
            className="btn btn-profile-outline"
            onClick={() => setShowEditModal(false)}
          >
            Batal
          </button>
          <button
            type="button"
            className="btn btn-profile"
            id="save-profile"
            onClick={simpanProfil}
          >
            Simpan
          </button>
        </Modal.Footer>
      </Modal>

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
    </main>
  );
}
