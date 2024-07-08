import { FC, memo } from "react";
import { ImSpinner9 } from "react-icons/im";

const SubmitButton: FC<SubmitButtonProps> = ({ isPending, text }) => {
  return (
    <button
      type="submit"
      disabled={isPending}
      data-te-ripple-init
      data-te-ripple-color="light"
      className="w-full flex justify-center items-center rounded-md bg-gold-900 px-6 py-2.5 text-sm font-medium uppercase text-gray-900 transition duration-150 ease-in-out hover:bg-gold-600"
    >
      {isPending ? <ImSpinner9 size={20} className="animate-spin" /> : text}
    </button>
  );
};
export default memo(SubmitButton);
