export default function Twitter({
  encodedTitle,
  encodedUrl,
}: {
  encodedTitle: string;
  encodedUrl: string;
}) {
  return (
    <a
      href={`https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`}
      target="_blank"
      rel="noopener noreferrer"
      className="text-gray-400 hover:text-gray-200 transition-colors"
      aria-label="Share on Twitter/X"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-6 w-6"
        fill="currentColor"
        viewBox="0 0 24 24"
      >
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path>
      </svg>
    </a>
  );
}
