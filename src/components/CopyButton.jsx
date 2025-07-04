import { useState } from "react";
import { Copy, ClipboardCheck, CopyCheck } from "lucide-react";

const CopyButton = ({ textToCopy, title }) => {
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
      className="ml-1 p-1  rounded transition"
    >
      {copied ? (
        <CopyCheck className="h-4 w-4 text-green-600" />
      ) : (
        <Copy className="h-4 w-4" />
      )}
    </button>
  );
};

export default CopyButton;
