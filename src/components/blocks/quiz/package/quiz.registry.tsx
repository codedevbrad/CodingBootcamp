import { Book } from "lucide-react"
import QuizBlockCore from "."
import QuizBlockEditor from "./quiz.creator"
import { quizBlockObject } from "./quiz.example"

export const quizRegistry = {
    type: "quiz",
    name: "Quiz Block",
    icon: Book,
    render: QuizBlockCore,
    Editor: QuizBlockEditor,
    defaultData: quizBlockObject
}