"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, XCircle, RotateCcw, BookOpen, Trophy, Target } from "lucide-react"
import { quizData, topics, type QuizQuestion } from "@/lib/quiz-data"

interface QuizStats {
  correct: number
  total: number
  streak: number
  bestStreak: number
}

export default function JavaQuizApp() {
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [showResult, setShowResult] = useState(false)
  const [stats, setStats] = useState<QuizStats>({ correct: 0, total: 0, streak: 0, bestStreak: 0 })
  const [selectedTopic, setSelectedTopic] = useState<string>("All Topics")
  const [usedQuestions, setUsedQuestions] = useState<Set<number>>(new Set())

  const availableTopics = topics

  const getFilteredQuestions = () => {
    if (selectedTopic === "All Topics") return quizData
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
    <div className="min-h-screen bg-slate-950 p-6 transition-colors">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-slate-100 mb-3 flex items-center justify-center gap-3">
            <BookOpen className="text-blue-400" size={36} />
            Java OOP Quiz
          </h1>
          <p className="text-slate-400 text-lg">Kiểm tra kiến thức Java Object-Oriented Programming của bạn</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardContent className="p-5 text-center">
              <Target className="w-8 h-8 text-blue-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-100">{accuracy}%</div>
              <div className="text-sm text-slate-400">Độ chính xác</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardContent className="p-5 text-center">
              <CheckCircle className="w-8 h-8 text-emerald-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-100">
                {stats.correct}/{stats.total}
              </div>
              <div className="text-sm text-slate-400">Đúng/Tổng</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardContent className="p-5 text-center">
              <Trophy className="w-8 h-8 text-amber-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-100">{stats.streak}</div>
              <div className="text-sm text-slate-400">Chuỗi hiện tại</div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardContent className="p-5 text-center">
              <Trophy className="w-8 h-8 text-violet-400 mx-auto mb-3" />
              <div className="text-2xl font-bold text-slate-100">{stats.bestStreak}</div>
              <div className="text-sm text-slate-400">Chuỗi tốt nhất</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg text-slate-100">Chọn chủ đề</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {availableTopics.map((topic) => (
                <Button
                  key={topic}
                  variant={selectedTopic === topic ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedTopic(topic)}
                  className={`capitalize transition-all ${
                    selectedTopic === topic
                      ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                      : "bg-transparent border-slate-700 text-slate-300 hover:bg-slate-800 hover:border-slate-600"
                  }`}
                >
                  {topic === "All Topics" ? "Tất cả" : topic}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {currentQuestion && (
          <Card className="mb-8 bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-start mb-4">
                <Badge className="bg-slate-800 text-slate-300 border-slate-700">{currentQuestion.topic}</Badge>
                <Badge variant="outline" className="border-slate-700 text-slate-400">
                  Câu {stats.total + 1}
                </Badge>
              </div>
              <CardTitle className="text-xl leading-relaxed text-slate-100">{currentQuestion.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 mb-8">
                {currentQuestion.options.map((option, index) => {
                  const letter = String.fromCharCode(65 + index)
                  const isSelected = selectedAnswer === letter
                  const isCorrect = letter === currentQuestion.correctAnswer
                  const isWrong = showResult && isSelected && !isCorrect

                  return (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(letter)}
                      disabled={showResult}
                      className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                        showResult
                          ? isCorrect
                            ? "border-emerald-500 bg-emerald-500/10 text-emerald-300"
                            : isWrong
                              ? "border-red-500 bg-red-500/10 text-red-300"
                              : "border-slate-700 bg-slate-800/30 text-slate-400"
                          : isSelected
                            ? "border-blue-500 bg-blue-500/10 text-blue-300"
                            : "border-slate-700 hover:border-slate-600 hover:bg-slate-800/50 text-slate-300"
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        <span
                          className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold ${
                            showResult
                              ? isCorrect
                                ? "bg-emerald-500 text-white"
                                : isWrong
                                  ? "bg-red-500 text-white"
                                  : "bg-slate-700 text-slate-400"
                              : isSelected
                                ? "bg-blue-500 text-white"
                                : "bg-slate-700 text-slate-400"
                          }`}
                        >
                          {letter}
                        </span>
                        <span className="flex-1 leading-relaxed">{option}</span>
                        {showResult && isCorrect && <CheckCircle className="w-5 h-5 text-emerald-400 flex-shrink-0" />}
                        {showResult && isWrong && <XCircle className="w-5 h-5 text-red-400 flex-shrink-0" />}
                      </div>
                    </button>
                  )
                })}
              </div>

              {showResult && (
                <div className="border-t border-slate-700 pt-6">
                  <div
                    className={`p-5 rounded-xl mb-6 border ${
                      selectedAnswer === currentQuestion.correctAnswer
                        ? "bg-emerald-500/10 border-emerald-500/30"
                        : "bg-red-500/10 border-red-500/30"
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {selectedAnswer === currentQuestion.correctAnswer ? (
                        <CheckCircle className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <XCircle className="w-6 h-6 text-red-400" />
                      )}
                      <span
                        className={`font-semibold text-lg ${
                          selectedAnswer === currentQuestion.correctAnswer ? "text-emerald-300" : "text-red-300"
                        }`}
                      >
                        {selectedAnswer === currentQuestion.correctAnswer ? "Chính xác!" : "Không chính xác!"}
                      </span>
                    </div>
                    <p className="text-slate-300 mb-3 leading-relaxed">
                      <strong className="text-slate-200">Đáp án đúng:</strong> {currentQuestion.correctAnswer}
                    </p>
                    <p className="text-slate-300 mb-3 leading-relaxed">
                      <strong className="text-slate-200">Giải thích:</strong> {currentQuestion.explanation}
                    </p>
                    <p className="text-slate-400 text-sm">
                      <strong>Nguồn:</strong> {currentQuestion.source}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex gap-4 justify-center">
                {!showResult ? (
                  <Button
                    onClick={submitAnswer}
                    disabled={!selectedAnswer}
                    className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all"
                  >
                    Xác nhận đáp án
                  </Button>
                ) : (
                  <>
                    <Button
                      onClick={startNewQuestion}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition-all"
                    >
                      Câu tiếp theo
                    </Button>
                    <Button
                      variant="outline"
                      onClick={resetQuiz}
                      className="px-6 py-3 bg-transparent border-slate-600 text-slate-300 hover:bg-slate-800 hover:border-slate-500 rounded-xl transition-all"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Làm lại
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {stats.total > 0 && (
          <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
            <CardContent className="p-5">
              <div className="flex justify-between items-center mb-3">
                <span className="text-sm font-medium text-slate-200">Tiến độ học tập</span>
                <span className="text-sm text-slate-400">
                  {stats.correct}/{stats.total} câu đúng
                </span>
              </div>
              <Progress value={accuracy} className="h-3 bg-slate-800" />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
