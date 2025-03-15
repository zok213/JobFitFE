export const Footer = () => {
  return (
    <footer className="px-16 pt-14 pb-12 mt-16 bg-zinc-900 rounded-[45px_45px_0_0] max-md:px-8 max-md:py-10">
      <div className="flex flex-col gap-12">
        <div className="flex gap-40 items-center ml-auto w-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/3e617de5c62b5b64d89a1d1b3596c0f2fb121d31"
            alt="Footer Logo"
            className="w-36 h-[73px]"
          />
          <div className="social-icons">
            <svg
              width="130"
              height="31"
              viewBox="0 0 130 31"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="15" cy="15.5649" r="15" fill="#B9FF66" />
              <path
                d="M8.222 22.624H11.306V12.639H8.222V22.624Z"
                fill="black"
              />
              <path
                d="M7.941 9.452C7.941 10.436 8.736 11.233 9.764 11.233C10.745 11.233 11.539 10.436 11.539 9.452C11.539 8.467 10.745 7.624 9.764 7.624C8.736 7.624 7.941 8.467 7.941 9.452Z"
                fill="black"
              />
              <path
                d="M19.81 22.624H22.941V17.139C22.941 14.467 22.334 12.358 19.203 12.358C17.708 12.358 16.68 13.202 16.259 13.999H16.212V12.639H13.268V22.624H16.352V17.702C16.352 16.389 16.586 15.124 18.222 15.124C19.81 15.124 19.81 16.624 19.81 17.749V22.624Z"
                fill="black"
              />
              <path
                d="M80 15.656C80 7.32 73.286 0.565 65 0.565C56.714 0.565 50 7.32 50 15.656C50 23.202 55.444 29.47 62.641 30.565V20.038H58.831V15.656H62.641V12.37C62.641 8.597 64.879 6.468 68.266 6.468C69.96 6.468 71.653 6.772 71.653 6.772V10.484H69.778C67.903 10.484 67.298 11.64 67.298 12.857V15.656H71.472L70.807 20.038H67.298V30.565C74.496 29.47 80 23.202 80 15.656Z"
                fill="#B9FF66"
              />
              <circle cx="115" cy="15.5649" r="15" fill="#B9FF66" />
              <path
                d="M121.996 12.056C122.685 11.539 123.306 10.919 123.788 10.195C123.168 10.471 122.444 10.678 121.72 10.747C122.479 10.299 123.03 9.609 123.306 8.748C122.616 9.161 121.824 9.471 121.031 9.644C120.342 8.92 119.411 8.506 118.377 8.506C116.378 8.506 114.758 10.126 114.758 12.125C114.758 12.401 114.793 12.677 114.861 12.953C111.863 12.78 109.174 11.333 107.382 9.161C107.072 9.678 106.9 10.299 106.9 10.988C106.9 12.229 107.52 13.332 108.52 13.987C107.934 13.952 107.348 13.814 106.865 13.539V13.573C106.865 15.331 108.106 16.778 109.76 17.123C109.485 17.192 109.14 17.261 108.83 17.261C108.588 17.261 108.382 17.227 108.14 17.192C108.588 18.64 109.933 19.674 111.518 19.708C110.277 20.673 108.726 21.259 107.037 21.259C106.727 21.259 106.452 21.225 106.176 21.19C107.761 22.224 109.657 22.81 111.725 22.81C118.377 22.81 121.996 17.33 121.996 12.539C121.996 12.367 121.996 12.229 121.996 12.056Z"
                fill="black"
              />
            </svg>
          </div>
        </div>

        <div className="flex gap-40 max-sm:flex-col max-sm:gap-10">
          <div className="flex flex-col gap-7">
            <h2 className="inline-block px-2 py-0 text-3xl font-medium text-black bg-lime-300 rounded-lg">
              Contact us:
            </h2>
            <div className="flex flex-col gap-5 text-lg text-lime-300">
              <p>Email: jobfit.ai@gmail.com</p>
              <p>Phone: 555-567-8901</p>
              <p>Address: Vietnam</p>
            </div>
          </div>

          <div className="flex gap-5 px-10 py-14 rounded-2xl bg-zinc-800 max-sm:flex-col max-sm:w-full">
            <input
              type="email"
              placeholder="Email"
              className="flex px-9 py-6 rounded-2xl border border-lime-300 border-solid w-[285px] max-sm:w-full text-lg text-lime-300 bg-transparent"
            />
            <button className="flex px-9 py-5 text-xl text-black bg-lime-300 rounded-2xl cursor-pointer max-sm:w-full justify-center">
              Subscribe to news
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
