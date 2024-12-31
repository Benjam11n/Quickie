// <a target="_blank" href="https://icons8.com/icon/118467/facebook">Facebook</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
// <a target="_blank" href="https://icons8.com/icon/lUktdBVdL4Kb/telegram">Telegram</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a>
import { Copy, Share2 } from 'lucide-react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { toast } from 'sonner';

import { Button } from '../ui/button';
import {
  DialogHeader,
  DialogTitle,
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from '../ui/dialog';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

const openShareWindow = (url: string) => {
  const newWindow = window.open(url, '_blank');
  if (!newWindow) {
    alert('Please allow popups for this website to share content.');
  }
};

// TODO: complete instagram sharing
const shareToSocial = {
  twitter: (url: string, text: string) => {
    const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    openShareWindow(shareUrl);
  },
  telegram: (url: string, text: string) => {
    const shareUrl = `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`;
    openShareWindow(shareUrl);
  },
  facebook: (url: string) => {
    const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    openShareWindow(shareUrl);
  },
  linkedin: (url: string) => {
    const shareUrl = `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(url)}`;
    openShareWindow(shareUrl);
  },
  // instagram: async (url: string) => {
  //   try {
  //     await navigator.clipboard.writeText(url);
  //     console.log('Link copied! Open Instagram to share.');
  //   } catch (err) {
  //     console.error('Failed to copy:', err);
  //     alert('Could not copy the link. Please try again.');
  //   }
  // },
};

interface ShareDialogProps {
  text: string;
}

export function ShareDialog({ text }: ShareDialogProps) {
  const pathname = usePathname();
  const url = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}${pathname}`;
  const shareText = 'Check out this perfume comparison!';

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Successfully copied to clipboard.');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="fixed bottom-16 right-16 z-50">
          <Button size="lg" variant="premium" className=" gap-2 shadow-lg">
            <Share2 className="size-4" />
            {text}
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="xs: max-w-sm backdrop-blur sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Share your comparison</DialogTitle>
          <div className="space-x-4 py-6 pr-4">
            <Button
              className="size-16 rounded-full shadow-md"
              variant="outline"
              onClick={() =>
                shareToSocial.telegram(
                  url,
                  'Check out this comparison of these two perfumes!'
                )
              }
            >
              <Image
                src="/icons/telegram.svg"
                alt="telegram"
                width={32}
                height={32}
                className="dark:invert"
              />
            </Button>
            {/* <Button
              className="size-16 rounded-full shadow-md"
              variant="outline"
              onClick={() => shareToSocial.instagram(url)}
            >
              <Image
                src="/icons/instagram.svg"
                alt="instagram"
                width={32}
                height={32}
                className="invert-colors"
              />
            </Button> */}
            <Button
              className="size-16 rounded-full shadow-md"
              variant="outline"
              onClick={() => shareToSocial.facebook(url)}
            >
              <Image
                src="/icons/facebook.svg"
                alt="facebook"
                width={32}
                height={32}
                className="dark:invert"
              />
            </Button>
            <Button
              className="size-16 rounded-full shadow-md"
              variant="outline"
              onClick={() => shareToSocial.twitter(url, shareText)}
            >
              <Image
                src="/icons/twitter.svg"
                alt="twitter"
                width={32}
                height={32}
                className="invert-colors"
              />
            </Button>
            <Button
              className="size-16 rounded-full shadow-md"
              variant="outline"
              onClick={() => shareToSocial.linkedin(url)}
            >
              <Image
                src="/icons/linkedin.svg"
                alt="linkedin"
                width={32}
                height={32}
                className="dark:invert"
              />
            </Button>
          </div>
          <DialogDescription>
            Anyone who has this link will be able to view this.
          </DialogDescription>
        </DialogHeader>
        <div className="flex items-center space-x-2">
          <div className="grid flex-1 gap-2">
            <Label htmlFor="link" className="sr-only">
              Link
            </Label>
            <Input id="link" defaultValue={url} readOnly />
          </div>
          <Button
            type="submit"
            size="sm"
            className="px-3"
            onClick={copyToClipboard}
          >
            <span className="sr-only">Copy</span>
            <Copy />
          </Button>
        </div>
        <DialogFooter className="sm:justify-start">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
