import { useEffect, useState } from "react";

export default function LoadingBar() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let progressInterval: number;
    let timeoutId: number;

    const startLoading = () => {
      setIsLoading(true);
      setProgress(0);

      // Simulate progress
      progressInterval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 100);
    };

    const finishLoading = () => {
      setProgress(100);
      timeoutId = window.setTimeout(() => {
        setIsLoading(false);
        setProgress(0);
      }, 200);
    };

    // Listen for navigation events
    document.addEventListener("astro:before-preparation", startLoading);
    document.addEventListener("astro:after-preparation", finishLoading);
    document.addEventListener("astro:after-swap", finishLoading);

    return () => {
      document.removeEventListener("astro:before-preparation", startLoading);
      document.removeEventListener("astro:after-preparation", finishLoading);
      document.removeEventListener("astro:after-swap", finishLoading);
      clearInterval(progressInterval);
      clearTimeout(timeoutId);
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div className="fixed top-0 left-0 w-full h-1 z-50">
      <div
        className="h-full bg-blue-500 transition-all duration-200 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
