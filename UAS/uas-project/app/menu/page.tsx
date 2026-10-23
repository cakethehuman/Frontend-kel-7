import Navbar from "@/components/Navbar";

import MenuButton from "@/components/menu/MenuButton";
import Menu from "@/components/menu/Menu";

export default function MenuPage() {
  return (
    <>
    <Navbar />

    <div className="d-flex justify-content-center">
      <div className="bg-danger px-4 py-1 rounded-pill text-center text-white fs-2">
        <h1>Menu</h1>
      </div>
    </div>
    <MenuButton />
    <Menu />
    </>
  );
}


