export const LogoStrip = () => {
    const logos = [
      {
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/d0e3d4cad5c8be7072dd0a70967878abd2aa0fb1",
        alt: "Partner Logo",
      },
      {
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/88cf4813ca8ad5d3b1039640db092c41a7151b3a",
        alt: "Indeed Logo",
      },
      {
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/11ae04f14dcc6eb8987923dba6e7c34f3b2c58af",
        alt: "Vieclam24h Logo",
      },
      {
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/c9b008486987be59d19034dc16b906198ed39e06",
        alt: "Ybox Logo",
      },
      {
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/1343b12b93798f37cedeb9303fa67dec5c637e44",
        alt: "Careerbuilder Logo",
      },
      {
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/4ba5088ca95688b5f0fb2f7e98c55185f7aa4f14",
        alt: "Careerlink Logo",
      },
      {
        src: "https://cdn.builder.io/api/v1/image/assets/TEMP/fdeb3d152cfc4ccad478e1cd046e573f573c5485",
        alt: "Careerviet Logo",
      },
    ];
  
    return (
      <section className="flex justify-between items-center max-sm:flex-wrap max-sm:gap-5 max-sm:justify-center">
        {logos.map((logo, index) => (
          <img
            key={index}
            src={logo.src}
            alt={logo.alt}
            className="object-contain h-[65px]"
          />
        ))}
      </section>
    );
  };
  