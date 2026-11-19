import { brand } from "@/content/site";

/**
 * The studio name as live text: "The Folk Weddings", with "Folk" in Zodiak Light Italic after the
 * script lettering of the logo. Crisp at any size and in any tone; the logo artwork itself appears
 * in the intro, the manifesto and the footer.
 */
export function Wordmark({ className }: { className?: string }) {
  return (
    <span className={className}>
      {brand.wordmark.map((run, index) =>
        run.italic ? (
          <em key={index} className="wordmark-folk">
            {run.text}
          </em>
        ) : (
          <span key={index}>{run.text}</span>
        ),
      )}
    </span>
  );
}
