type TerraceDividerProps = {
  /** Tailwind color class applied to each line, e.g. "bg-ink/15" */
  tone?: string;
  className?: string;
};

/**
 * A row of stacked horizontal lines of decreasing width — echoing the
 * agricultural terraces cut into the hillsides around Souni-Zanakia,
 * the same terraces that grow the Troodos vines mentioned throughout
 * the house's story. Used between sections instead of a plain <hr>,
 * and reused (inverted) as the footer's top edge.
 */
export default function TerraceDivider({
  tone = 'bg-ink/15',
  className = '',
}: TerraceDividerProps) {
  const widths = ['100%', '78%', '58%', '40%', '25%'];

  return (
    <div
      aria-hidden="true"
      className={`flex flex-col items-center gap-[3px] py-10 ${className}`}
    >
      {widths.map((w, i) => (
        <span
          key={i}
          className={`h-px ${tone}`}
          style={{ width: w }}
        />
      ))}
    </div>
  );
}
