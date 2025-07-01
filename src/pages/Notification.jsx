import React from "react";
import NotificationCard from "../components/NotificationCard";
import Footer from "../sections/Footer";
import BackWithLogo from "../components/BackWithLogo";

function Notification() {
  const Notifications = [
    {
      number: 1,
      type: "success",
      title: "Request Placed",
      message: "Account creation request has been submitted. Status will update shortly.",
    },
    {
      number: 2,
      type: "warning",
      title: "Hey! ID Approved",
      message: "Your request to create ID has been approved. Enjoy your games now!",
    },
    {
      number: 3,
      type: "error",
      title: "Request Rejected",
      message: "Your request to create ID has been rejected by the admin.",
    },
  ];

  return (
    <>
      <div className="pb-2">
        {/* Header */}
        <div className="sticky top-0 pt-2 bg-white px-4">
          <BackWithLogo />
        </div>
        <div className="px-4">
          {/* Title */}
          <h1 className="text-xl font-medium my-6">Notification Type Demo:</h1>

          {/* Notification List */}
          <div className="space-y-8 px-4">
            {Notifications.map((notif) => (
              <div key={notif.number} className="flex gap-6 items-center">
                <span className="text-xl font-medium">{notif.number}.</span>
                <NotificationCard type={notif.type} title={notif.title} message={notif.message} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Notification;
