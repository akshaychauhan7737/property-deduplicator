"use client";

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Play, Trash2, Copy } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

interface Property {
  key: string;
  value: string;
}

export default function Home() {
  const [inputText, setInputText] = useState<string>('');
  const [properties, setProperties] = useState<Property[]>([]);
  const { toast } = useToast();

  const handleParse = () => {
    const lines = inputText.split('\n').filter(line => line.trim() !== '');
    const propsMap = new Map<string, string>();

    lines.forEach(line => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex !== -1) {
        const key = line.substring(0, separatorIndex).trim();
        const value = line.substring(separatorIndex + 1).trim();
        if (key) { // Ensure key is not empty
          propsMap.set(key, value);
        }
      }
    });

    const parsedProps = Array.from(propsMap, ([key, value]) => ({ key, value }));
    setProperties(parsedProps);

    if (parsedProps.length > 0) {
        toast({
            title: "Success",
            description: `Parsed ${parsedProps.length} properties.`,
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
    toast({
        title: "Cleared",
        description: "Input and output cleared.",
    });
  };

  const handleCopyToClipboard = (text: string, type: 'key' | 'value') => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied",
          description: `${type.charAt(0).toUpperCase() + type.slice(1)} "${text.length > 20 ? text.substring(0, 17) + '...' : text}" copied to clipboard.`,
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
            Paste your key-value pairs (separated by '='). Duplicates will use the last value found.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="e.g., name=John Doe&#10;age=30&#10;city=New York&#10;name=Jane Doe"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="min-h-[150px] text-sm resize-y bg-secondary/50"
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
             <h3 className="text-lg font-semibold mb-2 text-foreground">Parsed Properties:</h3>
            <div className="w-full border rounded-md overflow-hidden">
               <Table>
                <TableHeader>
                  <TableRow className="bg-muted hover:bg-muted/80">
                    <TableHead className="w-[40%] font-medium">Key</TableHead>
                    <TableHead className="w-[60%] font-medium">Value</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {properties.map((prop, index) => (
                    <TableRow key={index} className="hover:bg-secondary/30">
                      <TableCell className="font-mono text-sm relative group">
                         {prop.key}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleCopyToClipboard(prop.key, 'key')}
                            aria-label={`Copy key ${prop.key}`}
                          >
                            <Copy className="h-3 w-3 text-muted-foreground" />
                          </Button>
                      </TableCell>
                      <TableCell className="font-mono text-sm relative group">
                         {prop.value}
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => handleCopyToClipboard(prop.value, 'value')}
                            aria-label={`Copy value ${prop.value}`}
                          >
                             <Copy className="h-3 w-3 text-muted-foreground" />
                          </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardFooter>
        )}
      </Card>
    </main>
  );
}
