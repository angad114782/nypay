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
            className="peer w-full p-4 rounded-2xl  text-sm text-black   h-[48px] ct-grey4 focus:outline-none"
            placeholder="Enter Your Name"
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
          } border rounded-2xl overflow-visible focus-within:border-[var(--theme-orange2)]`}
          style={{ position: "relative" }}
        >
          <label
            id="phone-label"
            className={`absolute -top-3 left-4 px-1 font-medium bg-white text-sm z-10 transition-colors duration-200 ${
              errors?.phone ? "text-red-500" : "text-[var(--theme-grey3)]"
            }`}
          >
            Phone Number
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
              fontSize: "14px",
              fontWeight: "500",
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
              placeholder: "Enter Phone Number",
              onFocus: (e) => {
                const label = e.target
                  .closest(".relative")
                  ?.querySelector("label");
                if (label && !errors?.phone) {
                  label.style.color = "var(--theme-orange2)";
                }
              },
              onBlur: (e) => {
                const label = e.target
                  .closest(".relative")
                  ?.querySelector("label");
                if (label && !errors?.phone) {
                  label.style.color = "var(--theme-grey3)";
                }
              },
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
            className="peer w-full p-4 rounded-2xl  text-sm h-[48px] ct-grey4  focus:outline-none"
            placeholder="user@example.com"
          />
          <label
            className={`absolute -top-3 left-4 px-1 text-sm font-medium bg-white transition-colors duration-200
          ${
            errors?.email
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
