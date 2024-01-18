import React, { useState } from "react";
import Link from "next/link"; // Import Link from next/link
import { useRouter } from "next/router";
import axios from "axios";

function Signup() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralLink, setReferralLink] = useState(""); // New state for referral link

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/register", {
        username,
        email,
        password,
        referralLink,
      });

      // Handle successful registration (e.g., redirect to login)
      console.log("Registration successful!", response.data);

      // Clear the input fields
      setUsername("");
      setEmail("");
      setPassword("");
      setReferralLink("");

      router.push("/login");

      // Optionally, redirect the user to the login page after successful registration
    } catch (err) {
      // Handle registration errors
      console.error("Error during registration:", err.response.data);
      alert(`Error during registration: ${err.response.data.error}`);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col items-center justify-center h-screen bg-gray-100"
    >
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center">Sign Up</h2>

        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-medium mb-2"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-2"
          >
            Email:
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-2"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <div className="mb-6">
          <label
            htmlFor="referralLink"
            className="block text-gray-700 font-medium mb-2"
          >
            Referral Link:
          </label>
          <input
            type="text"
            id="referralLink"
            value={referralLink}
            onChange={(e) => setReferralLink(e.target.value)}
            placeholder="Enter your referral link"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
        >
          Sign Up
        </button>

        <p className="mt-4 text-center text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-500 hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </form>
  );
}

export default Signup;
