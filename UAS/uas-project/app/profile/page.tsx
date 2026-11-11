"use client";

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Modal } from "react-bootstrap";
import ProfileCard from "@/components/profile/ProfileCard";
import StatCard from "@/components/profile/StatCard";
import FavoriteCard from "@/components/profile/FavoriteCard";
import { gambarAman } from "@/lib/content";
import { useSiteContent } from "@/lib/siteContent";
import { useAuth } from "@/lib/AuthContent";
import { apiFetch } from "@/lib/api";

interface FavoriteItem {
  id: number;
  user_id?: number;
  name: string;
  region: string;
  done: boolean;
}

export default function ProfilePage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const { teks } = useSiteContent("profile");
  const daftarPilihanWilayah = teks("profile.regions")
    .split("\n")
    .map((w) => w.trim())
    .filter((w) => w !== "");


  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Student & Programmer");
  const [bio, setBio] = useState(
    "I am an Informatics Engineering student from Belitung, and I currently run tutoring classes in Python programming, piano, basketball, and taekwondo."
  );
  const [tags, setTags] = useState<string[]>([
    "AnimLovers",
    "Untarian",
    "Soushin",
  ]);
  const [avatar, setAvatar] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [editName, setEditName] = useState("");
  const [editRole, setEditRole] = useState("");
  const [editBio, setEditBio] = useState("");
  const [editTags, setEditTags] = useState("");
  const [sumberFoto, setSumberFoto] = useState("");
  const [editAvatar, setEditAvatar] = useState("");
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [zoomFoto, setZoomFoto] = useState(100);
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

  const urlProfile = "/profile";
  const urlFav = "/favorites";

  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    async function ambilDataDariBackend() {
      try {
        const resProfile = await apiFetch(urlProfile);

        if (resProfile.ok) {
          const dataUser = await resProfile.json();

          setName(dataUser.name);
          setEmail(dataUser.email);
          if (dataUser.role) setRole(dataUser.role);
          if (dataUser.bio) setBio(dataUser.bio);
          if (dataUser.avatar !== undefined) {
            setAvatar(dataUser.avatar || "");
          }
          if (dataUser.tags) {
            setTags(
              String(dataUser.tags)
                .split(",")
                .filter((t) => t.trim() !== "")
            );
          }
        }

        const resFav = await apiFetch(urlFav);
        if (resFav.ok) {
          const dataFav = await resFav.json();
          setFavorites(dataFav);
        }
      } catch (e) {
        console.log(e);
      }
    }

    if (!authLoading && user) {
      ambilDataDariBackend();
    }
  }, [authLoading, user]);

  function tampilkanPesan(teksPesan: string, tipe: string) {
    setMessageText(teksPesan);
    setMessageType(tipe);
    setTimeout(function () {
      setMessageText("");
    }, 3000);
  }

  function prosesPosisiFoto(
    dataUrlAsli: string,
    geserX: number,
    geserY: number,
    skalaZoom: number
  ) {
    if (!dataUrlAsli) {
      setEditAvatar("");
      return;
    }

    const img = new window.Image();
    img.onload = function () {
      const ukuranCanvas = 200;
      const canvas = document.createElement("canvas");
      canvas.width = ukuranCanvas;
      canvas.height = ukuranCanvas;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = "#a49f4d";
      ctx.fillRect(0, 0, ukuranCanvas, ukuranCanvas);
      const skalaDasar = Math.max(
        ukuranCanvas / img.width,
        ukuranCanvas / img.height
      );
      const skalaAkhir = skalaDasar * (skalaZoom / 100);

      const lebarGambar = img.width * skalaAkhir;
      const tinggiGambar = img.height * skalaAkhir;
      const titikX = (ukuranCanvas - lebarGambar) / 2 + geserX;
      const titikY = (ukuranCanvas - tinggiGambar) / 2 + geserY;

      ctx.drawImage(img, titikX, titikY, lebarGambar, tinggiGambar);
      const hasilBase64 = canvas.toDataURL("image/jpeg", 0.85);
      setEditAvatar(hasilBase64);
    };
    img.src = dataUrlAsli;
  }

  function pilihFileFoto(e: ChangeEvent<HTMLInputElement>) {
    const daftarFile = e.target.files;
    if (!daftarFile || daftarFile.length === 0) return;

    const file = daftarFile[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setEditError("File yang dipilih harus berupa gambar (JPG/PNG/WebP).");
      return;
    }

    const reader = new FileReader();
    reader.onload = function () {
      if (typeof reader.result === "string") {
        setSumberFoto(reader.result);
        setPosX(0);
        setPosY(0);
        setZoomFoto(100);
        setEditError("");
        prosesPosisiFoto(reader.result, 0, 0, 100);
      }
    };
    reader.readAsDataURL(file);
  }

  function ubahPosisiX(nilaiBaru: number) {
    setPosX(nilaiBaru);
    prosesPosisiFoto(sumberFoto, nilaiBaru, posY, zoomFoto);
  }

  function ubahPosisiY(nilaiBaru: number) {
    setPosY(nilaiBaru);
    prosesPosisiFoto(sumberFoto, posX, nilaiBaru, zoomFoto);
  }

  function ubahZoomFoto(nilaiBaru: number) {
    setZoomFoto(nilaiBaru);
    prosesPosisiFoto(sumberFoto, posX, posY, nilaiBaru);
  }

  function resetPosisiFoto() {
    setPosX(0);
    setPosY(0);
    setZoomFoto(100);
    prosesPosisiFoto(sumberFoto, 0, 0, 100);
  }

  function hapusFotoProfil() {
    setSumberFoto("");
    setEditAvatar("");
    setPosX(0);
    setPosY(0);
    setZoomFoto(100);
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

  function bukaModalEdit() {
    setEditName(name);
    setEditRole(role);
    setEditBio(bio);
    setEditTags(tags.join(", "));
    setSumberFoto(avatar);
    setEditAvatar(avatar);
    setPosX(0);
    setPosY(0);
    setZoomFoto(100);
    setEditError("");
    setShowEditModal(true);
  }

  async function simpanProfil() {
    const namaBaru = editName.trim();
    const roleBaru = editRole.trim();
    const bioBaru = editBio.trim();

    if (namaBaru.length < 3) {
      setEditError("Nama minimal 3 karakter ya.");
      return;
    }

    if (roleBaru.length < 3) {
      setEditError("Role minimal 3 karakter ya.");
      return;
    }

    const potonganTag = editTags.split(",");
    const tagBersih: string[] = [];
    for (let i = 0; i < potonganTag.length; i++) {
      const bagian = potonganTag[i];
      if (bagian !== undefined) {
        const t = bagian.replace(/#/g, "").trim();
        if (t !== "" && tagBersih.length < 6) {
          tagBersih.push(t);
        }
      }
    }

    try {
      const res = await apiFetch(urlProfile, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: namaBaru,
          role: roleBaru,
          bio: bioBaru,
          tags: tagBersih.join(","),
          avatar: editAvatar,
        }),
      });

      if (res.ok) {
        setName(namaBaru);
        setRole(roleBaru);
        setBio(bioBaru);
        setTags(tagBersih);
        setAvatar(editAvatar);
        setShowEditModal(false);
        tampilkanPesan("Profil berhasil diperbarui!", "ok");
      } else {
        setEditError("Gagal menyimpan perubahan profil ke server.");
      }
    } catch (e) {
      console.log(e);
      setEditError("Terjadi kesalahan jaringan saat menyimpan profil.");
    }
  }

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }

  const totalFavorit = favorites.length;
  let totalSudahDicoba = 0;
  const daftarWilayah: string[] = [];

  for (let i = 0; i < favorites.length; i++) {
    const itemFav = favorites[i];
    if (itemFav && itemFav.done === true) {
      totalSudahDicoba = totalSudahDicoba + 1;
      if (!daftarWilayah.includes(itemFav.region)) {
        daftarWilayah.push(itemFav.region);
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

  const hurufAvatar = name ? name.charAt(0).toUpperCase() : "W";
  const hurufPreviewEdit = editName ? editName.charAt(0).toUpperCase() : hurufAvatar;

  if (authLoading || !user) return null;

  return (
    <main className="pf-page">
      <section className="pf-hero container" aria-labelledby="pf-name">
        <div className="row g-4">
          <div className="col-lg-4">
            <ProfileCard className="pf-id-card h-100">
              <figure className="pf-cover m-0">
                <Image
                  src={gambarAman("profile.cover.image", teks("profile.cover.image"))}
                  alt={teks("profile.cover.alt")}
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
                {avatar ? (
                  <Image
                    src={avatar}
                    alt={name}
                    className="pf-avatar-img"
                  />
                ) : (
                  hurufAvatar
                )}
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
          {/* Bagian Foto Profil & Pengaturan Posisi */}
          <div className="mb-3 text-center">
            <div className="pf-avatar-preview">
              {editAvatar ? (
                <Image
                  src={editAvatar}
                  alt="Preview Foto Profil"
                  className="pf-avatar-img"
                />
              ) : (
                hurufPreviewEdit
              )}
            </div>

            <div className="d-flex justify-content-center gap-2 flex-wrap mb-2">
              <label htmlFor="upload-avatar" className="btn btn-profile btn-sm">
                <i className="bi bi-camera-fill"></i>{" "}
                {editAvatar ? "Ganti Foto" : "Upload Foto"}
              </label>
              <input
                type="file"
                id="upload-avatar"
                accept="image/*"
                className="d-none"
                onChange={pilihFileFoto}
              />

              {editAvatar && (
                <button
                  type="button"
                  className="btn btn-trash btn-sm"
                  onClick={hapusFotoProfil}
                >
                  <i className="bi bi-trash3-fill"></i> Hapus Foto
                </button>
              )}
            </div>

            {sumberFoto && (
              <div className="p-3 mt-2 rounded border bg-white text-start">
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span className="fw-bold small">Atur Posisi Foto di Lingkaran</span>
                  <button
                    type="button"
                    className="btn btn-link btn-sm p-0 text-decoration-none"
                    onClick={resetPosisiFoto}
                  >
                    Reset Posisi
                  </button>
                </div>

                <div className="mb-2">
                  <label htmlFor="slider-pos-x" className="form-label small mb-0">
                    Geser Kiri / Kanan ({posX}px)
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    id="slider-pos-x"
                    min={-100}
                    max={100}
                    value={posX}
                    onChange={(e) => ubahPosisiX(Number(e.target.value))}
                  />
                </div>

                <div className="mb-2">
                  <label htmlFor="slider-pos-y" className="form-label small mb-0">
                    Geser Atas / Bawah ({posY}px)
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    id="slider-pos-y"
                    min={-100}
                    max={100}
                    value={posY}
                    onChange={(e) => ubahPosisiY(Number(e.target.value))}
                  />
                </div>

                <div>
                  <label htmlFor="slider-zoom" className="form-label small mb-0">
                    Ukuran / Zoom ({zoomFoto}%)
                  </label>
                  <input
                    type="range"
                    className="form-range"
                    id="slider-zoom"
                    min={60}
                    max={200}
                    value={zoomFoto}
                    onChange={(e) => ubahZoomFoto(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="mb-3">
            <label htmlFor="edit-name" className="form-label fw-bold">
              Nama
            </label>
            <input
              type="text"
              className="form-control"
              id="edit-name"
              maxLength={30}
              placeholder="Masukkan nama lengkap"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
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