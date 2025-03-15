import React from "react";

interface ServiceCardProps {
  title: string[];
  illustration: string;
  variant: "grey" | "green" | "black";
}

export const ServiceCard: React.FC<ServiceCardProps> = ({
  title,
  illustration,
  variant,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "black":
        return "bg-zinc-900 text-lime-300";
      case "green":
        return "bg-lime-300";
      default:
        return "bg-zinc-100";
    }
  };

  return (
    <article
      className={`flex justify-between items-center p-12 border border-solid shadow-sm border-zinc-900 rounded-[45px] max-sm:flex-col max-sm:gap-8 max-sm:p-8 ${getVariantStyles()}`}
    >
      <div className="flex flex-col gap-24">
        <div className="flex flex-col gap-1.5">
          {title.map((line, index) => (
            <span
              key={index}
              className="inline-block px-2 py-0 text-3xl font-medium text-black bg-lime-300 rounded-lg"
            >
              {line}
            </span>
          ))}
        </div>
        <div className="learn-more-link">
          <svg
            width="164"
            height="41"
            viewBox="0 0 164 41"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="arrow-icon"
          >
            <circle
              cx="20.5"
              cy="20.5"
              r="20.5"
              fill={variant === "black" ? "#B9FF66" : "#191A23"}
            />
            <path
              d="M11.25 24.701C10.533 25.115 10.287 26.033 10.701 26.75C11.115 27.467 12.033 27.713 12.75 27.299L11.25 24.701ZM30.769 16.388C30.984 15.588 30.509 14.766 29.709 14.551L16.669 11.057C15.869 10.843 15.046 11.318 14.832 12.118C14.617 12.918 15.092 13.74 15.892 13.955L27.483 17.061L24.378 28.652C24.163 29.452 24.638 30.274 25.438 30.489C26.238 30.703 27.061 30.228 27.275 29.428L30.769 16.388ZM12.75 27.299L30.071 17.299L28.571 14.701L11.25 24.701L12.75 27.299Z"
              fill={variant === "black" ? "black" : "#B9FF66"}
            />
            <text
              fill={variant === "black" ? "#B9FF66" : "black"}
              xmlSpace="preserve"
              style={{ whiteSpace: "pre" }}
              fontFamily="Space Grotesk"
              fontSize="20"
              letterSpacing="0em"
            >
              <tspan x="56" y="27.42">
                Learn more
              </tspan>
            </text>
          </svg>
        </div>
      </div>
      <img
        src={illustration}
        alt="Service illustration"
        className="h-auto w-[210px]"
      />
    </article>
  );
};
