"use client";

import Image from "next/image";
import ProfileCard from "@/components/profile/ProfileCard";
import StatCard from "@/components/profile/StatCard";
import { gambarAman } from "@/lib/content";
import { useSiteContent } from "@/lib/siteContent";

export interface FavoriteItem {
  id: number;
  user_id?: number;
  name: string;
  region: string;
  done: boolean;
}

interface ProfileHeroProps {
  name: string;
  email: string;
  role: string;
  bio: string;
  tags: string[];
  avatar: string;
  favorites: FavoriteItem[];
  onOpenEdit: () => void;
  onOpenPhoto: () => void;
  onLogout: () => void;
}

export default function ProfileHero({
  name,
  email,
  role,
  bio,
  tags,
  avatar,
  favorites,
  onOpenEdit,
  onOpenPhoto,
  onLogout,
}: ProfileHeroProps) {
  const { teks } = useSiteContent("profile");

  const hurufAvatar = name ? name.charAt(0).toUpperCase() : "W";

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

  return (
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

            <div
              className="pf-avatar pf-avatar-clickable"
              id="pf-avatar"
              onClick={onOpenPhoto}
              title="Klik untuk melihat foto profil"
              role="button"
              tabIndex={0}
            >
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
                  onClick={onOpenEdit}
                >
                  <i className="bi bi-pencil-square"></i> Edit Profil
                </button>
                <button
                  type="button"
                  className="btn btn-logout"
                  onClick={onLogout}
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
  );
}