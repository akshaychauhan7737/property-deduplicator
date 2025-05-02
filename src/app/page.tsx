
"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Trash2, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Property {
  key: string;
  value: string;
}

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const [formattedOutput, setFormattedOutput] = useState<string>(''); // State for formatted output string
  const { toast } = useToast();

  const handleParse = () => {
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    const propsMap = new Map<string, string>();

    lines.forEach(line => {
      // Find the first '=' separator
      const separatorIndex = line.indexOf('=');
      if (separatorIndex !== -1) {
        const key = line.substring(0, separatorIndex).trim();
        // Allow empty value, but key must exist
        const value = line.substring(separatorIndex + 1).trim();
        if (key) { // Ensure key is not empty
          propsMap.set(key, value);
        }
      }
    });

    const parsedProps = Array.from(propsMap, ([key, value]) => ({ key, value }));
    setProperties(parsedProps); // Store parsed key-value pairs

    // Create formatted output string
    const outputString = parsedProps.map(prop => `${prop.key}=${prop.value}`).join('\n');
    setFormattedOutput(outputString);

    if (parsedProps.length > 0) {
        toast({
            title: "Success",
            description: `Parsed ${parsedProps.length} unique properties.`,
        });
    } else if (lines.length > 0) {
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-6 md:p-12 lg:p-24 bg-background">
      <Card className="w-full max-w-3xl bg-card shadow-lg rounded-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Property Parser</CardTitle>
          <CardDescription className="text-center text-muted-foreground">
            Paste your key-value pairs (separated by '='). Duplicates will use the last value found. Empty values are allowed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., name=John Doe&#10;age=30&#10;city=New York&#10;name=Jane Doe&#10;status="
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] text-sm resize-y bg-secondary/50 font-mono" // Added font-mono for consistency
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
        {properties.length > 0 && (
          <CardFooter className="flex flex-col items-start">
             <div className="w-full flex justify-between items-center mb-2">
                 <h3 className="text-lg font-semibold text-foreground">Parsed Properties:</h3>
                 <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyToClipboard(formattedOutput)}
                    aria-label="Copy output"
                    disabled={!formattedOutput}
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
