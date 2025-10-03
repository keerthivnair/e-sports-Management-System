import React, { useState } from "react";

const Login = () => {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [message, setMessage] = useState("");

  const toggleForm = () => {
    setIsRegister(!isRegister);
    setMessage("");
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint = isRegister ? "register" : "login";
    try {
      const res = await fetch(`http://localhost:3000/auth/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setMessage(data.message || data.error);
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-gray-900 to-red-950 p-4">
      <div className="w-full max-w-md bg-black/60 border border-red-800 rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        
        {/* Header */}
        <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-white to-red-400 text-center mb-6">
          {isRegister ? "REGISTER" : "LOGIN"}
        </h1>

        {/* Glow animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 via-transparent to-red-500/10 animate-pulse pointer-events-none"></div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
          {isRegister && (
            <div>
              <label className="block text-sm font-semibold text-red-300 mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange = {(e) => {handleChange(e)}}
                className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          )}
          <div>
            <label className="block text-sm font-semibold text-red-300 mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-lg bg-gray-900 text-white border border-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-bold rounded-lg bg-gradient-to-r from-red-600 to-red-500 hover:from-red-500 hover:to-red-400 text-white tracking-wider shadow-lg shadow-red-800/50 transition-transform transform hover:scale-[1.02]"
          >
            {isRegister ? "Register" : "Login"}
          </button>
        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center text-red-400 font-semibold">{message}</p>
        )}

        {/* Toggle */}
        <div className="mt-6 text-center ">
          <button
          type="button"
            
            className=" text-sm text-gray-300 hover:text-red-400 transition cursor-pointer p-3 rounded-md "
            onClick={toggleForm}
          >
            {isRegister
              ? "Already have an account? Login"
              : "Don’t have an account? Register"}
          </button>
        </div>
      </div>

      {/* Floating elements for same vibe */}
      <div className="fixed top-20 left-10 w-2 h-2 bg-red-500 rounded-full animate-pulse opacity-30"></div>
      <div className="fixed bottom-32 right-16 w-1 h-1 bg-white rounded-full animate-pulse opacity-40"></div>
      <div className="fixed top-1/2 right-8 w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse opacity-25"></div>
    </div>
  );
};

export default Login;
