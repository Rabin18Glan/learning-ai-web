
"use client";

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, Save, Trash2, FileText, Edit, Search, 
  Calendar, Clock, Filter, SortAsc, 
  Tag, Maximize2, Minimize2,
  Bold, Italic, List, ListOrdered, Quote,
  Code, Link, Image, Heading1, Heading2,
  Copy, ExternalLink, Star,
  StarOff, Archive, MoreVertical, Pin,
  PinOff, Download, Share, Palette,
  Type, AlignLeft, AlignCenter, AlignRight,
  Underline, Strikethrough, ArrowLeft
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useSession } from "next-auth/react";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from "@/components/ui/dropdown-menu";
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/components/ui/use-toast";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/esm/styles/prism";

interface Note {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId?: string;
  tags?: string[];
  isPinned?: boolean;
  isFavorite?: boolean;
  isArchived?: boolean;
  color?: string;
}

interface NotesEditorProps {
  learningPathId: string;
}

const COLORS = [
  { name: 'Default', value: 'default', bg: 'bg-background', border: 'border-border' },
  { name: 'Red', value: 'red', bg: 'bg-red-50 dark:bg-red-950/20', border: 'border-red-200 dark:border-red-800' },
  { name: 'Orange', value: 'orange', bg: 'bg-orange-50 dark:bg-orange-950/20', border: 'border-orange-200 dark:border-orange-800' },
  { name: 'Yellow', value: 'yellow', bg: 'bg-yellow-50 dark:bg-yellow-950/20', border: 'border-yellow-200 dark:border-yellow-800' },
  { name: 'Green', value: 'green', bg: 'bg-green-50 dark:bg-green-950/20', border: 'border-green-200 dark:border-green-800' },
  { name: 'Blue', value: 'blue', bg: 'bg-blue-50 dark:bg-blue-950/20', border: 'border-blue-200 dark:border-blue-800' },
  { name: 'Purple', value: 'purple', bg: 'bg-purple-50 dark:bg-purple-950/20', border: 'border-purple-200 dark:border-purple-800' },
  { name: 'Pink', value: 'pink', bg: 'bg-pink-50 dark:bg-pink-950/20', border: 'border-pink-200 dark:border-pink-800' },
];

export function NotesEditor({ learningPathId }: NotesEditorProps) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState("");
  const [editTags, setEditTags] = useState<string[]>([]);
  const [newTag, setNewTag] = useState("");
  const [sortBy, setSortBy] = useState<'updated' | 'created' | 'title'>('updated');
  const [filterBy, setFilterBy] = useState<'all' | 'pinned' | 'favorites' | 'archived'>('all');
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [autoSave, setAutoSave] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const editorRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const auth = useSession();

  // Debounced auto-save
  const debouncedSave = useCallback(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    
    saveTimeoutRef.current = setTimeout(() => {
      if (autoSave && hasUnsavedChanges && activeNote && isEditing) {
        handleSaveNote(true);
      }
    }, 3000);
  }, [autoSave, hasUnsavedChanges, activeNote, isEditing]);

  // Track changes
  useEffect(() => {
    if (!activeNote || !isEditing) {
      setHasUnsavedChanges(false);
      return;
    }
    
    const hasChanges = editTitle !== activeNote.title || 
                      editContent !== activeNote.content || 
                      JSON.stringify(editTags) !== JSON.stringify(activeNote.tags || []);
    
    setHasUnsavedChanges(hasChanges);
    
    if (hasChanges) {
      debouncedSave();
    }
  }, [editTitle, editContent, editTags, activeNote, isEditing, debouncedSave]);

  // Fetch notes
  const fetchNotes = useCallback(async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/learning-paths/${learningPathId}/notes`);
      if (!res.ok) throw new Error('Failed to fetch notes');
      const data = await res.json();
      setNotes(data);
      setActiveNote(null); // Start with no note selected
    } catch (error) {
      console.error("Error fetching notes:", error);
      toast({
        title: "Error",
        description: "Failed to load notes. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [learningPathId]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Create new note
  const handleCreateNote = () => {
    const newNote: Note = {
      _id: Date.now().toString(),
      title: "Untitled Note",
      content: "Start writing your thoughts here...",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      userId: auth.data?.user?.id,
      tags: [],
      isPinned: false,
      isFavorite: false,
      isArchived: false,
      color: 'default'
    };
    setNotes(prev => [newNote, ...prev]);
    setActiveNote(newNote);
    setEditTitle(newNote.title);
    setEditContent(newNote.content);
    setEditTags(newNote.tags || []);
    setIsEditing(true);
    setHasUnsavedChanges(false);
    setTimeout(() => titleRef.current?.focus(), 100);
  };

  // Edit note
  const handleEditNote = () => {
    if (activeNote) {
      setEditTitle(activeNote.title);
      setEditContent(activeNote.content);
      setEditTags(activeNote.tags || []);
      setIsEditing(true);
      setHasUnsavedChanges(false);
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  };

  // Save note
  const handleSaveNote = async (silent = false) => {
    if (!activeNote || isSaving) return;
    setIsSaving(true);
    const updatedNote: Note = {
      ...activeNote,
      title: editTitle || "Untitled Note",
      content: editContent,
      tags: editTags,
      updatedAt: new Date().toISOString(),
      userId: auth.data?.user?.id,
    };
    try {
      const res = await fetch(`/api/learning-paths/${learningPathId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      });
      if (!res.ok) throw new Error("Failed to save note");
      const savedNote = await res.json();
      setNotes(prev => prev.map(note => (note._id === savedNote.id ? savedNote : note)));
      setActiveNote(savedNote);
      setHasUnsavedChanges(false);
      if (!silent) {
        setIsEditing(false);
        toast({
          title: "Success",
          description: "Note saved successfully!",
        });
      }
    } catch (error) {
      console.error("Error saving note:", error);
      toast({
        title: "Error",
        description: "Failed to save note. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSaving(false);
    }
  };

  // Cancel edit
  const handleCancelEdit = () => {
    if (activeNote) {
      setEditTitle(activeNote.title);
      setEditContent(activeNote.content);
      setEditTags(activeNote.tags || []);
    }
    setIsEditing(false);
    setHasUnsavedChanges(false);
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
  };

  // Delete note
  const handleDeleteNote = async () => {
    if (!activeNote) return;
    try {
      const res = await fetch(`/api/learning-paths/${learningPathId}/notes`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ noteId: activeNote._id }),
      });
      if (!res.ok) throw new Error("Failed to delete note");
      const updatedNotes = notes.filter(note => note._id !== activeNote._id);
      setNotes(updatedNotes);
      setActiveNote(null);
      setIsEditing(false);
      setHasUnsavedChanges(false);
      toast({
        title: "Success",
        description: "Note deleted successfully!",
      });
    } catch (error) {
      console.error("Error deleting note:", error);
      toast({
        title: "Error",
        description: "Failed to delete note. Please try again.",
        variant: "destructive"
      });
    }
  };

  // Select note
  const handleSelectNote = (note: Note) => {
    if (hasUnsavedChanges) {
      handleSaveNote(true);
    }
    setActiveNote(note);
    setIsEditing(false);
    setHasUnsavedChanges(false);
  };

  // Toggle note property
  const toggleNoteProperty = async (noteId: string, property: 'isPinned' | 'isFavorite' | 'isArchived') => {
    const note = notes.find(n => n._id === noteId);
    if (!note) return;
    const updatedNote = {
      ...note,
      [property]: !note[property],
      updatedAt: new Date().toISOString()
    };
    try {
      const res = await fetch(`/api/learning-paths/${learningPathId}/notes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedNote),
      });
      if (!res.ok) throw new Error("Failed to update note");
      const savedNote = await res.json();
      setNotes(prev => prev.map(n => (n._id === savedNote.id ? savedNote : n)));
      if (activeNote?._id === savedNote.id) {
        setActiveNote(savedNote);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !editTags.includes(newTag.trim())) {
      setEditTags(prev => [...prev, newTag.trim()]);
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove: string) => {
    setEditTags(prev => prev.filter(tag => tag !== tagToRemove));
  };

  // Rich text editor functions
  const formatText = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    editorRef.current?.focus();
  };

  const insertText = (text: string) => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      range.deleteContents();
      range.insertNode(document.createTextNode(text));
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    editorRef.current?.focus();
  };

  // Filter and sort notes
  const filteredAndSortedNotes = useMemo(() => {
    let filtered = notes.filter(note => {
      const matchesSearch = !searchQuery || 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesFilter = 
        filterBy === 'all' ||
        (filterBy === 'pinned' && note.isPinned) ||
        (filterBy === 'favorites' && note.isFavorite) ||
        (filterBy === 'archived' && note.isArchived);
      return matchesSearch && matchesFilter;
    });

    filtered.sort((a, b) => {
      if (a.isPinned !== b.isPinned) return b.isPinned ? 1 : -1;
      switch (sortBy) {
        case 'title':
          return a.title.localeCompare(b.title);
        case 'created':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'updated':
        default:
          return new Date(b.updatedAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

    return filtered;
  }, [notes, searchQuery, sortBy, filterBy]);

  const getColorClasses = (color?: string) => {
    const colorConfig = COLORS.find(c => c.value === color) || COLORS[0];
    return {
      bg: colorConfig.bg,
      border: colorConfig.border
    };
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-48 w-full rounded-lg" />
        ))}
      </div>
    );
  }

  return (
    <TooltipProvider>
      <div className="min-h-0 max-h-full max-w-full p-4">
        {activeNote ? (
          // Full-screen note view
          <Card className="flex-1 flex flex-col border border-border">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    if (hasUnsavedChanges) handleSaveNote(true);
                    setActiveNote(null);
                    setIsEditing(false);
                  }}
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Notes
                </Button>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {hasUnsavedChanges && <Badge variant="secondary" className="text-xs">Unsaved changes</Badge>}
                  {isSaving && <Badge variant="secondary" className="text-xs">Saving...</Badge>}
                  <Switch
                    id="auto-save"
                    checked={autoSave}
                    onCheckedChange={setAutoSave}
                    className="scale-75"
                  />
                  <Label htmlFor="auto-save" className="text-xs">Auto-save</Label>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsFullscreen(!isFullscreen)}
                    >
                      {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    {isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
                  </TooltipContent>
                </Tooltip>
                {isEditing ? (
                  <>
                    <Button variant="outline" size="sm" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button size="sm" onClick={() => handleSaveNote()} disabled={isSaving}>
                      <Save className="h-4 w-4 mr-2" />
                      {isSaving ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="outline" size="sm" onClick={handleEditNote}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => navigator.clipboard.writeText(activeNote.content)}>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy content
                        </DropdownMenuItem>
                        
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          className="text-red-600"
                          onClick={handleDeleteNote}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </>
                )}
              </div>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              {isEditing ? (
                <div className="h-full flex flex-col">
                  {/* Rich Text Toolbar */}
                  <div className="border-b p-3 bg-muted/20">
                    <div className="flex items-center gap-1 flex-wrap">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => formatText('bold')}
                          >
                            <Bold className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bold (Ctrl+B)</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => formatText('italic')}
                          >
                            <Italic className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Italic (Ctrl+I)</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => formatText('underline')}
                          >
                            <Underline className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Underline (Ctrl+U)</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => formatText('strikeThrough')}
                          >
                            <Strikethrough className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Strikethrough</TooltipContent>
                      </Tooltip>
                      <Separator orientation="vertical" className="mx-1 h-6" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Type className="h-4 w-4 mr-1" />
                            <span className="text-xs">Heading</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => formatText('formatBlock', 'h1')}>
                            <Heading1 className="mr-2 h-4 w-4" />
                            Heading 1
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => formatText('formatBlock', 'h2')}>
                            <Heading2 className="mr-2 h-4 w-4" />
                            Heading 2
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => formatText('formatBlock', 'p')}>
                            <Type className="mr-2 h-4 w-4" />
                            Normal Text
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => formatText('insertUnorderedList')}
                          >
                            <List className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Bullet List</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => formatText('insertOrderedList')}
                          >
                            <ListOrdered className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Numbered List</TooltipContent>
                      </Tooltip>
                      <Separator orientation="vertical" className="mx-1 h-6" />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => formatText('justifyLeft')}
                          >
                            <AlignLeft className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Align Left</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => formatText('justifyCenter')}
                          >
                            <AlignCenter className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Align Center</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => formatText('justifyRight')}
                          >
                            <AlignRight className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Align Right</TooltipContent>
                      </Tooltip>
                      <Separator orientation="vertical" className="mx-1 h-6" />
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => {
                              const url = prompt('Enter link URL:');
                              if (url) formatText('createLink', url);
                            }}
                          >
                            <Link className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Insert Link</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => formatText('formatBlock', 'blockquote')}
                          >
                            <Quote className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Quote</TooltipContent>
                      </Tooltip>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 px-2"
                            onClick={() => insertText('`code`')}
                          >
                            <Code className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>Inline Code</TooltipContent>
                      </Tooltip>
                      <Separator orientation="vertical" className="mx-1 h-6" />
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 px-2">
                            <Palette className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuLabel>Note Color</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <div className="grid grid-cols-4 gap-1 p-2">
                            {COLORS.map(color => (
                              <Button
                                key={color.value}
                                variant="ghost"
                                className={`h-8 w-8 p-0 rounded-full ${color.bg} border-2 ${
                                  activeNote.color === color.value ? color.border : 'border-transparent'
                                }`}
                                onClick={() => {
                                  const updatedNote = { ...activeNote, color: color.value };
                                  setActiveNote(updatedNote);
                                }}
                                title={color.name}
                              />
                            ))}
                          </div>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>

                  {/* Title Input */}
                  <div className="p-4 border-b">
                    <Input
                      ref={titleRef}
                      placeholder="Note title..."
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="text-2xl font-bold border-0 px-0 focus-visible:ring-0 bg-transparent placeholder:text-muted-foreground/50"
                    />
                    <div className="mt-4 flex flex-wrap gap-2 items-center">
                      {editTags.map(tag => (
                        <Badge key={tag} variant="secondary" className="text-xs px-2 py-1">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-4 w-4 p-0 ml-1 hover:bg-transparent text-muted-foreground hover:text-foreground"
                            onClick={() => removeTag(tag)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Add tag..."
                          value={newTag}
                          onChange={(e) => setNewTag(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && addTag()}
                          className="w-32 h-7 text-xs"
                        />
                        <Button size="sm" variant="ghost" onClick={addTag} className="h-7 px-2">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  {/* Rich Text Editor */}
                  <div className="flex-1 p-4 overflow-auto">
                    <div
                      ref={editorRef}
                      contentEditable
                      className="w-full h-full min-h-[400px] outline-none text-sm leading-relaxed prose prose-sm max-w-none focus:prose-headings:text-foreground prose-headings:text-foreground prose-p:text-foreground prose-li:text-foreground prose-strong:text-foreground prose-em:text-foreground prose-code:text-foreground prose-blockquote:text-foreground"
                      style={{ 
                        wordWrap: 'break-word',
                        whiteSpace: 'pre-wrap'
                      }}
                      onInput={(e) => {
                        const content = e.currentTarget.innerHTML;
                        setEditContent(content);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Tab') {
                          e.preventDefault();
                          formatText('indent');
                        }
                        if (e.ctrlKey || e.metaKey) {
                          if (e.key === 'b') {
                            e.preventDefault();
                            formatText('bold');
                          }
                          if (e.key === 'i') {
                            e.preventDefault();
                            formatText('italic');
                          }
                          if (e.key === 'u') {
                            e.preventDefault();
                            formatText('underline');
                          }
                          if (e.key === 's') {
                            e.preventDefault();
                            handleSaveNote();
                          }
                        }
                      }}
                      dangerouslySetInnerHTML={{ __html: editContent }}
                    />
                  </div>

                  {/* Footer */}
                  <div className="border-t p-3 bg-muted/20">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>
                          {editContent.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(word => word.length > 0).length} words
                        </span>
                        <span>
                          {editContent.replace(/<[^>]*>/g, '').length} characters
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>Last saved: {activeNote.updatedAt ? new Date(activeNote.updatedAt).toLocaleTimeString() : 'Never'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full overflow-auto">
                  <div className="sticky top-0 bg-background/95 backdrop-blur-sm border-b p-6 z-10">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h1 className="text-3xl font-bold mb-3 leading-tight">{activeNote.title}</h1>
                        <div className="flex items-center gap-6 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            <span>Created {new Date(activeNote.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>Modified {new Date(activeNote.updatedAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}</span>
                          </div>
                        </div>
                        {activeNote.tags && activeNote.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {activeNote.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-sm px-3 py-1">
                                <Tag className="h-3 w-3 mr-1" />
                                {tag}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-start gap-2 ml-6">
                        {activeNote.isPinned && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Pin className="h-3 w-3" />
                            Pinned
                          </Badge>
                        )}
                        {activeNote.isFavorite && (
                          <Badge variant="secondary" className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-current" />
                            Favorite
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className={`p-8 ${getColorClasses(activeNote.color).bg}`}>
                    <div className="prose dark:prose-invert max-w-none prose-lg">
                      {activeNote.content.includes('<') ? (
                        <div 
                          className="prose-content"
                          dangerouslySetInnerHTML={{ __html: activeNote.content }} 
                        />
                      ) : (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ className, children, ...props }) {
                              const match = /language-(\w+)/.exec(className || '');
                              const inline = !match;
                              return !inline && match ? (
                                <SyntaxHighlighter
                                  style={tomorrow}
                                  language={match[1]}
                                  PreTag="div"
                                  className="rounded-lg !my-6"
                                  {...props}
                                >
                                  {String(children).replace(/\n$/, '')}
                                </SyntaxHighlighter>
                              ) : (
                                <code className="bg-muted px-2 py-1 rounded text-sm font-mono" {...props}>
                                  {children}
                                </code>
                              );
                            },
                            blockquote({ children }) {
                              return (
                                <blockquote className="border-l-4 border-primary bg-muted/30 pl-6 py-4 my-6 rounded-r-lg">
                                  {children}
                                </blockquote>
                              );
                            },
                            table({ children }) {
                              return (
                                <div className="overflow-x-auto my-8 rounded-lg border shadow-sm">
                                  <table className="w-full border-collapse bg-background">
                                    {children}
                                  </table>
                                </div>
                              );
                            },
                            th({ children }) {
                              return (
                                <th className="border-b border-border bg-muted/50 px-4 py-3 text-left font-semibold">
                                  {children}
                                </th>
                              );
                            },
                            td({ children }) {
                              return (
                                <td className="border-b border-border px-4 py-3">
                                  {children}
                                </td>
                              );
                            },
                            a({ href, children }) {
                              return (
                                <a
                                  href={href}
                                  className="text-primary hover:underline font-medium inline-flex items-center gap-1 transition-colors"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                >
                                  {children}
                                  <ExternalLink className="h-3 w-3" />
                                </a>
                              );
                            },
                            hr() {
                              return <hr className="my-8 border-border" />;
                            },
                            h1({ children }) {
                              return <h1 className="text-4xl font-bold mb-6 pb-2 border-b border-border">{children}</h1>;
                            },
                            h2({ children }) {
                              return <h2 className="text-3xl font-semibold mb-5">{children}</h2>;
                            },
                            h3({ children }) {
                              return <h3 className="text-2xl font-semibold mb-4">{children}</h3>;
                            },
                            h4({ children }) {
                              return <h4 className="text-xl font-semibold mb-3">{children}</h4>;
                            },
                            p({ children }) {
                              return <p className="mb-4 leading-7 text-foreground">{children}</p>;
                            },
                            ul({ children }) {
                              return <ul className="list-disc pl-6 mb-6 space-y-2">{children}</ul>;
                            },
                            ol({ children }) {
                              return <ol className="list-decimal pl-6 mb-6 space-y-2">{children}</ol>;
                            },
                            li({ children }) {
                              return <li className="leading-7">{children}</li>;
                            }
                          }}
                        >
                          {activeNote.content}
                        </ReactMarkdown>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        ) : (
          // Notes grid view
          <div className="flex flex-col gap-4">
            {/* Search and Actions */}
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search notes..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuLabel>Filter & Sort</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterBy('all')}>
                    <FileText className="mr-2 h-4 w-4" />
                    All Notes ({notes.length})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('pinned')}>
                    <Pin className="mr-2 h-4 w-4" />
                    Pinned ({notes.filter(n => n.isPinned).length})
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterBy('favorites')}>
                    <Star className="mr-2 h-4 w-4" />
                    Favorites ({notes.filter(n => n.isFavorite).length})
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setSortBy('updated')}>
                    <Clock className="mr-2 h-4 w-4" />
                    Last Modified
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('created')}>
                    <Calendar className="mr-2 h-4 w-4" />
                    Date Created
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy('title')}>
                    <SortAsc className="mr-2 h-4 w-4" />
                    Title A-Z
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button onClick={handleCreateNote}>
                <Plus className="h-4 w-4 mr-2" />
                New
              </Button>
            </div>

            {/* Filter Badges */}
            {(filterBy !== 'all' || searchQuery) && (
              <div className="flex flex-wrap gap-2">
                {filterBy !== 'all' && (
                  <Badge variant="secondary" className="text-xs">
                    {filterBy.charAt(0).toUpperCase() + filterBy.slice(1)}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => setFilterBy('all')}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
                {searchQuery && (
                  <Badge variant="secondary" className="text-xs">
                    "{searchQuery}"
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-4 w-4 p-0 ml-1 hover:bg-transparent"
                      onClick={() => setSearchQuery("")}
                    >
                      ×
                    </Button>
                  </Badge>
                )}
              </div>
            )}

            {/* Notes Grid */}
            {filteredAndSortedNotes.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAndSortedNotes.map((note) => {
                  const colorClasses = getColorClasses(note.color);
                  return (
                    <Card
                      key={note._id as string}
                      className={`cursor-pointer transition-all border-2 hover:shadow-md ${colorClasses.bg} ${colorClasses.border}`}
                      onClick={() => handleSelectNote(note)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-sm leading-5 line-clamp-2">{note.title}</h3>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="opacity-0 group-hover:opacity-100 h-6 w-6 p-0"
                                onClick={(e) => e.stopPropagation()}
                              >
                                <MoreVertical className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                              <DropdownMenuItem onClick={() => toggleNoteProperty(note._id, 'isPinned')}>
                                {note.isPinned ? <PinOff className="mr-2 h-4 w-4" /> : <Pin className="mr-2 h-4 w-4" />}
                                {note.isPinned ? 'Unpin' : 'Pin'}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => toggleNoteProperty(note._id, 'isFavorite')}>
                                {note.isFavorite ? <StarOff className="mr-2 h-4 w-4" /> : <Star className="mr-2 h-4 w-4" />}
                                {note.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem 
                                className="text-red-600"
                                onClick={async () => {
                                  setActiveNote(note);
                                  await handleDeleteNote();
                                }}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                        <div className="flex items-center gap-1 mb-2">
                          {note.isPinned && <Pin className="h-3 w-3 text-primary flex-shrink-0" />}
                          {note.isFavorite && <Star className="h-3 w-3 text-yellow-500 fill-yellow-500 flex-shrink-0" />}
                          {note.isArchived && <Archive className="h-3 w-3 text-muted-foreground flex-shrink-0" />}
                        </div>
                        <p className="text-xs text-muted-foreground leading-4 mb-3 line-clamp-3">
                          {note.content.replace(/[#*`>\-\[\]]/g, '').substring(0, 100)}
                          {note.content.length > 100 && '...'}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">
                            {new Date(note.updatedAt).toLocaleDateString('en-US', { 
                              month: 'short', 
                              day: 'numeric',
                              year: new Date(note.updatedAt).getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
                            })}
                          </span>
                          {note.tags && note.tags.length > 0 && (
                            <div className="flex gap-1 flex-wrap">
                              {note.tags.slice(0, 2).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs px-1.5 py-0 h-5">
                                  {tag}
                                </Badge>
                              ))}
                              {note.tags.length > 2 && (
                                <Badge variant="outline" className="text-xs px-1.5 py-0 h-5">
                                  +{note.tags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                <FileText className="h-12 w-12 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium mb-2">
                  {searchQuery || filterBy !== 'all' ? 'No notes found' : 'No notes yet'}
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  {searchQuery || filterBy !== 'all' 
                    ? 'Try adjusting your search or filter' 
                    : 'Create your first note to get started'}
                </p>
                {(!searchQuery && filterBy === 'all') && (
                  <Button onClick={handleCreateNote} size="sm">
                    <Plus className="h-4 w-4 mr-2" />
                    Create Note
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}
