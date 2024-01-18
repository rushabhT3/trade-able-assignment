import React, { useState, useEffect } from "react";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.css"; // Import Font Awesome

function MainPage() {
  const [balance, setBalance] = useState(0);
  const [referralLink, setReferralLink] = useState("");
  const [linkExpired, setLinkExpired] = useState(false);

  // Inside your component
  let token;
  if (typeof window !== "undefined") {
    token = localStorage.getItem("token");
  }

  useEffect(() => {
    if (!token) {
      return;
    }
    fetchUserData();
  }, [token]); // Run effect when token changes

  const fetchUserData = async () => {
    try {
      const response = await axios.get("http://localhost:5000/api/balance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response.data);
      setBalance(response.data.balance);
      setReferralLink(response.data.referralLink.code);
      setLinkExpired(
        response.data.referralLink.isExpired ||
          response.data.referralLink.uses >= 5
      );
    } catch (err) {
      console.error("Error fetching user data:", err);
      // Handle errors appropriately (e.g., display error message, retry)
    }
  };

  const handleGenerateLink = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/referral/generate",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReferralLink(response.data.link);
      setLinkExpired(false);
      // Fetch user data again to update other components
      fetchUserData();
    } catch (err) {
      // Handle errors
    }
  };

  const handleShareLink = () => {
    // You can implement the logic to share the referral link here
    // For example, copying to clipboard or using a share API
    // For simplicity, I'm using the copy to clipboard approach here
    if (linkExpired) {
      alert("Referral link is expired!");
      return;
    }
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied to clipboard!");
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100 text-black">
      <div className="bg-white p-8 rounded-lg shadow-md w-4/5">
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          Main Page
        </h2>
        <div className="text-2xl font-bold mb-4 text-black">
          <i className="fas fa-wallet fa-fw"></i> Your Balance: {balance}
        </div>
        <div className="mb-4">
          <strong>Referral Link:</strong> {referralLink}{" "}
          {linkExpired && (
            <span className="text-red-500">
              <strong>Expired</strong>
            </span>
          )}
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mr-2"
          onClick={handleGenerateLink}
        >
          Generate Referral Link
        </button>
        <button
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          onClick={handleShareLink}
        >
          Share Referral Link
        </button>
      </div>
    </div>
  );
}

export default MainPage;
