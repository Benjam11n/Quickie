'use client';

import { Button } from './ui/button';
import { Input } from './ui/input';

const handleSubscribe = (e: React.FormEvent) => {
  e.preventDefault();
  // Handle newsletter subscription
};

const NewsletterForm = () => {
  return (
    <form onSubmit={handleSubscribe} className="flex gap-2">
      <Input
        type="email"
        placeholder="Enter your email"
        className="max-w-[220px]"
      />
      <Button type="submit" variant="premium">
        Subscribe
      </Button>
    </form>
  );
};

export default NewsletterForm;
