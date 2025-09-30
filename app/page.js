import Image from "next/image";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";


export default function Home() {
  return (
    <>
      <div className="flex flex-col gap-4 justify-center text-white items-center h-[44vh] px-4 ">
        <div className="font-bold flex sm:items-center justify-center sm:gap-6 gap-2 items-start">
          <span className="text-left sm:text-5xl text-3xl">
            Get Me A Samosa
          </span>
          <span>
            <Image className="h-14 w-15 rounded-lg" src="/samosa.gif" alt="Samosa" />
          </span>
        </div>
        <p className="text-center">
          A Crowdfunding platform for Creators to fund their projects with Samosas!
        </p>
        <p className="text-center">
          A place where your fans can support you by buying you a Samosa. Unleash the power of your fans and get your projects funded!
        </p>
        <div className="justify-center flex items-center flex-wrap m-2">
          <Link href={"/login"}>
            <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Start Here</button>
          </Link>
          <Link href={"/about"}>
            <button type="button" className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2">Read More</button>
          </Link>
        </div>
      </div>

      <div className="bg-white h-0.5 opacity-10">
      </div>

      <div className="text-white container mx-auto items-center pb-15">
        <h2 className="font-bold text-center text-3xl my-14">Your fans can buy you a Samosa</h2>
        <div className="flex gap-5 items-center justify-around flex-wrap">
          <div className="item flex flex-col gap-2 justify-center items-center">
            <Image className="h-16 rounded-full bg-transparent" src="/worker.gif" alt="" />
            <p className="font-bold text-center">Fund Yourself</p>
            <p className="text-center">Your fans are available for you to help you</p>
          </div>
          <div className="item flex flex-col gap-2 justify-center items-center">
            <Image className="h-16 rounded-full bg-transparent" src="/dollar.gif" alt="" />
            <p className="font-bold text-center">Fans want to contribute</p>
            <p className="text-center">Fans are willing to contribute financially</p>
          </div>
          <div className="item flex flex-col gap-2 justify-center items-center">
            <Image className="h-16 rounded-full bg-transparent" src="/network.gif" alt="" />
            <p className="font-bold text-center">Fans want to help</p>
            <p className="text-center">Your fans are ready to collaborate with you</p>
          </div>
        </div>
      </div>

      <div className="bg-white h-0.5 opacity-10">
      </div>

      <div className="text-white container mx-auto items-center pb-14 flex flex-col">
        <h2 className="font-bold text-center text-3xl my-14">Learn More About Us</h2>
        <iframe className="w-[300px] sm:w-[560px] h-[150px] sm:h-[315px]" src="https://www.youtube.com/embed/gG12hcklsA0?si=ojWmcKboP5DCddZ1" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerPolicy="strict-origin-when-cross-origin" allowFullScreen></iframe>
      </div>
    </>
  );
};
