import Link from "next/link";
import { FC, memo } from "react";
import { AuthPromptProps } from "./auth-prompt.types";

const AuthPrompt: FC<AuthPromptProps> = (props) => {
  const { chatPromptText, path, linkTitle } = props;
  return (
    <div className="mt-6 text-center">
      <p className="text-sm text-gray-300">
        {chatPromptText}
        <Link
          href={path}
          className="text-sm text-gold-900 no-underline hover:text-gold-700 ml-1"
        >
          {linkTitle}
        </Link>
      </p>
    </div>
  );
};

export default memo(AuthPrompt);
