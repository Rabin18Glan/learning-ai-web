// // scripts/evaluate.ts
// import { performance } from "perf_hooks";
// import { cosineSimilarity } from "simple-statistics";
// import rouge from "rouge";
// import { bleu } from "n-gram-bleu";

// // Example test dataset
// const dataset = [
//   {
//     query: "What is the capital of France?",
//     groundTruthDocs: ["Paris is the capital of France."],
//     retrievedDocs: [
//       "Paris is the capital of France.",
//       "France is in Europe.",
//       "Berlin is the capital of Germany."
//     ],
//     referenceAnswer: "The capital of France is Paris.",
//     generatedAnswer: "Paris is the capital city of France."
//   },
//   {
//     query: "Who developed the theory of relativity?",
//     groundTruthDocs: ["Albert Einstein developed the theory of relativity."],
//     retrievedDocs: [
//       "Isaac Newton formulated laws of motion.",
//       "Albert Einstein developed the theory of relativity."
//     ],
//     referenceAnswer: "The theory of relativity was developed by Albert Einstein.",
//     generatedAnswer: "It was Albert Einstein who created the theory of relativity."
//   }
// ];

// // --- Retrieval Metrics ---
// function precisionAtK(retrieved: string[], relevant: string[], k: number) {
//   const topK = retrieved.slice(0, k);
//   const hits = topK.filter(d => relevant.includes(d));
//   return hits.length / k;
// }

// function recallAtK(retrieved: string[], relevant: string[], k: number) {
//   const topK = retrieved.slice(0, k);
//   const hits = topK.filter(d => relevant.includes(d));
//   return hits.length / relevant.length;
// }

// function meanReciprocalRank(data: typeof dataset) {
//   let sum = 0;
//   for (const q of data) {
//     const rank = q.retrievedDocs.findIndex(d => q.groundTruthDocs.includes(d));
//     if (rank >= 0) sum += 1 / (rank + 1);
//   }
//   return sum / data.length;
// }

// // --- Confusion Metrics ---
// function confusionMetrics(tp: number, fp: number, fn: number, tn: number) {
//   const accuracy = (tp + tn) / (tp + fp + fn + tn);
//   const precision = tp / (tp + fp);
//   const recall = tp / (tp + fn);
//   const f1 = (2 * precision * recall) / (precision + recall);
//   return { accuracy, precision, recall, f1 };
// }

// // --- Generation Metrics ---
// async function generationMetrics(candidate: string, reference: string) {
//   const bleuScore = bleu([candidate.split(" ")], [reference.split(" ")]);
//   const rougeScore = await rouge([candidate], [reference]);
//   return { bleu: bleuScore, rouge: rougeScore };
// }

// // --- Main Evaluation ---
// async function runEvaluation() {
//   let precision5 = 0, recall5 = 0;
//   for (const d of dataset) {
//     precision5 += precisionAtK(d.retrievedDocs, d.groundTruthDocs, 5);
//     recall5 += recallAtK(d.retrievedDocs, d.groundTruthDocs, 5);
//     const gen = await generationMetrics(d.generatedAnswer, d.referenceAnswer);
//     console.log("\nQuery:", d.query);
//     console.log("BLEU:", gen.bleu.toFixed(3));
//     console.log("ROUGE:", gen.rouge);
//   }

//   console.log("\n=== Retrieval Metrics ===");
//   console.log("Precision@5:", (precision5 / dataset.length).toFixed(3));
//   console.log("Recall@5:", (recall5 / dataset.length).toFixed(3));
//   console.log("MRR:", meanReciprocalRank(dataset).toFixed(3));

//   console.log("\n=== Confusion Matrix Metrics (example numbers) ===");
//   const cm = confusionMetrics(95, 5, 4, 96);
//   console.log(cm);
// }

// runEvaluation();
