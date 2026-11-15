"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import ProfileHero, {
  type FavoriteItem,
} from "@/components/profile/ProfileHero";
import FavoriteSection from "@/components/profile/FavoriteSection";
import EditProfileModal from "@/components/profile/EditProfileModal";
import PhotoViewerModal from "@/components/profile/PhotoViewerModal";
import { useAuth } from "@/lib/AuthContent";
import { apiFetch } from "@/lib/api";

export default function ProfilePage() {
  const { user, loading: authLoading, logout, refresh } = useAuth();
  const router = useRouter();

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
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);

  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [messageType, setMessageType] = useState("ok");

  useEffect(() => {
    if (!authLoading && !user) router.replace("/auth/login");
  }, [authLoading, user, router]);

  useEffect(() => {
    async function ambilDataDariBackend() {
      try {
        const resProfile = await apiFetch("/profile");
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

        const resFav = await apiFetch("/favorites");
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

  async function handleLogout() {
    await logout();
    router.push("/auth/login");
  }

  if (authLoading || !user) return null;

  return (
    <main className="pf-page">
      <ProfileHero
        name={name}
        email={email}
        role={role}
        bio={bio}
        tags={tags}
        avatar={avatar}
        favorites={favorites}
        onOpenEdit={() => setShowEditModal(true)}
        onOpenPhoto={() => setShowPhotoModal(true)}
        onLogout={handleLogout}
      />

      <FavoriteSection
        favorites={favorites}
        setFavorites={setFavorites}
        messageText={messageText}
        messageType={messageType}
        tampilkanPesan={tampilkanPesan}
      />

      <PhotoViewerModal
        show={showPhotoModal}
        onHide={() => setShowPhotoModal(false)}
        name={name}
        role={role}
        avatar={avatar}
        onOpenEdit={() => setShowEditModal(true)}
      />

      <EditProfileModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        currentName={name}
        currentRole={role}
        currentBio={bio}
        currentTags={tags}
        currentAvatar={avatar}
        onSuccess={async (dataBaru) => {
          setName(dataBaru.name);
          setRole(dataBaru.role);
          setBio(dataBaru.bio);
          setTags(dataBaru.tags);
          setAvatar(dataBaru.avatar);
          await refresh();
          tampilkanPesan("Profil berhasil diperbarui!", "ok");
        }}
      />
    </main>
  );
}