import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Header from "../sections/Header";
import MyId from "../sections/MyId";
import CreateId from "../sections/CreateId";
import Footer from "../sections/Footer";

function Id() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const initialTab = searchParams.get("tab") || "myId";
  const [activeTab, setActiveTab] = useState(initialTab);

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const setTab = (tab) => {
    setActiveTab(tab);
    navigate(`/id?tab=${tab}`);
  };

  return (
    <div className="id-page">
      <Header />

      {/* Tabs */}
      <div className="flex justify-center space-x-1 mt-2.5 h-[51px] font-medium text-[15px] text-white border-b">
        <button
          className="flex-1 transition bgt-blue2 uppercase rounded-e-[5px] relative py-3"
          onClick={() => setTab("myId")}
        >
          My ID
          {activeTab === "myId" && (
            <div className="w-40 h-1.5 bg-[var(--theme-grey5)] absolute rounded-t-[5px] bottom-0 left-1/2 -translate-x-1/2"></div>
          )}
        </button>

        <button
          className="flex-1 transition bgt-blue2 uppercase rounded-s-[5px] relative py-3"
          onClick={() => setTab("createId")}
        >
          Create ID
          {activeTab === "createId" && (
            <div className="w-40 h-1.5 bg-[var(--theme-grey5)] absolute rounded-t-[5px] bottom-0 left-1/2 -translate-x-1/2"></div>
          )}
        </button>
      </div>

      <div className="p-4">
        {activeTab === "myId" && <MyId />}
        {activeTab === "createId" && <CreateId />}
      </div>

      <Footer />
    </div>
  );
}

export default Id;
