export function FormBlock({
  label,
  children,
  full,
}: {
  label: string;
  children: React.ReactNode;
  full?: boolean;
}) {
  return (
    <fieldset className={`flex flex-col ${full ? "lg:col-span-2" : ""}`}>
      <legend className="mb-2">
        <span className="inline-flex items-center gap-2 rounded-full border-2 border-black bg-puffy-yellow px-2 py-0.5 text-xs font-black shadow-[2px_2px_0_#000]">
          {label}
        </span>
      </legend>
      {children}
    </fieldset>
  );
}
