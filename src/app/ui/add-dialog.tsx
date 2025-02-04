import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function AddDialog() {
  return (
    <Dialog>
      <DialogTrigger>
        <Button>Add Show</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Search TV Shows</DialogTitle>
          <DialogDescription>
            Lorem Ipsum
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-2 py-2">
            <Label htmlFor="name">
              Name
            </Label>
            <Input id="name" className="" />
        </div>
      </DialogContent>
    </Dialog>
  );
}
