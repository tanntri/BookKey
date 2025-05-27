import { createElement } from "react";
import { type IconBaseProps } from "react-icons"
import { GoHeart, GoHeartFill, GoStarFill } from "react-icons/go";

const icons = {
    notLiked: GoHeart,
    liked: GoHeartFill,
    star: GoStarFill,
}

export const Icon = ({name, ...restProps}: {name: keyof typeof icons } & IconBaseProps) => {
    return createElement(icons[name], restProps)
}