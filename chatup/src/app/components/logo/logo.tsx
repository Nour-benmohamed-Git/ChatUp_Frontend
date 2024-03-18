import { FC } from "react";
import { ImRocket } from "react-icons/im";

const Logo: FC = () => {
  return (
    <div className="flex w-full items-center justify-center gap-2 mb-10">
      <h3 className="text-4xl font-semibold text-center text-gold-900">CHAT</h3>
      <ImRocket size={30} className="text-gold-900" />
    </div>
  );
};
export default Logo;
