"use client";

import {
  useState,
  useEffect,
  type FormEvent,
  type ChangeEvent,
  type MouseEvent,
  type TouchEvent,
} from "react";
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

const UKURAN_LINGKARAN = 220;

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
  const [editAvatar, setEditAvatar] = useState("");
  const [editError, setEditError] = useState("");
  const [modeAturFoto, setModeAturFoto] = useState(false);
  const [sumberFotoMentah, setSumberFotoMentah] = useState("");
  const [lebarAsliFoto, setLebarAsliFoto] = useState(220);
  const [tinggiAsliFoto, setTinggiAsliFoto] = useState(220);
  const [posX, setPosX] = useState(0);
  const [posY, setPosY] = useState(0);
  const [skalaZoom, setSkalaZoom] = useState(1);
  const [sedangGeser, setSedangGeser] = useState(false);
  const [titikAwalX, setTitikAwalX] = useState(0);
  const [titikAwalY, setTitikAwalY] = useState(0);
  const [jarakCubitAwal, setJarakCubitAwal] = useState(0);
  const [zoomCubitAwal, setZoomCubitAwal] = useState(1);
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
        const dataUrl = reader.result;
        const img = new window.Image();
        img.onload = function () {
          setLebarAsliFoto(img.width || 220);
          setTinggiAsliFoto(img.height || 220);
          setSumberFotoMentah(dataUrl);
          setPosX(0);
          setPosY(0);
          setSkalaZoom(1);
          setEditError("");
          setModeAturFoto(true);
        };
        img.src = dataUrl;
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  }

  function mulaiGeserMouse(e: MouseEvent<HTMLDivElement>) {
    e.preventDefault();
    setSedangGeser(true);
    setTitikAwalX(e.clientX - posX);
    setTitikAwalY(e.clientY - posY);
  }

  function gerakGeserMouse(e: MouseEvent<HTMLDivElement>) {
    if (!sedangGeser) return;
    setPosX(e.clientX - titikAwalX);
    setPosY(e.clientY - titikAwalY);
  }

  function selesaiGeserMouse() {
    setSedangGeser(false);
  }

  function hitungJarakDuaJari(t1: React.Touch, t2: React.Touch) {
    const dx = t1.clientX - t2.clientX;
    const dy = t1.clientY - t2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }

  function mulaiSentuhLayar(e: TouchEvent<HTMLDivElement>) {
    if (e.touches.length === 1) {
      const sentuhan = e.touches[0];
      if (!sentuhan) return;
      setSedangGeser(true);
      setTitikAwalX(sentuhan.clientX - posX);
      setTitikAwalY(sentuhan.clientY - posY);
    } else if (e.touches.length === 2) {
      const jari1 = e.touches[0];
      const jari2 = e.touches[1];
      if (!jari1 || !jari2) return;
      setSedangGeser(false);
      setJarakCubitAwal(hitungJarakDuaJari(jari1, jari2));
      setZoomCubitAwal(skalaZoom);
    }
  }

  function gerakSentuhLayar(e: TouchEvent<HTMLDivElement>) {
    if (e.touches.length === 1 && sedangGeser) {
      const sentuhan = e.touches[0];
      if (!sentuhan) return;
      setPosX(sentuhan.clientX - titikAwalX);
      setPosY(sentuhan.clientY - titikAwalY);
    } else if (e.touches.length === 2 && jarakCubitAwal > 0) {
      const jari1 = e.touches[0];
      const jari2 = e.touches[1];
      if (!jari1 || !jari2) return;
      const jarakSekarang = hitungJarakDuaJari(jari1, jari2);
      const rasio = jarakSekarang / jarakCubitAwal;
      const zoomBaru = Math.min(3, Math.max(0.5, zoomCubitAwal * rasio));
      setSkalaZoom(zoomBaru);
    }
  }

  function selesaiSentuhLayar() {
    setSedangGeser(false);
    setJarakCubitAwal(0);
  }

  function perbesarFoto() {
    setSkalaZoom(Math.min(3, Number((skalaZoom + 0.15).toFixed(2))));
  }

  function perkecilFoto() {
    setSkalaZoom(Math.max(0.5, Number((skalaZoom - 0.15).toFixed(2))));
  }

  function resetPosisiFoto() {
    setPosX(0);
    setPosY(0);
    setSkalaZoom(1);
  }

  function terapkanPotonganFoto() {
    if (!sumberFotoMentah) return;

    const img = new window.Image();
    img.onload = function () {
      const canvas = document.createElement("canvas");
      canvas.width = UKURAN_LINGKARAN;
      canvas.height = UKURAN_LINGKARAN;

      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      ctx.fillStyle = "#A49F4D";
      ctx.fillRect(0, 0, UKURAN_LINGKARAN, UKURAN_LINGKARAN);

      const skalaDasar = Math.max(
        UKURAN_LINGKARAN / img.width,
        UKURAN_LINGKARAN / img.height
      );
      const skalaAkhir = skalaDasar * skalaZoom;

      const lebarGambar = img.width * skalaAkhir;
      const tinggiGambar = img.height * skalaAkhir;

      const titikX = (UKURAN_LINGKARAN - lebarGambar) / 2 + posX;
      const titikY = (UKURAN_LINGKARAN - tinggiGambar) / 2 + posY;

      ctx.drawImage(img, titikX, titikY, lebarGambar, tinggiGambar);

      const hasilBase64 = canvas.toDataURL("image/jpeg", 0.85);
      setEditAvatar(hasilBase64);
      setModeAturFoto(false);
    };
    img.src = sumberFotoMentah;
  }

  function hapusFotoProfil() {
    setSumberFotoMentah("");
    setEditAvatar("");
    setPosX(0);
    setPosY(0);
    setSkalaZoom(1);
    setModeAturFoto(false);
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
    setEditAvatar(avatar);
    setSumberFotoMentah("");
    setModeAturFoto(false);
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
  const hurufPreviewEdit = editName
    ? editName.charAt(0).toUpperCase()
    : hurufAvatar;

  const skalaDasarPreview = Math.max(
    UKURAN_LINGKARAN / lebarAsliFoto,
    UKURAN_LINGKARAN / tinggiAsliFoto
  );
  const lebarTampilPreview = lebarAsliFoto * skalaDasarPreview * skalaZoom;
  const tinggiTampilPreview = tinggiAsliFoto * skalaDasarPreview * skalaZoom;
  const kiriTampilPreview = (UKURAN_LINGKARAN - lebarTampilPreview) / 2 + posX;
  const atasTampilPreview =
    (UKURAN_LINGKARAN - tinggiTampilPreview) / 2 + posY;

  if (authLoading || !user) return null;

  return (
    <main className="pf-page">
      <section className="pf-hero container" aria-labelledby="pf-name">
        <div className="row g-4">
          <div className="col-lg-4">
            <ProfileCard className="pf-id-card h-100">
              <figure className="pf-cover m-0">
                <Image
                  src={gambarAman(
                    "profile.cover.image",
                    teks("profile.cover.image")
                  )}
                  alt={teks("profile.cover.alt")}
                  width={400}
                  height={190}
                  className="pf-cover-img"
                  priority
                />
                <figcaption className="pf-cover-caption">
                  <i className="bi bi-heart-fill"></i>{" "}
                  {teks("profile.cover.caption")}
                </figcaption>
              </figure>

              <div className="pf-avatar" id="pf-avatar" aria-hidden="true">
                {avatar ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={avatar} alt={name} className="pf-avatar-img" />
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
                  <i className="bi bi-geo-alt-fill"></i>{" "}
                  {teks("profile.location")}
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
        {modeAturFoto ? (
          /* ====== TAMPILAN PENGATUR POSISI FOTO (TEMA MIE BELITUNG) ====== */
          <>
            <Modal.Header className="border-0 pb-1 d-flex justify-content-between align-items-center">
              <Modal.Title as="h2" className="h5 m-0">
                Sesuaikan Foto Profil
              </Modal.Title>

              <label
                htmlFor="upload-avatar-ulang"
                className="btn btn-profile-outline btn-sm m-0"
              >
                <i className="bi bi-image"></i> Pilih Foto Lain
              </label>
              <input
                type="file"
                id="upload-avatar-ulang"
                accept="image/*"
                className="d-none"
                onChange={pilihFileFoto}
              />
            </Modal.Header>

            <Modal.Body className="text-center pt-2">
              <div
                className="pf-cropper-stage mb-3"
                onMouseDown={mulaiGeserMouse}
                onMouseMove={gerakGeserMouse}
                onMouseUp={selesaiGeserMouse}
                onMouseLeave={selesaiGeserMouse}
                onTouchStart={mulaiSentuhLayar}
                onTouchMove={gerakSentuhLayar}
                onTouchEnd={selesaiSentuhLayar}
              >
                <div className="pf-cropper-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={sumberFotoMentah}
                    alt="Atur posisi foto"
                    className="pf-cropper-img"
                    style={{
                      width: lebarTampilPreview + "px",
                      height: tinggiTampilPreview + "px",
                      left: kiriTampilPreview + "px",
                      top: atasTampilPreview + "px",
                    }}
                  />
                </div>

                <div className="pf-cropper-circle-mask"></div>
              </div>

              <div className="d-flex justify-content-center align-items-center mb-2">
                <div className="pf-cropper-controls">
                  <button
                    type="button"
                    className="pf-zoom-btn"
                    onClick={perkecilFoto}
                    title="Perkecil"
                  >
                    <i className="bi bi-dash-lg"></i>
                  </button>
                  <span className="pf-zoom-label">
                    {Math.round(skalaZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    className="pf-zoom-btn"
                    onClick={perbesarFoto}
                    title="Perbesar"
                  >
                    <i className="bi bi-plus-lg"></i>
                  </button>
                  <button
                    type="button"
                    className="pf-zoom-btn"
                    onClick={resetPosisiFoto}
                    title="Reset Posisi"
                  >
                    <i className="bi bi-arrow-counterclockwise"></i>
                  </button>
                </div>
              </div>

              <p className="pf-cropper-hint mb-0">
                Geser foto di dalam lingkaran. Gunakan tombol <b>+</b> / <b>-</b>{" "}
                (atau cubit layar di HP) untuk mengatur ukuran.
              </p>
            </Modal.Body>

            <Modal.Footer className="border-0 pt-0">
              <button
                type="button"
                className="btn btn-profile-outline"
                onClick={() => setModeAturFoto(false)}
              >
                Kembali
              </button>
              <button
                type="button"
                className="btn btn-profile"
                onClick={terapkanPotonganFoto}
              >
                <i className="bi bi-check2-circle"></i> Terapkan Foto
              </button>
            </Modal.Footer>
          </>
        ) : (
          /* ====== TAMPILAN FORM EDIT PROFIL BIASA ====== */
          <>
            <Modal.Header closeButton className="border-0 pb-0">
              <Modal.Title as="h2" className="h4" id="editTitle">
                Edit Profil
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3 text-center">
                <div className="pf-avatar-preview">
                  {editAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={editAvatar}
                      alt="Preview Foto Profil"
                      className="pf-avatar-img"
                    />
                  ) : (
                    hurufPreviewEdit
                  )}
                </div>

                <div className="d-flex justify-content-center gap-2 flex-wrap">
                  <label
                    htmlFor="upload-avatar"
                    className="btn btn-profile btn-sm"
                  >
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
          </>
        )}
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