import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Github,
  Twitter,
  Linkedin,
  Mail,
  Heart,
  ArrowRight,
  ChevronRight,
  Rss,
  Code,
  PenSquare,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export function Footer() {
  const [subscribed, setSubscribed] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleSubscribe = () => {
    if (email.trim() !== "" && validateEmail(email)) {
      setSubscribed(true);
      setEmail("");
      toast({
        title: "Subscribed!",
        description: "You have successfully subscribed to our newsletter.",
        className: "border-primary",
      });
      setTimeout(() => setSubscribed(false), 3000);
    } else {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address",
        className: "border-primary",
      });
    }
  };

  const quickLinks = [
    { name: "Home", link: "/" },
    { name: "All Blogs", link: "/blogs" },
    { name: "Bookmarks", link: "/bookmarks" },
    { name: "Analytics", link: "/dashboard" },
    { name: "Profile", link: "/profile" },
    { name: "Settings", link: "/settings" },
  ];

  return (
    <footer className="border-t bg-background px-2">
      <div className="container-custom pt-16 pb-8">
        {/* Newsletter section */}
        <Card className="p-8 mb-16 bg-gradient-to-r from-[var(--accent-color)]/10 to-transparent border-[var(--accent-color)]/20 rounded-xl shadow-md">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-muted-foreground mb-4">
                Get the latest articles, tutorials, and updates delivered to
                your inbox.
              </p>
              <div className="flex gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-[var(--accent-color)]/20 bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent-color)] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                <AnimatePresence mode="wait">
                  {subscribed ? (
                    <motion.div
                      key="subscribed"
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.8, opacity: 0 }}
                      className="bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent h-10 px-4 rounded-md flex items-center shrink-0 font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                    >
                      <Check className="h-4 w-4" />
                      Subscribed
                    </motion.div>
                  ) : (
                    <motion.button
                      key="subscribe"
                      onClick={handleSubscribe}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent h-10 px-4 rounded-md flex items-center shrink-0 font-medium cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 transition-colors"
                      disabled={!email.trim()}
                    >
                      Subscribe
                    </motion.button>
                  )}
                </AnimatePresence>
              </div>
            </div>
            <div className="md:text-right">
              <motion.div
                className="inline-block"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Rss className="h-10 w-10 text-[var(--accent-color)] inline-block mb-2" />
              </motion.div>
              <p className="text-sm text-muted-foreground">
                No spam, unsubscribe at any time.
              </p>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          <div className="md:col-span-2">
            <Link to="/" className="flex items-center gap-2 font-bold mb-4">
              <motion.div
                className="rounded-full w-8 h-8 binary-gradient grid place-items-center text-white font-bold"
                whileHover={{ rotate: 10, scale: 1.1 }}
              >
                B
              </motion.div>
              <span className="text-xl">Binary Blogs</span>
            </Link>
            <p className="text-muted-foreground mb-6 max-w-md">
              A vibrant community for developers to share knowledge, discover
              new technologies, and connect with like-minded coders around the
              world.
            </p>

            <div className="flex flex-wrap items-center gap-4 mb-8">
              <motion.a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted/50 hover:bg-[var(--accent-color)]/10 p-2 rounded-full text-muted-foreground hover:text-[var(--accent-color)] transition-colors"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Github className="h-5 w-5" />
                <span className="sr-only">GitHub</span>
              </motion.a>
              <motion.a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted/50 hover:bg-[var(--accent-color)]/10 p-2 rounded-full text-muted-foreground hover:text-[var(--accent-color)] transition-colors"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </motion.a>
              <motion.a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-muted/50 hover:bg-[var(--accent-color)]/10 p-2 rounded-full text-muted-foreground hover:text-[var(--accent-color)] transition-colors"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Linkedin className="h-5 w-5" />
                <span className="sr-only">LinkedIn</span>
              </motion.a>
              <motion.a
                href="mailto:contact@binaryblogs.com"
                className="bg-muted/50 hover:bg-[var(--accent-color)]/10 p-2 rounded-full text-muted-foreground hover:text-[var(--accent-color)] transition-colors"
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Mail className="h-5 w-5" />
                <span className="sr-only">Email</span>
              </motion.a>
            </div>

            <div className="flex items-center">
              <Code className="h-5 w-5 text-[var(--accent-color)] mr-2" />
              <span className="text-sm">
                Made with <Heart className="h-4 w-4 text-red-500 inline mx-1" />{" "}
                by{" "}
                <Link
                  to="https://harshitjoshi.dev"
                  target="_blank"
                  className="text-[var(--accent-color)] hover:underline"
                >
                  Harshit Joshi
                </Link>{" "}
                for developers
              </span>
            </div>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-lg">Quick Links</h3>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <motion.li key={link.name} whileHover={{ x: 5 }}>
                  <Link
                    to={link.link}
                    className="text-muted-foreground hover:text-[var(--accent-color)] flex items-center"
                  >
                    <ChevronRight className="h-4 w-4 mr-1 text-[var(--accent-color)]/70" />
                    {link.name}
                  </Link>
                </motion.li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-bold mb-4 text-lg">Write For Us</h3>
            <p className="text-muted-foreground text-sm mb-3">
              Share your expertise with our community
            </p>
            <motion.div whileHover={{ x: 5 }}>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 border-[var(--accent-color)]/20 hover:bg-[var(--accent-color)]/10 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]"
                asChild
              >
                <Link to="/new-blog">
                  <PenSquare className="h-4 w-4 mr-1" />
                  Start Writing
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </div>

      <div className="py-8 px-4 border-t flex flex-col md:flex-row justify-between items-center gap-4 text-muted-foreground text-sm">
        <p>© {new Date().getFullYear()} Binary Blogs. All rights reserved.</p>
        <div className="flex gap-6">
          <Link to="/privacy" className="hover:text-[var(--accent-color)]">
            Privacy Policy
          </Link>
          <Link to="/terms" className="hover:text-[var(--accent-color)]">
            Terms of Service
          </Link>
          <Link to="/contact" className="hover:text-[var(--accent-color)]">
            Contact Us
          </Link>
        </div>
      </div>
    </footer>
  );
}
