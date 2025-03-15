import React from 'react';

export const BlogSection = () => {
  const blogPosts = [
    {
      content:
        "Traditional job boards rely on manual searches, but AI-driven platforms analyze your skills, experience, and preferences to recommend the most relevant job opportunities. Instead of scrolling through thousands of listings, AI does the heavy lifting for you.",
    },
    {
      content:
        "Many candidates struggle with writing a strong resume. AI-powered tools analyze job descriptions and provide real-time suggestions to optimize wording, formatting, and keyword usage—helping applicants stand out.",
    },
    {
      content:
        "Recruiters no longer have to sift through piles of resumes. AI automatically screens applications, matches the best-fit candidates, and even analyzes past hiring data to predict the best hires—saving time and improving hiring success rates.",
    },
  ];

  return (
    <section className="px-24 py-0 mx-0 my-16 max-md:px-12 max-md:py-0">
      <h2 className="inline-block px-2 py-0 text-4xl font-bold text-black bg-lime-300 rounded-lg mb-8">
        Blog
      </h2>
      <div className="flex gap-16 items-start px-16 py-16 bg-zinc-900 rounded-[45px] max-sm:flex-col max-sm:p-10">
        {blogPosts.map((post, index) => (
          <React.Fragment key={index}>
            <article className="flex flex-col gap-5 max-w-[286px]">
              <p className="text-lg text-lime-300">{post.content}</p>
              <svg
                width="142"
                height="28"
                viewBox="0 0 142 28"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="learn-more-icon"
              >
                <text
                  fill="#B9FF66"
                  xmlSpace="preserve"
                  style={{ whiteSpace: "pre" }}
                  fontFamily="Space Grotesk"
                  fontSize="20"
                  letterSpacing="0em"
                >
                  <tspan x="0" y="20.92">
                    Learn more
                  </tspan>
                </text>
                <path
                  d="M122.25 17.701C121.533 18.115 121.287 19.033 121.701 19.75C122.115 20.467 123.033 20.713 123.75 20.299L122.25 17.701ZM141.769 9.388C141.984 8.588 141.509 7.766 140.709 7.551L127.669 4.057C126.869 3.843 126.046 4.318 125.832 5.118C125.617 5.918 126.092 6.74 126.892 6.955L138.483 10.061L135.378 21.652C135.163 22.452 135.638 23.274 136.438 23.489C137.238 23.703 138.061 23.228 138.275 22.428L141.769 9.388ZM123.75 20.299L141.071 10.299L139.571 7.701L122.25 17.701L123.75 20.299Z"
                  fill="#B9FF66"
                />
              </svg>
            </article>
            {index < blogPosts.length - 1 && (
              <div className="w-px bg-lime-300 h-[186px] max-sm:w-full max-sm:h-px" />
            )}
          </React.Fragment>
        ))}
      </div>
    </section>
  );
};