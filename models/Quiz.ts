import mongoose, { type Document, Schema } from "mongoose"

interface IOption {
  id: string
  text: string
  isCorrect: boolean
}

interface IQuestion {
  id: string
  text: string
  type: "multipleChoice" | "trueFalse" | "shortAnswer"
  options?: IOption[]
  correctAnswer?: string
  explanation?: string
  points: number
}

interface IUserAttempt {
  userId: mongoose.Types.ObjectId
  score: number
  maxScore: number
  percentageScore: number
  startedAt: Date
  completedAt: Date
  answers: {
    questionId: string
    selectedOptionIds?: string[]
    textAnswer?: string
    isCorrect: boolean
    pointsEarned: number
  }[]
}

export interface IQuiz extends Document {
  learningPathId: mongoose.Types.ObjectId // Reference to parent LearningPath
  title: string
  description?: string
  creatorId: mongoose.Types.ObjectId
  questions: IQuestion[]
  timeLimit?: number
  passingScore: number
  isPublished: boolean
  isPublic: boolean
  attempts: IUserAttempt[]
  tags: string[]
  difficulty: "easy" | "medium" | "hard"
  createdAt: Date
  updatedAt: Date
}

const OptionSchema = new Schema<IOption>({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
})

const QuestionSchema = new Schema<IQuestion>({
  id: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["multipleChoice", "trueFalse", "shortAnswer"],
    required: true,
  },
  options: [OptionSchema],
  correctAnswer: String,
  explanation: String,
  points: {
    type: Number,
    required: true,
    default: 1,
  },
})

const UserAttemptSchema = new Schema<IUserAttempt>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  score: {
    type: Number,
    required: true,
  },
  maxScore: {
    type: Number,
    required: true,
  },
  percentageScore: {
    type: Number,
    required: true,
  },
  startedAt: {
    type: Date,
    required: true,
  },
  completedAt: {
    type: Date,
    required: true,
  },
  answers: [
    {
      questionId: {
        type: String,
        required: true,
      },
      selectedOptionIds: [String],
      textAnswer: String,
      isCorrect: {
        type: Boolean,
        required: true,
      },
      pointsEarned: {
        type: Number,
        required: true,
      },
    },
  ],
})

const QuizSchema = new Schema<IQuiz>(
  {
    learningPathId: {
      type: Schema.Types.ObjectId,
      ref: "LearningPath",
      required: true,
    },
    title: {
      type: String,
      required: [true, "Please provide a quiz title"],
      trim: true,
      maxlength: [100, "Title cannot be more than 100 characters"],
    },
    description: {
      type: String,
      trim: true,
      maxlength: [500, "Description cannot be more than 500 characters"],
    },
    creatorId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Creator ID is required"],
    },
    questions: {
      type: [QuestionSchema],
      required: [true, "Questions are required"],
      validate: {
        validator: (questions: IQuestion[]) => questions.length > 0,
        message: "Quiz must have at least one question",
      },
    },
    timeLimit: {
      type: Number,
      min: [0, "Time limit cannot be negative"],
    },
    passingScore: {
      type: Number,
      required: [true, "Passing score is required"],
      min: [0, "Passing score cannot be negative"],
      max: [100, "Passing score cannot exceed 100"],
    },
    isPublished: {
      type: Boolean,
      default: false,
    },
    isPublic: {
      type: Boolean,
      default: false,
    },
    attempts: [UserAttemptSchema],
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    difficulty: {
      type: String,
      enum: ["easy", "medium", "hard"],
      required: [true, "Difficulty level is required"],
    },
  },
  {
    timestamps: true,
  },
)

// // Indexes for faster queries
// QuizSchema.index({ creatorId: 1 })
// QuizSchema.index({ learningPathId: 1 })
// QuizSchema.index({ isPublished: 1, isPublic: 1 })
// QuizSchema.index({ tags: 1 })
// QuizSchema.index({ difficulty: 1 })

export default mongoose.models.Quiz || mongoose.model<IQuiz>("Quiz", QuizSchema)
