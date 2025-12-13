import GoBackButton from "../creator/(layout)/goback"

export default function SubscriptionLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full p-5">
      <GoBackButton />
      {children}
    </div>
  )
}