import type { Dispatch, SetStateAction } from "react";
import Button from "./button";
import { signOut } from "next-auth/react";

const Menu = ({
  setOpenBreakModal,
}: {
  setOpenBreakModal: Dispatch<SetStateAction<boolean>>;
}) => {
  const handleSignOut = () => {
    setOpenBreakModal(false);
    void signOut();
  };
  return (
    <>
      <div className="text-center text-3xl">
        <Button title="Sign Out" onClickHandle={handleSignOut} />
      </div>
    </>
  );
};

export default Menu;
