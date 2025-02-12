import { Metadata, ResolvingMetadata } from "next";
import Head from "next/head";

import { GalleryCreateForm } from "../components/form";

const ENVI = process.env.ENVI ?? "devv";

type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};


export async function generateMetadata(
  { params, searchParams }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  // read route params
  const imageUrl = `${process.env['HOST']}/api/image?input=`
  const postUrl = `${process.env["HOST"]}/api/input?page=2&input=`

  const fcMetadata: Record<string, string> = {
    "fc:frame": "vNext",
    "fc:frame:post_url": `${postUrl}` ,
    "fc:frame:image": `${imageUrl}`,
    "fc:frame:button:1": "->",
    "fc:frame:button:2": "up",
    "fc:frame:button:3": "down",
    "fc:frame:button:4": "Clear",
  };

  return {
    title: "Lock Your Images",
    description: "Password Your Images With Play station keys",
    openGraph: {
      title: "Lock Your Images",
      images: [imageUrl],
    },
    other: {
      ...fcMetadata,
    },
    metadataBase: new URL(process.env["HOST"] || ""),
  };
}


const Home = () => {
  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-20 text-center">
          <div className="flex justify-center items-center bg-black rounded-full w-12 h-12  my-8">
            <VercelLogo className="h-8  invert p-3 mb-1" />
          </div>
          <h1 className="text-lg sm:text-2xl font-bold mb-2">
            Password Your Images In Frame
          </h1>

          <div className="flex flex-wrap items-center justify-around max-w-4xl my-8 sm:w-full bg-white rounded-md shadow-xl h-full border border-gray-100">
            <GalleryCreateForm />
          </div>
        </main>
      </div>
    </>
  );
};

function VercelLogo(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-label="Vercel Logo"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 19"
      {...props}
    >
      <path
        clipRule="evenodd"
        d="M12.04 2L2.082 18H22L12.04 2z"
        fill="#000"
        fillRule="evenodd"
        stroke="#000"
        strokeWidth="1.5"
      />
    </svg>
  );
}

export default Home;
