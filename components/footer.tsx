import {
  MapPin,
  Mail,
  Instagram,
  Twitter,
  Facebook,
  Heart,
} from 'lucide-react';
import Link from 'next/link';

import { auth } from '@/auth';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/constants/routes';

import NewsletterForm from './NewsletterForm';

export default async function Footer() {
  const session = await auth();
  const user = session?.user;

  return (
    <footer className="border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Heart className="size-6 text-primary" />
              <span className="text-xl font-bold">Quickie</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Experience fragrance discovery reimagined through our innovative
              vending machines and digital platform.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href={ROUTES.CATALOG}
                  prefetch
                  className="transition-colors hover:text-primary"
                >
                  Browse Fragrances
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.LOCATIONS}
                  prefetch
                  className="transition-colors hover:text-primary"
                >
                  Find Machines
                </Link>
              </li>
              <li>
                <Link
                  href={ROUTES.COMPARE}
                  className="transition-colors hover:text-primary"
                >
                  Compare Scents
                </Link>
              </li>
              {user?.id && (
                <li>
                  <Link
                    href={ROUTES.USER_PROFILE}
                    prefetch
                    className="transition-colors hover:text-primary"
                  >
                    My Collection
                  </Link>
                </li>
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="font-semibold">Contact</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <MapPin className="size-4" />
                Singapore, SG
              </li>
              <li className="flex items-center gap-2">
                <Mail className="size-4" />
                hello@quickie.com
              </li>
            </ul>
            <div className="flex gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary"
              >
                <Instagram className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary"
              >
                <Twitter className="size-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="hover:text-primary"
              >
                <Facebook className="size-4" />
              </Button>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold">Stay Updated</h3>
            <p className="text-sm text-muted-foreground">
              Subscribe to our newsletter for the latest fragrances and
              locations.
            </p>
            <NewsletterForm />
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 flex justify-between border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Quickie. All rights reserved.</p>
          <div className="flex justify-center gap-4">
            <Link
              href={ROUTES.PRIVACY}
              className="transition-colors hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href={ROUTES.TERMS}
              className="transition-colors hover:text-primary"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
