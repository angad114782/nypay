import React, { createContext, useState } from "react";

export const GlobalContext = createContext();

export const GlobalProvider = ({ children }) => {
  const [walletBalance, setWalletBalance] = useState("10,00,000");

  const myIdCardData = [
    {
      logoSrc: "Logo-Exchages.png",
      username: "kinguser247",
      password: "king@2024",
      gameURL: "www.kingexchange247.com",
      gameName: "King Exchange 247",
    },
    {
      logoSrc: "Logo-Exchages.png",
      username: "zerochampion",
      password: "zero#pass1",
      gameURL: "www.zeroexchange.com",
      gameName: "Zero Exchange",
    },
    {
      logoSrc: "Logo-Exchages.png",
      username: "oneplayerx",
      password: "one123!@#",
      gameURL: "www.oneoexchange.com",
      gameName: "OneO Pro",
    },
    {
      logoSrc: "Logo-Exchages.png",
      username: "twogamer22",
      password: "two2win$$",
      gameURL: "www.twoexchange.com",
      gameName: "TwoX Arena",
    },
    {
      logoSrc: "Logo-Exchages.png",
      username: "tierlegend",
      password: "tierzone456",
      gameURL: "www.tierexchange.com",
      gameName: "Tier Zone",
    },
    {
      logoSrc: "Logo-Exchages.png",
      username: "leo_strike",
      password: "strikeLeo@2025",
      gameURL: "www.tierexchange.com",
      gameName: "Tier Legends",
    },
  ];

  const allCreateIDList = [
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Asia)",
      type: "Asia Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (D247)",
      type: "D247 Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Diamond)",
      type: "Diamond Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Diamond99)",
      type: "Diamond99 Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (King)",
      type: "King Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Lotusbook)",
      type: "Lotusbook Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Lotusexch)",
      type: "Lotusexch Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
    {
      logo: "Logo-Exchages.png",
      title: "Go Exchange (Radhe)",
      type: "Radhe Type",
      subtitle: "gomatch9.com",
      buttonText: "Create",
    },
  ];

  return <GlobalContext.Provider value={{ walletBalance, setWalletBalance, myIdCardData, allCreateIDList }}>{children}</GlobalContext.Provider>;
};
