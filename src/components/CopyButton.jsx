import { Copy, CopyCheck } from "lucide-react";
import { useState } from "react";

const CopyButton = ({ textToCopy, title, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500); // reset after 1.5s
  };

  return (
    <button
      onClick={handleCopy}
      title={title || "Copy"}
      className={`ml-1 p-1 rounded transition `}
    >
      {copied ? (
        <CopyCheck className={`${className} h-4 w-4  text-green-600`} />
      ) : (
        <Copy className={`${className} h-4 w-4`} />
      )}
    </button>
  );
};

export default CopyButton;
