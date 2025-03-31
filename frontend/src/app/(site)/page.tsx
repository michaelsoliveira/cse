import Navbar from "@/features/site/components/navbar";
import { HandCoins, Twitch } from "lucide-react";
import Link from "next/link";

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Coodenadoria de Segurança Escolar',
  description: 'Sistema de Gerenciamento de Segurança Escolar'
};
export default function Home() {
	return (
		<div className="flex min-h-screen w-full flex-col">
			<header className="sticky top-0 flex h-16 items-center  gap-4 border-b bg-background px-4 md:px-6 z-10">
				<Navbar />
			</header>
			<main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
				<div className="absolute z-0 inset-0 h-full w-full items-center px-5 py-24 bg-gradient-to-b from-white via-white via-50% to-[#16A34A]">
					<section className="z-auto">
						<div className="py-8 px-4 mx-auto max-w-screen-xl text-center lg:py-16 lg:px-12">
							<a
								href="#"
								className="inline-flex justify-between items-center py-1 px-1 pr-4 mb-7 text-sm text-gray-700 bg-gray-100 rounded-full dark:bg-gray-800 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700"
								// target="_blank"
								// rel="noreferrer"
							>
								<span className="text-xs bg-primary-600 rounded-full text-foreground dark:text-white px-4 py-1.5 mr-3">
									{"Novidades"}
								</span>{" "}
								<span className="text-sm font-medium">{"Tour"}</span>
								<svg
									className="ml-2 w-5 h-5"
									fill="currentColor"
									viewBox="0 0 20 20"
									xmlns="http://www.w3.org/2000/svg"
									role="img"
									aria-label="Logo"
								>
									<path
										fillRule="evenodd"
										d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
										clipRule="evenodd"
									/>
								</svg>
							</a>
							<h1 className="mb-4 text-4xl font-extrabold tracking-tight leading-none text-gray-900 md:text-5xl lg:text-6xl dark:text-white">
								<span className="bg-gradient-to-r from-primary dark:to-white to-gray-600 text-transparent bg-clip-text">
									{"Coordenadoria de Segurança Escolar"}
								</span>
							</h1>
							<p className="mb-8 text-lg font-normal text-gray-500 lg:text-xl sm:px-16 xl:px-48 dark:text-gray-400">
								{
									"Juntos faremos as escolas mais seguras. Proteger para aprender"
								}
							</p>
							<div className="flex flex-col mb-8 lg:mb-16 space-y-4 sm:flex-row sm:justify-center sm:space-y-0 sm:space-x-4">
								<Link
									href='/dashboard'
									className="inline-flex justify-center items-center py-3 px-5 text-primary  font-medium text-center  rounded-lg bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
								>
									{"Dashboard"}
									<svg
										className="ml-2 -mr-1 w-5 h-5"
										fill="currentColor"
										viewBox="0 0 20 20"
										xmlns="http://www.w3.org/2000/svg"
										role="img"
										aria-label="Saiba mais"
									>
										<path
											fillRule="evenodd"
											d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
											clipRule="evenodd"
										/>
									</svg>
								</Link>
							</div>
							<div className="px-4 mx-auto text-center md:max-w-screen-md lg:max-w-screen-lg lg:px-36">
								<div className="flex flex-wrap justify-center items-center mt-8 text-gray-500 sm:justify-between">
									<a
										href="https://livepix.gg/brkilian"
										className="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400"
										target="_blank"
										rel="noreferrer"
									>
										<div className="flex items-center space-x-2 text-4xl">
											{/* <HandCoins className="w-8 h-8 rounded-md dark:text-white/70" /> */}
											<span>{"SEED"}</span>
										</div>
									</a>
									<a
										href="https://livepix.gg/brkilian"
										className="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400"
										target="_blank"
										rel="noreferrer"
									>
										<div className="flex items-center space-x-2 text-4xl">
											{/* <HandCoins className="w-8 h-8 rounded-md dark:text-white/70" /> */}
											<span>{"GEA"}</span>
										</div>
									</a>
									<a
										href="twitch.tv/developerdeck101"
										className="mr-5 mb-5 lg:mb-0 hover:text-gray-800 dark:hover:text-gray-400"
									>
										<div className="flex items-center space-x-2 text-4xl">
											{/* <Twitch className="w-8 h-8 rounded-md dark:text-white/70" /> */}
											<span>{"PM"}</span>
										</div>
									</a>
								</div>
							</div>
						</div>
					</section>
				</div>
			</main>
		</div>
	);
}