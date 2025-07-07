import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, SquareActivityIcon, SquareCheckBig } from "lucide-react";
import React, { useState } from "react";
import logo from "/asset/gpay.png";
import { useNavigate } from "react-router-dom";
import WhatsappApiDialog from "./dialogs/WhatsappApiDialog";

const ClientDetails = () => {
  const navigate = useNavigate();
  const [showSubscription, setShowSubscription] = useState(false);

  const handleBack = () => {
    if (showSubscription) {
      setShowSubscription(false);
    } else {
      navigate(-1);
    }
  };
  return (
    <>
      <div className=" pb-4">
        <ArrowLeft
          onClick={handleBack}
          className="size-8 cursor-pointer hover:text-slate-600"
        />
      </div>
      <div className="flex flex-col items-center justify-center     w-full  ">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4  bg-[#F2B95D] pb-30   auto-rows-auto  gap-4 p-4 rounded-lg   w-full">
          <Main />
          {showSubscription ? (
            <SubscriptionDialog />
          ) : (
            <>
              <DnsSetup1 />
              <ConsentForm />
              <SmsApi />
              <WhatsAppCloudApi />
              <DnsSetup2 />
              <MessageCounter />
              <WhatsAppTemplate />
              <AdminDetails />
              <Subscription
                showSubscription={showSubscription}
                setShowSubscription={setShowSubscription}
              />
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default ClientDetails;

const Main = () => {
  return (
    <div className="lg:row-span-5 col-span-1  rounded-lg shadow-md bg-white   p-4">
      <div className="flex flex-col gap-5 items-center">
        <div className="text-lg font-bold">ABC BOOKS</div>
        <img className="h-40 w-40" src={logo} alt="" />
      </div>
      <div className="mt-10 text-sm space-y-3">
        <div className="flex items-start gap-4">
          <span className="w-32 font-medium">BUSINESS</span>
          <span className="text-[#390DFA]">ABC Books</span>
        </div>
        <div className="flex items-start gap-4">
          <span className="w-32 font-medium">DOMAIN</span>
          <span className="text-[#390DFA]">www.abcbooks.com</span>
        </div>
        <div className="flex items-start gap-4">
          <span className="w-32 font-medium">CLIENT NAME</span>
          <span className="text-[#390DFA] break-all">Rakhi Sawant</span>
        </div>
        <div className="flex items-start gap-4">
          <span className="w-32 font-medium">MOBILE</span>
          <span className="text-[#390DFA] break-all">+918899665544</span>
        </div>
        <div className="flex items-start gap-4">
          <span className="w-32 font-medium">ADMIN USER</span>
          <span className="text-[#390DFA] break-all">
            {"RK156".toUpperCase()}
          </span>
        </div>
        <div className="flex items-start gap-4">
          <span className="w-32 font-medium">ADMIN PASSWORD</span>
          <span className="text-[#390DFA] break-all">
            {"Rakhi123".toUpperCase()}
          </span>
        </div>
        <div className="flex items-start gap-4">
          <span className="w-32 font-medium">LOCATION</span>
          <span className="text-[#390DFA] break-all">Ambala</span>
        </div>
        <div className="flex items-start gap-4">
          <span className="w-32 font-medium">IP</span>
          <span className="text-[#390DFA] break-all">192.168.1.105</span>
        </div>
      </div>
    </div>
  );
};

const DnsSetup1 = () => {
  return (
    <div className="row-span-2 col-span-1  rounded-lg shadow-md bg-white  p-4">
      <div className="flex items-center  justify-between ">
        <div className="text-lg font-bold">DNS Setup 1</div>
        <Button
          className={
            "h-6 bg-[#2D65D2] hover:bg-blue-500 cursor-pointer text-white"
          }
        >
          Manage
        </Button>
      </div>
      <div className="my-2 text-sm space-y-2">
        <div className="flex items-center justify-between">
          <span>TYPE</span>
          <span className="text-start text-[#390DFA]">150</span>
        </div>
        <div className="flex items-center justify-between">
          <span>NAME</span>
          <span className="text-start text-[#390DFA]">145350</span>
        </div>
        <div className="flex items-center justify-between">
          <span>POINT TO</span>
          <span className="text-start text-[#390DFA]">1500000</span>
        </div>
        <div className="flex items-center justify-between">
          <span>TTL</span>
          <span className="text-start text-[#390DFA]">1500000</span>
        </div>
      </div>
    </div>
  );
};

const ConsentForm = () => {
  return (
    <div className="lg:row-span-1 col-span-1 p-4 rounded-lg shadow-md bg-white ">
      <div className="flex items-center justify-between ">
        <div className="text-lg font-bold">Consent Form</div>
        <Button
          className={
            "h-6 bg-[#2D65D2] hover:bg-blue-500 cursor-pointer text-white"
          }
        >
          Manage
        </Button>
      </div>
      <div className="flex text-sm justify-between items-end space-y-2 my-2">
        <div>
          <SquareCheckBig className="h-10 w-10" />
        </div>
        <div className="flex flex-col gap-2">
          <Button
            className={
              "h-6 bg-[#2D65D2] hover:bg-blue-500 cursor-pointer text-white"
            }
          >
            Share
          </Button>
          <Button
            className={
              "h-6 bg-[#2D65D2] hover:bg-blue-500 cursor-pointer text-white"
            }
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

const SmsApi = () => {
  return (
    <div className="lg:row-span-2 col-span-1  rounded-lg shadow-md  p-4 bg-white">
      <div className="flex items-center justify-between ">
        <div className="text-lg font-bold">SMS API</div>
        <Button
          className={
            "h-6 bg-[#2D65D2] hover:bg-blue-500 cursor-pointer text-white"
          }
        >
          Manage
        </Button>
      </div>
    </div>
  );
};

const SubscriptionDialog = () => {
  return (
    <div className="lg:row-span-5 lg:col-span-3 p-4 rounded-lg shadow-md bg-white">
      <div className="flex items-center justify-between">Subscription</div>
    </div>
  );
};
const WhatsAppCloudApi = () => {
  return (
    <div className="row-span-2 col-span-1 p-4 rounded-lg shadow-md bg-white">
      <div className="flex items-center justify-between">
        <div className="text-lg font-bold">WhatsApp Cloud API</div>
        <WhatsappApiDialog />
      </div>
      <div className="my-2 text-sm space-y-2">
        <div className="flex  gap-10">
          <span className="text-sm font-medium">PERMANENT ACCESS TOKEN</span>
          <span className="text-[#390DFA] break-all text-sm">
            {"Ealfllepfyhnnrllf9763eftygvgv".toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-10">
          <span className="flex-1 font-medium">PHONE NUMBER ID</span>
          <span className="text-[#390DFA] text-right flex-shrink-0">
            145350
          </span>
        </div>
        <div className="flex items-center gap-10">
          <span className="flex-1 font-medium">WHATSAPP BUSINESS ID</span>
          <span className="text-[#390DFA] text-right flex-shrink-0">
            {"2554368987648668452213".toUpperCase()}
          </span>
        </div>
      </div>
    </div>
  );
};

const DnsSetup2 = () => {
  return (
    <div className="row-span-2 col-span-1  rounded-lg shadow-md bg-white  p-4">
      <div className="flex items-center justify-between ">
        <div className="text-lg font-bold">DNS Setup 2</div>
        <Button
          className={
            "h-6 bg-[#2D65D2] hover:bg-blue-500 cursor-pointer text-white"
          }
        >
          Manage
        </Button>
      </div>
      <div className="my-2 text-sm space-y-2">
        <div className="flex items-center justify-between">
          <span>TYPE</span>
          <span className="text-start text-[#390DFA]">150</span>
        </div>
        <div className="flex items-center justify-between">
          <span>NAME</span>
          <span className="text-start text-[#390DFA]">145350</span>
        </div>
        <div className="flex items-center justify-between">
          <span>POINT TO</span>
          <span className="text-start text-[#390DFA]">1500000</span>
        </div>
        <div className="flex items-center justify-between">
          <span>TTL</span>
          <span className="text-start text-[#390DFA]">1500000</span>
        </div>
      </div>
    </div>
  );
};

const MessageCounter = () => {
  return (
    <div className="lg:row-span-2 col-span-1 p-4 rounded-lg shadow-md bg-white ">
      <div className="flex items-center justify-between ">
        <div className="text-lg font-bold">Message Counter</div>
        <Button
          className={
            "h-6 bg-[#2D65D2] hover:bg-blue-500 cursor-pointer text-white"
          }
        >
          Manage
        </Button>
      </div>
    </div>
  );
};
const WhatsAppTemplate = () => {
  return (
    <div className="lg:row-span-2 col-span-1 p-4 rounded-lg shadow-md bg-white ">
      <div className="flex items-center justify-between ">
        <div className="text-lg font-bold">WhatsApp Templates</div>
        <Button
          className={
            "h-6 bg-[#2D65D2] hover:bg-blue-500 cursor-pointer text-white"
          }
        >
          Manage
        </Button>
      </div>
    </div>
  );
};

const AdminDetails = () => {
  return (
    <div className="lg:row-span-1 col-span-1 p-4 rounded-lg shadow-md  bg-white">
      <div className="flex items-center justify-between ">
        <div className="text-lg font-bold">Admin Details</div>
        <Button
          className={
            "h-6 bg-[#2D65D2]  hover:bg-blue-500 cursor-pointer text-white"
          }
        >
          View
        </Button>
      </div>
      <div className="my-1 text-sm space-y-1">
        <div className="flex items-center justify-between">
          <span>TOTAL CLIENT</span>
          <span className="text-start text-[#390DFA]">150</span>
        </div>
        <div className="flex items-center justify-between">
          <span>TOTAL DEPOSIT</span>
          <span className="text-start text-[#390DFA]">145350</span>
        </div>
        <div className="flex items-center justify-between">
          <span>TOTAL WITHDRAWAL</span>
          <span className="text-start text-[#390DFA]">1500000</span>
        </div>
      </div>
    </div>
  );
};

const Subscription = ({ showSubscription, setShowSubscription }) => {
  return (
    <div className="lg:row-span-1 col-span-1 p-4 rounded-lg shadow-md  bg-white">
      <div className="flex items-center justify-between ">
        <div className="text-lg font-bold">Subscription</div>
        <Button
          onClick={() => setShowSubscription(true)}
          className={
            "h-6 bg-[#2D65D2] hover:bg-blue-500 cursor-pointer text-white"
          }
        >
          Manage
        </Button>
      </div>
      <div className="my-1 text-sm space-y-1">
        <div className="flex items-center  justify-between">
          <span>TYPE</span>
          <span className="text-start text-[#390DFA]">150</span>
        </div>
        <div className="flex items-center justify-between">
          <span>ENDING DATE</span>
          <span className="text-start text-[#390DFA]">145350</span>
        </div>
        <div className="flex items-center justify-between">
          <span>STATUS</span>
          <span className="text-start text-[#390DFA]">1500000</span>
        </div>
      </div>
    </div>
  );
};
