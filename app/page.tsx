"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, RotateCcw, BookOpen, Trophy, Target } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { quizData } from "@/lib/quiz-data"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: string
  explanation: string
  source: string
  topic: string
}

interface QuizStats {
  correct: number
  total: number
  streak: number
  bestStreak: number
}

export default function JavaQuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [stats, setStats] = useState<QuizStats>({ correct: 0, total: 0, streak: 0, bestStreak: 0 })
  const [selectedTopic, setSelectedTopic] = useState<string>("all")
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set())

  const topics = [
    "all",
    "Classes & Objects",
    "Modifiers & Encapsulation",
    "Inheritance & Polymorphism",
    "Interfaces & Abstract Classes",
    "UML & Design",
  ]

  const getFilteredQuestions = () => {
    if (selectedTopic === "all") return quizData
    return quizData.filter((q) => q.topic === selectedTopic)
  }

  const getRandomQuestion = () => {
    const filteredQuestions = getFilteredQuestions()
    const availableQuestions = filteredQuestions.filter((q) => !usedQuestions.has(q.id))

    if (availableQuestions.length === 0) {
      // Reset used questions if all have been used
      setUsedQuestions(new Set())
      return filteredQuestions[Math.floor(Math.random() * filteredQuestions.length)]
    }

    return availableQuestions[Math.floor(Math.random() * availableQuestions.length)]
  }

  const startNewQuestion = () => {
    const question = getRandomQuestion()
    setCurrentQuestion(question)
    setSelectedAnswer("")
    setShowResult(false)
  }

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
  }

  const submitAnswer = () => {
    if (!selectedAnswer || !currentQuestion) return

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer
    const newStats = {
      ...stats,
      total: stats.total + 1,
      correct: isCorrect ? stats.correct + 1 : stats.correct,
      streak: isCorrect ? stats.streak + 1 : 0,
      bestStreak: isCorrect ? Math.max(stats.bestStreak, stats.streak + 1) : stats.bestStreak,
    }

    setStats(newStats)
    setUsedQuestions((prev) => new Set([...prev, currentQuestion.id]))
    setShowResult(true)
  }

  const resetQuiz = () => {
    setStats({ correct: 0, total: 0, streak: 0, bestStreak: 0 })
    setUsedQuestions(new Set())
    startNewQuestion()
  }

  useEffect(() => {
    startNewQuestion()
  }, [selectedTopic])

  const accuracy = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4 transition-colors">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <div></div>
            <ThemeToggle />
          </div>
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2 flex items-center justify-center gap-2">
            <BookOpen className="text-blue-600 dark:text-blue-400" />
            Java OOP Quiz
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Kiểm tra kiến thức Java Object-Oriented Programming của bạn
          </p>
        </div>

        {/* Stats Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <Target className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{accuracy}%</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Độ chính xác</div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">
                {stats.correct}/{stats.total}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Đúng/Tổng</div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-yellow-600 dark:text-yellow-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.streak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Chuỗi hiện tại</div>
            </CardContent>
          </Card>

          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4 text-center">
              <Trophy className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-2" />
              <div className="text-2xl font-bold text-gray-800 dark:text-gray-100">{stats.bestStreak}</div>
              <div className="text-sm text-gray-600 dark:text-gray-400">Chuỗi tốt nhất</div>
            </CardContent>
          </Card>
        </div>

        {/* Topic Selection */}
        <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-lg dark:text-gray-100">Chọn chủ đề</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {topics.map((topic) => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTopic(topic)}
                  className="capitalize"
                >
                  {topic === "all" ? "Tất cả" : topic}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Question Card */}
        {currentQuestion && (
          <Card className="mb-6 dark:bg-gray-800 dark:border-gray-700">
            <CardHeader>
              <div className="flex justify-between items-start mb-4">
                <Badge variant="secondary" className="mb-2 dark:bg-gray-700 dark:text-gray-300">
                  {currentQuestion.topic}
                </Badge>
                <Badge variant="outline" className="dark:border-gray-600 dark:text-gray-300">
                  Câu {stats.total + 1}
                </Badge>
              </div>
              <CardTitle className="text-xl leading-relaxed dark:text-gray-100">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-6">
                {currentQuestion.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index) // A, B, C, D
                  const isSelected = selectedAnswer === letter
                  const isCorrect = letter === currentQuestion.correctAnswer
                  const isWrong = showResult && isSelected && !isCorrect

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(letter)}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all duration-200 ${
                        showResult
                          ? isCorrect
                            ? "border-green-500 bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300"
                            : isWrong
                              ? "border-red-500 bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300"
                              : "border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700/50 dark:text-gray-300"
                          : isSelected
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300"
                            : "border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:bg-gray-50 dark:hover:bg-gray-700/50 dark:text-gray-300"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-sm font-bold ${
                            showResult
                              ? isCorrect
                                ? "bg-green-500 text-white"
                                : isWrong
                                  ? "bg-red-500 text-white"
                                  : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                              : isSelected
                                ? "bg-blue-500 text-white"
                                : "bg-gray-300 dark:bg-gray-600 text-gray-600 dark:text-gray-300"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="flex-1">{option}</span>
                        {showResult && isCorrect && (
                          <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400 flex-shrink-0" />
                        )}
                        {showResult && isWrong && (
                          <XCircle className="w-5 h-5 text-red-600 dark:text-red-400 flex-shrink-0" />
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>

              {/* Result and Explanation */}
              {showResult && (
                <div className="border-t dark:border-gray-600 pt-6">
                  <div
                    className={`p-4 rounded-lg mb-4 ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                        : "bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
                      )}
                      <span
                        className={`font-semibold ${
                          selectedAnswer === currentQuestion.correctAnswer
                            ? "text-green-800 dark:text-green-300"
                            : "text-red-800 dark:text-red-300"
                        }`}
                      >
                        {selectedAnswer === currentQuestion.correctAnswer ? "Chính xác!" : "Không chính xác!"}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
                      <strong>Đáp án đúng:</strong> {currentQuestion.correctAnswer}
                    </p>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      <strong>Giải thích:</strong> {currentQuestion.explanation}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                      <strong>Nguồn:</strong> {currentQuestion.source}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-center">
                {!showResult ? (
                  <Button onClick={submitAnswer} disabled={!selectedAnswer} className="px-8">
                    Xác nhận đáp án
                  </Button>
                ) : (
                  <>
                    <Button onClick={startNewQuestion} className="px-6">
                      Câu tiếp theo
                    </Button>
                    <Button variant="outline" onClick={resetQuiz} className="px-6 bg-transparent">
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Làm lại
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Progress */}
        {stats.total > 0 && (
          <Card className="dark:bg-gray-800 dark:border-gray-700">
            <CardContent className="p-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium dark:text-gray-200">Tiến độ học tập</span>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {stats.correct}/{stats.total} câu đúng
                </span>
              </div>
              <Progress value={accuracy} className="h-2" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
