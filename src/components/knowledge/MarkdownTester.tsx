import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { DocumentPreview } from "./DocumentPreview";
import exampleMarkdown from "./MarkdownExample.md?raw";

export function MarkdownTester() {
  const [content, setContent] = useState("");

  useEffect(() => {
    // Ładujemy przykładowy Markdown z nowego pliku
    try {
      setContent(exampleMarkdown);
    } catch (error) {
      // Fallback jeśli z jakiegoś powodu nie uda się załadować pliku
      setContent(`# Przykładowy dokument Markdown

To jest przykładowa treść Markdown.

## Funkcje

- **Pogrubienie** i *kursywa*
- Listy i tabele
- \`Kod inline\` i bloki kodu
- I wiele więcej!`);
    }
  }, []);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold mb-4">Tester formatowania Markdown</h1>

      <Tabs defaultValue="edit">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="edit">Edycja</TabsTrigger>
          <TabsTrigger value="preview">Podgląd</TabsTrigger>
        </TabsList>

        <TabsContent value="edit">
          <div className="bg-[#2b2d31] border border-[#3f4147] rounded-md shadow-lg h-full overflow-hidden">
            <div className="border-b border-[#3f4147] px-4 py-2 bg-[#232428] flex items-center justify-between">
              <span className="text-sm text-white font-medium">Markdown Editor</span>
              <Button size="sm" variant="outline" onClick={() => setContent(exampleMarkdown)} className="text-xs">
                Resetuj do przykładu
              </Button>
            </div>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[600px] w-full resize-none border-0 bg-[#2b2d31] font-mono p-5 rounded-b-md focus:border-0 focus:ring-0 text-white"
            />
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <div className="bg-[#2b2d31] border border-[#3f4147] rounded-md p-6 shadow-lg min-h-[600px]">
            <DocumentPreview content={content} fileType="md" />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
