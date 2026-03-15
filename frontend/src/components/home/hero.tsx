"use client";
import React, { useState, useCallback } from "react";
import AnimatedCodeEditor from "./animated-code-editor";
import { useRouter } from "next/navigation";
// import SearchBox from "../Form/SearchBox";

const HomeHero = () => {
  const [showHighlight, setShowHighlight] = useState(false);
  const [searchText, setSearchText] = useState("");
  const router = useRouter();
  const HandleSearch = (e: any) => {
    e.preventDefault();
    router.push(`/component?search=${searchText}`);
  };
  const handleAnimationChange = useCallback((isComplete: boolean) => {
    setShowHighlight(isComplete);
  }, []);

  return (
    <>
      <div className="flex flex-col-reverse lg:flex-row items-center bg-[radial-gradient(circle_at_center,var(--dark-accent),transparent,transparent)] gap-5 lg:gap-10  mainContainer lg:bg-none py-6 md:py-8 lg:py-10 text-white">
        <div className="w-full space-y-6 lg:space-y-10 lg:w-[53%] py-0 lg:py-16">
          <h1 className="text-[2.3rem] sm:text-[3.5rem] md:text-[4rem] lg:text-[4.2rem] leading-[1.1] lg:leading-[1.1] font-semibold -tracking-[0.015em] text-white">
            The{" "}
            <span
              className={`transition-colors duration-300 ${
                showHighlight
                  ? "text-accent underline underline-offset-2"
                  : "text-white"
              }`}
            >
              Ultimate
            </span>{" "}
            Code <br /> Hub &{" "}
            <span
              className={`transition-colors duration-300 ${
                showHighlight ? "text-accent underline" : "text-white"
              }`}
            >
              Developer <br />
            </span>{" "}
            Playground
          </h1>
          <p className="text-sm sm:text-base font-light text-gray-300  max-w-xl">
            Join a vibrant community where developers showcase creativity,
            contribute to open-source UI, and grow together.
          </p>
          <form onSubmit={HandleSearch}>
            <div className=" max-w-md hover:scale-105 transition-all ease-in-out duration-200">
              <div className="flex bg-white p-1.5 pl-5 items-center gap-1 rounded-2xl">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-search-icon lucide-search text-dark-accent"
                >
                  <path d="m21 21-4.34-4.34" />
                  <circle cx="11" cy="11" r="8" />
                </svg>
                <input
                  onChange={(e) => {
                    setSearchText(e.target.value);
                  }}
                  type="text"
                  required
                  placeholder="Search for components"
                  className=" w-full pl-2 text-xs outline-none text-black bg-[#fff]"
                />
                <button
                  type="submit"
                  className="`w-full flex items-center gap-2 justify-center px-8 py-2.5 bg-linear-to-r from-dark-accent to-accent text-white text-base font-medium rounded-xl"
                >
                  Search
                </button>
              </div>
            </div>
          </form>
        </div>
        <div className="w-full lg:w-[42%] h-[350px] sm:h-[400px] md:h-[450px] lg:h-full">
          <AnimatedCodeEditor handleChange={handleAnimationChange} />
        </div>
      </div>
    </>
  );
};

export default HomeHero;
