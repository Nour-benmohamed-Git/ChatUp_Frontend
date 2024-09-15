import { FC } from "react";
import { ImSpinner9 } from "react-icons/im";

const Loader: FC = () => {
  return (
    <div className="flex items-center justify-center">
      <ImSpinner9 className="animate-spin  h-8 w-8 text-gold-900" />
    </div>
  );
};
export default Loader;
