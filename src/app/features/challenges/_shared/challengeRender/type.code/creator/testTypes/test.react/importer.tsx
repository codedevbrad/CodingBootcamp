import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";

type TestCaseTemplate = {
  label: string;
  value: string;
  json: any;
};

export default function TestCaseImporter({
  onImport,
  templates = [],
}: {
  onImport: (data: any) => void;
  templates?: TestCaseTemplate[];
}) {
  const [open, setOpen] = useState(false);
  const [rawJSON, setRawJSON] = useState("");
  const [parseError, setParseError] = useState<string | null>(null);

  const handleTemplateSelect = (value: string) => {
    const found = templates.find(t => t.value === value);
    if (found) {
      setRawJSON(JSON.stringify(found.json, null, 2));
    }
  };

  const handleConfirm = () => {
    try {
      const parsed = JSON.parse(rawJSON);
      if (typeof parsed !== "object" || !Array.isArray(parsed.tests)) {
        throw new Error("Missing tests array");
      }
      onImport(parsed);
      setOpen(false);
      setRawJSON("");
      setParseError(null);
    } catch (e: any) {
      setParseError(e.message);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline"> Import a TestCase </Button>
      </DialogTrigger>
      <DialogContent className="w-2/3 max-w-none">
        <DialogHeader>
          <DialogTitle>Import testCases JSON</DialogTitle>
          <DialogDescription>
            Paste your testCases object (JSON) or use a template below.
          </DialogDescription>
        </DialogHeader>

        {templates.length > 0 && (
          <Select onValueChange={handleTemplateSelect}>
            <SelectTrigger className="w-[300px]">
              <SelectValue placeholder="Choose a template" />
            </SelectTrigger>
            <SelectContent>
              {templates.map(t => (
                <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <textarea
          className="h-[600px] p-2 border w-full mt-4"
          value={rawJSON}
          onChange={(e) => setRawJSON(e.target.value)}
          placeholder='{"tests": [...]}'
        />
        {parseError && <div className="text-red-500 mt-2">{parseError}</div>}
        <DialogFooter className="flex gap-2">
          <Button size="sm" onClick={handleConfirm}>Confirm</Button>
          <Button size="sm" variant="ghost" onClick={() => {
            setOpen(false);
            setRawJSON("");
            setParseError(null);
          }}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
