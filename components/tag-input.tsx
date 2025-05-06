"use client"

import type React from "react"

import { useState, type KeyboardEvent } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

interface TagInputProps {
  id?: string
  placeholder?: string
  tags: string[]
  setTags: (tags: string[]) => void
  maxTags?: number
}

export function TagInput({ id, placeholder = "Add tag...", tags, setTags, maxTags = 10 }: TagInputProps) {
  const [inputValue, setInputValue] = useState("")

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value)
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim() !== "") {
      e.preventDefault()
      if (tags.length >= maxTags) return

      // Don't add duplicate tags
      if (!tags.includes(inputValue.trim())) {
        setTags([...tags, inputValue.trim()])
      }
      setInputValue("")
    }
  }

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index))
  }

  return (
    <div className="border rounded-md flex flex-wrap gap-2 p-2 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
      {tags.map((tag, index) => (
        <Badge key={index} variant="secondary" className="flex items-center gap-1">
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="h-4 w-4 rounded-full hover:bg-muted-foreground/20"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove {tag}</span>
          </button>
        </Badge>
      ))}
      <Input
        id={id}
        type="text"
        value={inputValue}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={tags.length < maxTags ? placeholder : `Maximum ${maxTags} tags`}
        className="flex-1 border-0 p-0 focus-visible:ring-0 focus-visible:ring-offset-0"
        disabled={tags.length >= maxTags}
      />
    </div>
  )
}
