"use client";

import { useEffect, useState } from "react";

const GAMES = [
  "/reviews/flappy-bird.html",
  "/reviews/pinball.html",
  "/reviews/runner.html",
  "/reviews/speed-tap.html",
  "/reviews/survive.html",
  "/reviews/tile-master.html",
];

export default function ReviewsPage() {
  const [redirected, setRedirected] = useState(false);

  useEffect(() => {
    if (!redirected) {
      const randomIndex = Math.floor(Math.random() * GAMES.length);
      window.location.href = GAMES[randomIndex];
      setRedirected(true);
    }
  }, [redirected]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-bg">
      <p className="text-lg text-muted-foreground">Loading game...</p>
    </div>
  );
}
