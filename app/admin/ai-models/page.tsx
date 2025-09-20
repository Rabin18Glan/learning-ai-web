
"use client"
import {
    CheckCircle,
    Cpu,
    Database
} from 'lucide-react';
import React, { useState } from 'react';

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/table';



interface LLMModel {
    id: string;
    name: string;
    provider: string;
    cost: string;
    speed: string;
    quality: string;
}

interface EmbeddingModel {
    id: string;
    name: string;
    provider: string;
    dimensions: number;
    cost: string;
}

const llmModels: LLMModel[] = [
    { 
        id: 'gemini-flash', 
        name: 'Gemini Flash', 
        provider: 'Google', 
        cost: 'Free tier available', // More accurate
        speed: 'Very Fast', 
        quality: 'Good' 
    },
];

const embeddingModels: EmbeddingModel[] = [
    { 
        id: 'mistral-embedd', 
        name: 'Mistral Embed', 
        provider: 'Mistral AI', 
        dimensions: 1024, 
        cost: '$0.01/1M tokens' 
    },
];
export const AIModels: React.FC = () => {
    const [selectedLLM, setSelectedLLM] = useState<string>('gpt-4');
    const [selectedEmbedding, setSelectedEmbedding] = useState<string>('text-embedding-ada-002');

 

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-xl sm:text-2xl font-bold text-foreground">AI Models Configuration</h2>
                <p className="text-sm text-muted-foreground">Configure LLM and embedding models for your RAG agent</p>
            </div>

            {/* LLM Models */}
            <div className="bg-card rounded-lg border border-border">
                <div className="px-4 sm:px-6 py-4 border-b border-border">
                    <h3 className="text-base sm:text-lg font-semibold text-card-foreground flex items-center">
                        <Cpu className="w-5 h-5 mr-2" />
                        Large Language Models (LLM)
                    </h3>
                </div>
                <div className="p-4 sm:p-6 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px] sm:w-auto">Model</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead className="hidden sm:table-cell">Speed</TableHead>
                                <TableHead className="hidden sm:table-cell">Quality</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {llmModels.map((model) => (
                                <TableRow key={model.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="radio"
                                                name="llm"
                                                value={model.id}
                                                checked={selectedLLM === model.id}
                                                onChange={(e) => setSelectedLLM(e.target.value)}
                                                className="w-4 h-4 text-primary focus:ring-primary border-border"
                                            />
                                            <div className="min-w-0">
                                                <div className="font-medium text-foreground text-sm truncate">{model.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">{model.id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{model.provider}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-mono">{model.cost}</span>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${model.speed === 'Fast' ? 'bg-green-100 text-green-800' :
                                            model.speed === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-red-100 text-red-800'
                                            }`}>
                                            {model.speed}
                                        </span>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-md ${model.quality === 'Excellent' ? 'bg-purple-100 text-purple-800' :
                                            model.quality === 'Very Good' ? 'bg-blue-100 text-blue-800' :
                                                'bg-gray-100 text-gray-800'
                                            }`}>
                                            {model.quality}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {selectedLLM === model.id ? (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Inactive</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* Embedding Models */}
            <div className="bg-card rounded-lg border border-border">
                <div className="px-4 sm:px-6 py-4 border-b border-border">
                    <h3 className="text-base sm:text-lg font-semibold text-card-foreground flex items-center">
                        <Database className="w-5 h-5 mr-2" />
                        Embedding Models
                    </h3>
                </div>
                <div className="p-4 sm:p-6 overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[200px] sm:w-auto">Model</TableHead>
                                <TableHead>Provider</TableHead>
                                <TableHead className="hidden sm:table-cell">Dimensions</TableHead>
                                <TableHead>Cost</TableHead>
                                <TableHead>Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {embeddingModels.map((model) => (
                                <TableRow key={model.id}>
                                    <TableCell>
                                        <div className="flex items-center space-x-3">
                                            <input
                                                type="radio"
                                                name="embedding"
                                                value={model.id}
                                                checked={selectedEmbedding === model.id}
                                                onChange={(e) => setSelectedEmbedding(e.target.value)}
                                                className="w-4 h-4 text-primary focus:ring-primary border-border"
                                            />
                                            <div className="min-w-0">
                                                <div className="font-medium text-foreground text-sm truncate">{model.name}</div>
                                                <div className="text-xs text-muted-foreground truncate">{model.id}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm">{model.provider}</span>
                                    </TableCell>
                                    <TableCell className="hidden sm:table-cell">
                                        <span className="text-sm font-mono">{model.dimensions}</span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-sm font-mono">{model.cost}</span>
                                    </TableCell>
                                    <TableCell>
                                        {selectedEmbedding === model.id ? (
                                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" />
                                                Active
                                            </span>
                                        ) : (
                                            <span className="text-xs text-muted-foreground">Inactive</span>
                                        )}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
};