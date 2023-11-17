import { MdThumbDownAlt, MdThumbUpAlt } from "react-icons/md";

export const FeedBackButton = () => {
  return (
    <div className="-top-10 absolute space-x-4 flex items-center">
      <span>Como avalia a playlist?</span>
      <button> <MdThumbUpAlt size={32} color={"#06c941"}/></button>
      <button> <MdThumbDownAlt size={32} color={"#c92a06"}/></button>
    </div>
  )
}