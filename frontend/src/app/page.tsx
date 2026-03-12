import HomeHero from "@/components/home/hero";

export default function Home() {
  return (
    <div className="">
      <div className="lg:bg-[radial-gradient(circle_at_center,var(--dark-accent),transparent,transparent)]">
        <HomeHero />
        <div className="mainContainer py-4">
          <div className=" grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-2 ">
            {Array(4)
              .fill(4)
              .map((_, index: number) => (
                <div key={index}>
                  <div className="h-[300px] bg-white/5 rounded-lg"></div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
