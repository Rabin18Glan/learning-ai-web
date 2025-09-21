

import Logo from "@/components/logo"
import UserDropDown from "@/components/user-drop-down"
function UserHeader() {
  return (
    <header className="sticky top-0 z-50 border-b bg-gradient-to-r from-blue-50/80 to-indigo-50/80 dark:from-blue-950/40 dark:to-indigo-950/40 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">

        <div className="flex items-center gap-2 font-bold text-xl">

          <Logo variant="vibrant" />
        </div>
        <div className="flex items-center gap-2">

          <UserDropDown />
        </div>
      </div>
    </header>
  )
}

export default UserHeader