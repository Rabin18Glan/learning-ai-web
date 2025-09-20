"use client";

import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { ChatSession, Message } from "../types/chat.types";

const useChat = (learningPathId: string) => {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingChats, setIsLoadingChats] = useState(true);
  const [editingTitleId, setEditingTitleId] = useState<string | null>(null);
  const [editingTitle, setEditingTitle] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch all chat sessions
  useEffect(() => {
    setIsLoadingChats(true);
    axios
      .get(`/api/learning-paths/${learningPathId}/chat`)
      .then((res) => {
        setSessions(res.data.chats || []);
        if (res.data.chats && res.data.chats.length > 0) {
          setSelectedChatId(res.data.chats[0]._id);
        } else {
          handleNewChat();
        }
      })
      .finally(() => {
        setIsLoadingChats(false);
      });
  }, [learningPathId]);

  // Fetch messages for selected chat
  useEffect(() => {
    if (!selectedChatId) return;
    axios
      .get(`/api/learning-paths/${learningPathId}/chat/${selectedChatId}`)
      .then((res) => setMessages(res.data.messages || []));
  }, [selectedChatId, learningPathId]);

  // Scroll to bottom when messages change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [messages]);

  // Create a new chat session
  const handleNewChat = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(`/api/learning-paths/${learningPathId}/chat`, { title: "New Chat" });
      if (res.data.chat) {
        setSessions((prev) => [res.data.chat, ...prev]);
        setSelectedChatId(res.data.chat._id);
        setMessages([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a chat session
  const handleDeleteChat = async (chatId: string) => {
    if (!window.confirm("Delete this chat?")) return;
    setIsLoading(true);
    try {
      await axios.delete(`/api/learning-paths/${learningPathId}/chat`, { data: { chatId } });
      setSessions((prev) => prev.filter((s) => s._id !== chatId));
      if (selectedChatId === chatId) {
        setSelectedChatId(sessions.length > 1 ? sessions.find((s) => s._id !== chatId)?._id || null : null);
        setMessages([]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Edit chat title
  const handleEditTitle = async (chatId: string) => {
    setIsLoading(true);
    try {
      await axios.put(`/api/learning-paths/${learningPathId}/chat`, { chatId, title: editingTitle });
      setSessions((prev) =>
        prev.map((s) => (s._id === chatId ? { ...s, title: editingTitle } : s))
      );
      setEditingTitleId(null);
      setEditingTitle("");
    } finally {
      setIsLoading(false);
    }
  };

  // Send a message
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || !selectedChatId) return;

    const userMessage = input.trim();
    setInput("");
    setMessages((prev) => [
      ...prev,
      { role: "user", content: userMessage, timestamp: new Date().toISOString() },
    ]);
    setIsLoading(true);

    try {
      const response = await axios.post(`/api/learning-paths/${learningPathId}/chat/${selectedChatId}`, {
        content: userMessage,
      });
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.data.message.content, timestamp: new Date().toISOString() },
      ]);
    } catch (error: any) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I encountered an error processing your request.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    sessions,
    selectedChatId,
    messages,
    input,
    isLoading,
    isLoadingChats,
    editingTitleId,
    editingTitle,
    messagesEndRef,
    setSelectedChatId,
    setInput,
    setEditingTitleId,
    setEditingTitle,
    handleNewChat,
    handleDeleteChat,
    handleEditTitle,
    handleSubmit,
  };
};

export default useChat;