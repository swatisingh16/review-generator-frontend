import { useState, useEffect } from "react";
import Login from "./components/Login";
import ReviewApp from "./components/ReviewGenerator";
import { Toaster } from "react-hot-toast";

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <>
      <Toaster position="top-right" />

      {isLoggedIn ? (
        <ReviewApp />
      ) : (
        <Login onSuccess={() => setIsLoggedIn(true)} />
      )}
    </>
  );
}

export default App;