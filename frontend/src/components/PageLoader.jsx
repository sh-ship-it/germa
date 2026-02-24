import {LoaderIcon} from "lucide-react"
function PageLoader() {
  return (
    <div className="min-h-screen bg-slate-900 relative flex items-center justify-center p-4 overflow-hidden ">
        <LoaderIcon className="size-10 animate-spin" />
    </div>
  )
}

export default PageLoader ; 