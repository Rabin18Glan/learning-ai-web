"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { OpenSourceLLM, OpenSourceEmbedding } from "@/lib/langchain/models"

interface ModelSelectorProps {
  models: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
}

export function ModelSelector({
  models,
  value,
  onChange,
  placeholder = "Select a model",
  disabled = false,
}: ModelSelectorProps) {
  const [open, setOpen] = React.useState(false)

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
          disabled={disabled}
        >
          {value ? models.find((model) => model.value === value)?.label : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search models..." />
          <CommandList>
            <CommandEmpty>No model found.</CommandEmpty>
            <CommandGroup>
              {models.map((model) => (
                <CommandItem
                  key={model.value}
                  value={model.value}
                  onSelect={(currentValue) => {
                    onChange(currentValue)
                    setOpen(false)
                  }}
                >
                  <Check className={cn("mr-2 h-4 w-4", value === model.value ? "opacity-100" : "opacity-0")} />
                  {model.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

export function LLMModelSelector({
  value,
  onChange,
  disabled = false,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const llmModels = Object.values(OpenSourceLLM).map((model) => ({
    value: model,
    label: model,
  }))

  return (
    <ModelSelector
      models={llmModels}
      value={value}
      onChange={onChange}
      placeholder="Select LLM model"
      disabled={disabled}
    />
  )
}

export function EmbeddingModelSelector({
  value,
  onChange,
  disabled = false,
}: {
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}) {
  const embeddingModels = Object.values(OpenSourceEmbedding).map((model) => ({
    value: model,
    label: model,
  }))

  return (
    <ModelSelector
      models={embeddingModels}
      value={value}
      onChange={onChange}
      placeholder="Select embedding model"
      disabled={disabled}
    />
  )
}
