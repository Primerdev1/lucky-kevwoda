import Link from "next/link";

type WordmarkProps = {
  href?: string;
  size?: "sm" | "md";
};

export function Wordmark({ href = "/", size = "md" }: WordmarkProps) {
  const classes =
    size === "sm"
      ? "text-[1.15rem] leading-none tracking-[-0.02em]"
      : "text-[1.35rem] leading-none tracking-[-0.03em]";

  const inner = (
    <span className={classes}>
      <span className="wordmark-lucky">lucky</span>{" "}
      <span className="wordmark-kevwoda">kevwoda</span>
    </span>
  );

  if (!href) return inner;

  return (
    <Link href={href} className="inline-flex items-baseline gap-2 text-ink">
      <span
        aria-hidden
        className="mt-[0.15em] inline-block h-[0.55em] w-[0.55em] rounded-[1px] bg-laterite"
      />
      {inner}
    </Link>
  );
}
