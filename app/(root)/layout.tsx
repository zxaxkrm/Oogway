import { Work_Sans } from "next/font/google";
import Navbar from "../../components/Navbar";
import { Suspense } from "react";

const workSans = Work_Sans({
  subsets: ["latin"],
  variable: "--font-work-sans",
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
})

export default function Layout({children}: Readonly<{children: React.ReactNode}>){
return (
    <main className={workSans.variable}>
        <Suspense fallback={<div>Loading...</div>}>
        <Navbar />
      </Suspense>
        {children}
    </main>
)
}