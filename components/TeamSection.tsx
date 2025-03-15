export const TeamSection = () => {
  const teamMembers = [
    {
      name: "John Smith",
      role: "CEO and Founder",
      image: "URL_TEAM_1",
    },
    {
      name: "Jane Doe",
      role: "Director of Operations",
      image: "URL_TEAM_2",
    },
    {
      name: "Michael Brown",
      role: "Senior SEO Specialist",
      image: "URL_TEAM_3",
    },
    {
      name: "Emily Johnson",
      role: "PPC Manager",
      image: "URL_TEAM_4",
    },
    {
      name: "Brian Williams",
      role: "Social Media Specialist",
      image: "URL_TEAM_5",
    },
    {
      name: "Sarah Kim",
      role: "Content Creator",
      image: "URL_TEAM_6",
    },
  ];

  return (
    <section className="px-24 py-0 mx-0 my-16 max-md:px-12 max-md:py-0">
      <h2 className="inline-block px-2 py-0 text-4xl font-bold text-black bg-lime-300 rounded-lg mb-4">
        Team
      </h2>
      <p className="text-lg text-black mb-10">
        Meet the skilled and experienced
      </p>
      <div className="flex flex-col gap-10">
        {[0, 1].map((row) => (
          <div key={row} className="flex gap-10 max-md:flex-col">
            {teamMembers.slice(row * 3, (row + 1) * 3).map((member, index) => (
              <article
                key={index}
                className="flex flex-col gap-2.5 items-start px-9 py-10 bg-lime-300 border border-solid shadow-sm border-zinc-900 rounded-[45px] w-[387px] max-sm:w-full"
              >
                <div className="flex items-center gap-4">
                  <div className="rounded-full bg-[#231F20] w-[98px] h-[98px] overflow-hidden">
                    <img
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover mix-blend-multiply"
                    />
                  </div>
                  <div className="flex flex-col">
                    <h3 className="text-xl font-medium text-black">
                      {member.name}
                    </h3>
                    <p className="text-lg text-black">{member.role}</p>
                  </div>
                  <div className="ml-auto">
                    <svg
                      width="34"
                      height="34"
                      viewBox="0 0 34 34"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <circle cx="17" cy="17" r="17" fill="black" />
                      <path
                        d="M9.318 25H12.813V13.684H9.318V25Z"
                        fill="#B9FF66"
                      />
                      <path
                        d="M9 10.072C9 11.188 9.9 12.091 11.065 12.091C12.178 12.091 13.078 11.188 13.078 10.072C13.078 8.956 12.178 8 11.065 8C9.9 8 9 8.956 9 10.072Z"
                        fill="#B9FF66"
                      />
                      <path
                        d="M22.452 25H26V18.784C26 15.756 25.312 13.366 21.763 13.366C20.069 13.366 18.903 14.322 18.427 15.225H18.374V13.684H15.037V25H18.533V19.422C18.533 17.934 18.798 16.5 20.651 16.5C22.452 16.5 22.452 18.2 22.452 19.475V25Z"
                        fill="#B9FF66"
                      />
                    </svg>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
};
