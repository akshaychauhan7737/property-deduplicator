
"use client";

import React, { useState } from 'react';
import Link from 'next/link'; // Import Link for navigation
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Trash2, Copy, ArrowLeft } from 'lucide-react'; // Add ArrowLeft icon
import { useToast } from "@/hooks/use-toast";
import { LineNumberedTextarea } from '@/components/line-numbered-textarea'; // Import the new component

interface Property {
  key: string;
  value: string;
}

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [formattedOutput, setFormattedOutput] = useState<string>('');
  const [invalidLineNumbers, setInvalidLineNumbers] = useState<number[]>([]); // State for invalid lines
  const { toast } = useToast();

  const handleParse = () => {
    const lines = inputText.split('\n'); // Don't filter empty lines yet, need original indices
    const propsMap = new Map<string, string>();
    const invalidLines: number[] = [];

    lines.forEach((line, index) => {
      const lineNumber = index + 1;
      const trimmedLine = line.trim();

      if (trimmedLine === '') {
        // Ignore empty lines, they are not invalid in the sense of format
        return;
      }

      // Find the first '=' separator
      const separatorIndex = line.indexOf('=');
      if (separatorIndex !== -1) {
        const key = line.substring(0, separatorIndex).trim();
        const value = line.substring(separatorIndex + 1).trim(); // Allow empty value
        if (key) { // Ensure key is not empty
          propsMap.set(key, value);
        } else {
          // Invalid: '=' present but key is empty
          invalidLines.push(lineNumber);
        }
      } else {
         // Invalid: No '=' separator found and line is not empty
         invalidLines.push(lineNumber);
      }
    });

    setInvalidLineNumbers(invalidLines);

    const parsedProps = Array.from(propsMap, ([key, value]) => ({ key, value }));
    setProperties(parsedProps); // Store parsed key-value pairs

    // Create formatted output string from valid properties
    const outputString = parsedProps.map(prop => `${prop.key}=${prop.value}`).join('\n');
    setFormattedOutput(outputString); // Set the state for the output section

    if (invalidLines.length > 0) {
         toast({
            title: "Warning",
            description: `Found ${invalidLines.length} line(s) with invalid format (highlighted in red). Only valid lines processed.`,
            variant: "destructive", // Use destructive variant for warnings/errors
         });
    } else if (parsedProps.length > 0) {
        toast({
            title: "Success",
            description: `Parsed ${parsedProps.length} unique properties.`,
        });
    } else if (lines.some(line => line.trim() !== '')) { // Check if there was non-empty input
        toast({
            title: "Info",
            description: "No valid key-value pairs found.",
            variant: "default",
        });
    } else {
         toast({
            title: "Info",
            description: "Input area is empty.",
            variant: "default",
        });
    }
  };

  const handleClear = () => {
    setInputText('');
    setProperties([]);
    setFormattedOutput(''); // Clear formatted output
    setInvalidLineNumbers([]); // Clear invalid lines
    toast({
        title: "Cleared",
        description: "Input and output cleared.",
    });
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied",
          description: `Output copied to clipboard.`,
        });
      })
      .catch(err => {
        console.error('Failed to copy text: ', err);
        toast({
          title: "Error",
          description: "Failed to copy to clipboard.",
          variant: "destructive",
        });
      });
  };

   const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputText(event.target.value);
    // Optionally clear highlights when user types, or keep them until next parse
    if (invalidLineNumbers.length > 0) {
      setInvalidLineNumbers([]); // Clear highlights on input change
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12 lg:p-24 bg-background">
      {/* Back Button */}
      <div className="w-full max-w-3xl mb-4">
         <Button asChild variant="outline" size="sm">
            <Link href="https://devtoolsforfree.com/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to DevToolsForFree
            </Link>
          </Button>
      </div>

      <Card className="w-full max-w-3xl bg-card shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Property Deduplicator</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Paste key-value pairs (key=value). Invalid lines highlighted. Duplicates use last value.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
           {/* Pass invalidLineNumbers to LineNumberedTextarea */}
          <LineNumberedTextarea
            placeholder="e.g., name=John Doe&#10;age=30&#10;invalid-line&#10;city=New York&#10;name=Jane Doe&#10;status=&#10;=emptykey"
            value={inputText}
            onChange={handleInputChange} // Use the new handler
            className="min-h-[150px] text-sm resize-y bg-secondary/50 font-mono"
            textareaClassName="bg-secondary/50 font-mono"
            invalidLines={invalidLineNumbers} // Pass the invalid line numbers
          />
          <div className="flex justify-end space-x-2">
             <Button onClick={handleClear} variant="outline">
              <Trash2 className="mr-2" /> Clear
            </Button>
            <Button onClick={handleParse}>
              <Play className="mr-2" /> Parse Properties
            </Button>
          </div>
        </CardContent>
        {/* Keep output section as before */}
        {formattedOutput && (
          <CardFooter className="flex flex-col items-start">
             <div className="w-full flex justify-between items-center mb-2">
                 <h3 className="text-lg font-semibold text-foreground">Parsed Properties:</h3>
                 <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(formattedOutput)}
                    aria-label="Copy output"
                  >
                     <Copy className="mr-2 h-4 w-4" /> Copy Output
                  </Button>
             </div>
            <div className="w-full border rounded-md overflow-hidden bg-secondary/30 p-4">
                <pre className="text-sm font-mono whitespace-pre-wrap break-words text-foreground">
                  {formattedOutput}
                </pre>
            </div>
          </CardFooter>
        )}
      </Card>
    </main>
  );
}
