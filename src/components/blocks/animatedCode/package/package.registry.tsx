import { Book } from "lucide-react"
import AnimatedCodeChallengev1 from "."
import AnimatedCodeChallengeEditor from "./package.creator"
import { animatedCodeChallengeObject } from "./package.example"

export const animatedCodeRegistry = {
    type: "animatedCode",
    name: "Animated Code Block",
    icon: Book,
    render: AnimatedCodeChallengev1,
    Editor: AnimatedCodeChallengeEditor,
    defaultData: animatedCodeChallengeObject
}