import Link from "next/link"
import { version } from "../../../../package.json"

export function AppVersion({ size }: { size?: number }) {
  return (
    <div className="flex flex-row items-center gap-1 text-sm py-0.5 px-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded">
      <span>v</span>
      <span>{version}</span>
    </div>
  )
}

export function Logo() {
  return (
    <svg
      className="w-10 h-10 relative right-1"
      viewBox="0 0 200 200"
      xmlns="http://www.w3.org/2000/svg"
    >
      <polygon points="50,150 100,50 150,150" fill="blue" />
      <polygon points="100,151 150,71 200,151" fill="#87CEEB" />
    </svg>
  )
}

export default function HeaderLogo({ url }: { url: string }) {
  return (
    <div className="flex items-center">
      <Link href={url}>
        <div className="flex flex-row items-center gap-2">
          <div className="bg-gray-100 rounded-md flex justify-center items-center w-14 h-12 mr-0.5">
            <Logo />
          </div>
          <AppVersion />
        </div>
      </Link>
    </div>
  )
}
