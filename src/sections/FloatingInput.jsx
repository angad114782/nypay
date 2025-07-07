import PhoneInput from "react-phone-input-2";

export default function FloatingInput({
  name,
  phone,
  setName,
  setPhone,
  setEmail,
  email,
  errors,
}) {
  return (
    <div className="space-y-6 py-4 mt-4">
      {/* Conditionally render Name Input only if setName is provided */}
      {setName && (
        <div
          className={`relative ${
            errors?.name ? "border-red-500" : "border-gray-300"
          } border rounded-2xl focus-within:border-[var(--theme-orange2)]`}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="peer w-full p-4 rounded-2xl font-semibold text-lg h-[48px] ct-grey4 placeholder-transparent focus:outline-none"
            placeholder="John Williams"
          />
          <label
            className={`absolute -top-3 left-4 text-sm px-1 font-medium bg-white transition-colors duration-200
            ${
              errors?.name
                ? "text-red-500"
                : "peer-focus:text-[var(--theme-orange2)] text-[var(--theme-grey3)]"
            }`}
          >
            Name
          </label>
        </div>
      )}

      {/* Phone Input */}
      {setPhone && (
        <div
          className={`relative ${
            errors?.phone ? "border-red-500" : "border-gray-300"
          } border rounded-2xl focus-within:border-[var(--theme-orange2)] `}
          style={{ position: "relative" }}
        >
          <label
            className={`absolute -top-3 left-4 px-1 font-medium bg-white text-sm z-10 ${
              errors?.phone
                ? "text-red-500"
                : "peer-focus:text-[var(--theme-orange2)] text-[var(--theme-grey3)]"
            }`}
          >
            Mobile WhatsApp
          </label>
          <PhoneInput
            country="in"
            value={phone}
            onChange={setPhone}
            inputStyle={{
              width: "100%",
              height: "48px",
              borderRadius: "16px",
              backgroundColor: "white",
              border: "none",
              paddingLeft: "48px",
              fontSize: "16px",
              fontWeight: "600",
              boxShadow: "none",
            }}
            buttonStyle={{
              border: "none",
              backgroundColor: "transparent",
              borderRadius: "16px 0 0 16px",
              boxShadow: "none",
              padding: "4px",
            }}
            dropdownStyle={{
              backgroundColor: "white",
              border: "1px solid #d1d5db",
              borderRadius: "8px",
            }}
            containerStyle={{
              width: "100%",
              borderRadius: "16px",
            }}
            inputProps={{
              name: "phone",
              required: true,
              placeholder: "Mobile WhatsApp Number",
            }}
          />
        </div>
      )}
      {/* Email Input */}
      {setEmail && (
        <div
          className={`relative ${
            errors?.email ? "border-red-500" : "border-gray-300"
          } border rounded-2xl focus-within:border-[var(--theme-orange2)]`}
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="peer w-full p-4 rounded-2xl font-semibold text-lg h-[48px] ct-grey4 placeholder-transparent focus:outline-none"
            placeholder="+91 XXXXXXXXXX"
          />
          <label
            className={`absolute -top-3 left-4 px-1 text-sm font-medium bg-white transition-colors duration-200
          ${
            errors?.phone
              ? "text-red-500"
              : "peer-focus:text-[var(--theme-orange2)] text-[var(--theme-grey3)]"
          }`}
          >
            Email
          </label>
        </div>
      )}
    </div>
  );
}
