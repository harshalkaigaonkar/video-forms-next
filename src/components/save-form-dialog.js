import { Button } from "./ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./ui/dialog";
import { Input } from "./ui/input";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

const SaveFormDialog = ({ dialogOpen, setDialogOpen, onSave }) => {
  const [formName, setFormName] = useState("");
  const { toast } = useToast();

  const handleSave = () => {
    if (!formName.trim) {
      toast({
        description: "Please enter a name for the form",
      });
      return;
    }
    onSave?.(formName);
    setDialogOpen(false);
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create form</DialogTitle>
          <DialogDescription>
            Add a name to the form and create it for sharing
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button onClick={handleSave} type="submit">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveFormDialog;
