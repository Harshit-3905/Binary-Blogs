import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { AnimatedSection } from "@/components/AnimatedSection";
import {
  ArrowRight,
  Code,
  Terminal,
  GitBranch,
  Globe,
  BookOpen,
  Users,
  Database,
  Server,
  Shield,
  Search,
} from "lucide-react";
import { useAuthStore } from "@/store/useAuthStore";
import { blogService } from "@/services";
import type { BlogSummary } from "@/types/blogTypes";
import { BlogCard } from "@/components/BlogCard";
import { AnimatedCodeBlock } from "@/components/AnimatedCodeBlock";
import { TrendingTopicsSection } from "@/components/home/TrendingTopicsSection";
import { glassMorphismClass } from "@/utils/tailwindClasses";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const { isLoggedIn } = useAuthStore();
  const [featuredBlogs, setFeaturedBlogs] = useState<BlogSummary[]>([]);
  const heroRef = useRef<HTMLDivElement>(null);
  const subscribeRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const [animateStats, setAnimateStats] = useState(false);
  const navigate = useNavigate();

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  useEffect(() => {
    let cancelled = false;
    blogService
      .list({ limit: 3, sort: "popular" })
      .then((res) => {
        if (!cancelled) setFeaturedBlogs(res.items);
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (statsRef.current) {
        const rect = statsRef.current.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;

        if (isVisible && !animateStats) {
          setAnimateStats(true);
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    // Initial check in case section is already visible
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [animateStats]);


  // Custom features with icons
  const features = [
    {
      icon: <Code className="h-6 w-6 text-white" />,
      title: "Rich Code Snippets",
      description:
        "Share and highlight code with syntax highlighting for over 50 languages.",
    },
    {
      icon: <Terminal className="h-6 w-6 text-white" />,
      title: "Developer Focused",
      description:
        "Content tailored for programmers, from beginners to seasoned experts.",
    },
    {
      icon: <GitBranch className="h-6 w-6 text-white" />,
      title: "Version Control Tips",
      description:
        "Learn advanced Git techniques and workflows to improve your productivity.",
    },
    {
      icon: <Globe className="h-6 w-6 text-white" />,
      title: "Web Technologies",
      description: "Stay updated with the latest frameworks and libraries.",
    },
    {
      icon: <BookOpen className="h-6 w-6 text-white" />,
      title: "Comprehensive Guides",
      description:
        "In-depth tutorials that take you from concept to deployment.",
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      title: "Community Driven",
      description:
        "Learn from experienced developers sharing real-world knowledge.",
    },
  ];

  const scrollToSubscribe = () => {
    if (subscribeRef.current) {
      const componentTop = subscribeRef.current.offsetTop;
      const componentHeight = subscribeRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      // Calculate position to center the component in viewport
      const scrollToPosition = componentTop + componentHeight / 2;

      window.scrollTo({
        top: scrollToPosition,
        behavior: "smooth",
      });
    }
  };

  // Component for animated number
  const AnimatedNumber = ({ value, duration = 2000 }) => {
    const [count, setCount] = useState(0);
    const countRef = useRef(null);

    useEffect(() => {
      if (!animateStats) return;

      // Extract the numeric part from strings like "15,000+"
      const targetNumber = parseInt(value.replace(/,/g, "").replace(/\+/g, ""));

      let startTime;
      let animationFrameId;

      const updateCount = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);

        const currentCount = Math.floor(progress * targetNumber);
        setCount(currentCount);

        if (progress < 1) {
          animationFrameId = requestAnimationFrame(updateCount);
        } else {
          setCount(targetNumber);
        }
      };

      animationFrameId = requestAnimationFrame(updateCount);

      return () => {
        if (animationFrameId) {
          cancelAnimationFrame(animationFrameId);
        }
      };
    }, [animateStats, value, duration]);

    const formatted = count.toLocaleString();
    return (
      <span>
        {formatted}
        {value.includes("+") ? "+" : ""}
      </span>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section - Enhanced with better background */}
      <motion.section
        ref={heroRef}
        className="relative min-h-[90vh] flex items-center overflow-hidden
                  bg-background text-foreground"
        style={{ opacity, scale }}
      >
        {/* Enhanced Background with multiple layers */}
        <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent-color)]/5 via-[var(--accent-color-bright)]/10 to-[var(--accent-color)]/15"></div>

        {/* Animated texture overlay */}
        <div className="absolute inset-0 bg-[url('/patterns/topography.svg')] bg-repeat opacity-20"></div>

        {/* Gradient overlay with higher contrast */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-background/60 to-background/90 z-10"></div>

        {/* Animated background elements - Fixed positioning with enhanced visibility */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Enhanced subtle pattern background */}
          <div className="absolute inset-0 bg-[url('/patterns/circuit-board.svg')] bg-repeat opacity-20"></div>

          {/* Animated orbs with enhanced colors */}
          <motion.div
            className="absolute h-72 w-72 rounded-full bg-[var(--accent-color)]/30 filter blur-3xl"
            style={{ top: "15%", left: "10%" }}
            animate={{
              y: [0, 40, 0],
              x: [0, 20, 0],
              opacity: [0.6, 0.8, 0.6],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute h-80 w-80 rounded-full bg-[var(--accent-color-bright)]/30 filter blur-3xl"
            style={{ top: "35%", right: "15%" }}
            animate={{
              y: [0, -50, 0],
              x: [0, -30, 0],
              opacity: [0.4, 0.7, 0.4],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
          <motion.div
            className="absolute h-96 w-96 rounded-full bg-[var(--accent-color-text)]/20 filter blur-3xl"
            style={{ bottom: "20%", left: "30%" }}
            animate={{
              y: [0, 30, 0],
              x: [0, -20, 0],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-20 grid grid-cols-1 md:grid-cols-2 gap-8 items-center min-h-[70vh]">
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
            >
              <span
                className="px-4 py-1.5 bg-[var(--accent-color)]/20 text-[var(--accent-color-text)] 
                                rounded-full text-sm font-medium backdrop-blur-sm mb-4 inline-block
                                border border-[var(--accent-color)]/20 shadow-lg shadow-[var(--accent-color)]/10"
              >
                For Developers, By Developers
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight text-foreground drop-shadow-sm">
              Where
              <span
                className="font-code bg-clip-text text-transparent bg-gradient-to-r 
                              from-[var(--accent-color)] to-[var(--accent-color-bright)] px-2"
              >
                &lt;Code&gt;
              </span>
              Meets{" "}
              <span
                className="font-code bg-clip-text text-transparent bg-gradient-to-r 
                              from-[var(--accent-color-bright)] to-[var(--accent-color)]"
              >
                Community
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl">
              A space for developers to share insights, discover solutions, and
              connect with a community that speaks your language.
            </p>

            <div className="flex flex-wrap gap-4 pt-6">
              {!isLoggedIn ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="gap-2 bg-[var(--accent-color)] hover:bg-background 
                                text-white hover:text-[var(--accent-color)] font-medium min-w-[160px] 
                                shadow-lg hover:shadow-xl transition-all border-2 border-transparent 
                                hover:border-[var(--accent-color)]"
                    >
                      <Link to="/signup">
                        Get Started
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-4">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      className="gap-2 font-medium min-w-[160px] 
                                shadow-lg hover:shadow-xl transition-all bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
                    >
                      <Link to="/blogs">
                        Explore Blogs
                        <ArrowRight className="h-4 w-4 ml-2" />
                      </Link>
                    </Button>
                  </motion.div>
                </div>
              )}
            </div>
          </motion.div>

          {/* Right side content with improved animation */}
          <motion.div
            className="relative hidden md:flex justify-center items-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
          >
            {/* Enhanced glow effect */}
            <div
              className="absolute inset-0 bg-gradient-to-r from-[var(--accent-color)]/20 
                          to-[var(--accent-color-bright)]/30 rounded-full filter blur-3xl opacity-60"
            ></div>

            {/* Floating elements around the code block with enhanced visibility */}
            <motion.div
              className="absolute -top-10 -left-10 p-2 px-4 rounded-lg border border-[var(--accent-color)]/30 
                        bg-background/90 backdrop-blur-sm text-xs font-code shadow-lg z-10"
              animate={{
                y: [0, -10, 0],
                rotate: [0, -5, 0],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              &lt;Responsive /&gt;
            </motion.div>

            <motion.div
              className="absolute -bottom-8 -right-5 p-2 px-4 rounded-lg border border-[var(--accent-color)]/30 
                        bg-background/90 backdrop-blur-sm text-xs font-code shadow-lg z-10"
              animate={{
                y: [0, 10, 0],
                rotate: [0, 5, 0],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 6,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              npm install
            </motion.div>

            <motion.div
              className="absolute -top-10 right-10 p-2 px-4 rounded-lg border border-[var(--accent-color)]/30 
                        bg-background/90 backdrop-blur-sm text-xs font-code shadow-lg z-10"
              animate={{
                y: [0, 8, 0],
                rotate: [0, 3, 0],
                opacity: [0.8, 1, 0.8],
              }}
              transition={{
                duration: 7,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              function() {}
            </motion.div>

            <div className="relative z-10 transform hover:scale-105 transition-transform duration-700">
              <AnimatedCodeBlock />
            </div>
          </motion.div>
        </div>

        {/* Improved scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20"
          animate={{ y: [0, 10, 0] }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            repeatType: "loop",
          }}
        >
          <div
            className="w-10 h-14 rounded-full border-2 border-[var(--accent-color)]/50 flex justify-center items-start pt-3 
                        backdrop-blur-sm bg-background/50 shadow-lg"
          >
            <motion.div
              className="w-2 h-2 rounded-full bg-[var(--accent-color)]"
              animate={{
                y: [0, 12, 0],
                scale: [1, 1.2, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Features Section */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-[var(--accent-color)]/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-[var(--accent-color)]/5 rounded-full blur-3xl"></div>
          <div className="absolute inset-0 opacity-20 bg-[url('/patterns/grid.svg')] bg-repeat"></div>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="px-4 py-1 mb-4 text-sm font-medium rounded-full border-[var(--accent-color)] text-[var(--accent-color-text)]"
              >
                Powerful Features
              </Badge>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold mb-4"
              >
                Why Developers Choose{" "}
                <span className="gradient-text">Binary Blogs</span>
              </motion.h2>
              <motion.p
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                viewport={{ once: true }}
                className="text-muted-foreground max-w-2xl mx-auto"
              >
                Our platform is built by developers, for developers, with
                features designed to make learning and sharing technical
                knowledge seamless.
              </motion.p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className={`${glassMorphismClass} overflow-hidden h-full`}
                >
                  <div className="p-8 h-full flex flex-col relative">
                    {/* Decorative elements */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full bg-[var(--accent-color)]/5 blur-2xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full bg-[var(--accent-color)]/5 blur-2xl"></div>

                    <div className="relative z-10 flex flex-col h-full">
                      <motion.div
                        className="rounded-xl w-14 h-14 flex items-center justify-center bg-[var(--accent-color)] text-white mb-6"
                        whileHover={{ scale: 1.1, rotate: 5 }}
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 10,
                        }}
                      >
                        {React.cloneElement(feature.icon, {
                          className: "h-6 w-6 text-white",
                        })}
                      </motion.div>

                      <h3 className="text-xl font-bold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-muted-foreground flex-grow">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Blogs Section */}
      <section className="py-24 bg-background">
        <div className="container-custom">
          <AnimatedSection>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2 gradient-text">
                  Featured Blogs
                </h2>
                <p className="text-muted-foreground">
                  Hand-picked technical content from our community
                </p>
              </div>
              <motion.div whileHover={{ x: 5 }}>
                <Button asChild variant="link" className="gap-2">
                  <Link to="/blogs">
                    View All Blogs
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </AnimatedSection>

          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredBlogs.map((blog, index) => (
                <BlogCard key={blog.id} blog={blog} index={index} />
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Trending Topics Section */}
      <TrendingTopicsSection />

      {/* New Testimonials Section with glass morphism */}
      <section className="py-24 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-[var(--accent-color)]/30 filter blur-3xl"></div>
          <div className="absolute bottom-10 right-10 w-72 h-72 rounded-full bg-[var(--accent-color)]/30 filter blur-3xl"></div>
        </div>
        <div className="container-custom relative z-10">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="px-4 py-1 mb-4 text-sm font-medium rounded-full border-[var(--accent-color)] text-[var(--accent-color-text)]"
              >
                Testimonials
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">What Developers Say</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Hear from our community members about their experience with
                Binary Blogs.
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "Binary Blogs transformed how I share my coding knowledge. The code highlighting is phenomenal!",
                author: "Sarah Chen",
                role: "Senior Frontend Developer",
                avatar: "https://i.pravatar.cc/150?img=32",
              },
              {
                quote:
                  "The best platform I've found for technical writing. Clean interface and great developer community.",
                author: "Michael Rodriguez",
                role: "DevOps Engineer",
                avatar: "https://i.pravatar.cc/150?img=60",
              },
              {
                quote:
                  "I love how Binary Blogs makes complex code concepts accessible through visual learning.",
                author: "Priya Sharma",
                role: "Data Scientist",
                avatar: "https://i.pravatar.cc/150?img=23",
              },
            ].map((testimonial, index) => (
              <AnimatedSection key={testimonial.author} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className={`${glassMorphismClass} overflow-hidden h-full`}
                >
                  <div className="p-8 h-full">
                    <div className="flex flex-col h-full">
                      <div className="mb-4">
                        <div className="rounded-xl w-14 h-14 flex items-center justify-center bg-[var(--accent-color)] text-white">
                          <svg
                            className="h-6 w-6 text-white"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M4.583 17.321C3.553 16.227 3 15 3 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179zm10 0C13.553 16.227 13 15 13 13.011c0-3.5 2.457-6.637 6.03-8.188l.893 1.378c-3.335 1.804-3.987 4.145-4.247 5.621.537-.278 1.24-.375 1.929-.311 1.804.167 3.226 1.648 3.226 3.489a3.5 3.5 0 01-3.5 3.5c-1.073 0-2.099-.49-2.748-1.179z"></path>
                          </svg>
                        </div>
                      </div>
                      <p className="flex-grow text-lg mb-6">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-auto pt-4 border-t border-[var(--accent-color)]/10 flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <img
                            className="h-10 w-10 rounded-full"
                            src={testimonial.avatar}
                            alt={testimonial.author}
                          />
                        </div>
                        <div>
                          <p className="font-medium">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.role}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Developer Tools Section - Updated with consistent styling */}
      <section className="py-24 bg-background relative overflow-hidden">
        {/* Background elements for visual appeal */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-primary/30 filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full bg-primary/20 filter blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <AnimatedSection>
            <div className="text-center mb-16">
              <Badge
                variant="outline"
                className="px-4 py-1 mb-4 text-sm font-medium rounded-full border-[var(--accent-color)] text-[var(--accent-color-text)]"
              >
                Features
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                <span className="gradient-text">Powerful Developer Tools</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Interactive tools to enhance your coding workflow and
                productivity
              </p>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Code Playground",
                description:
                  "Test and experiment with code snippets directly in your browser",
                icon: <Code className="h-6 w-6" />,
                comingSoon: false,
              },
              {
                title: "AI Code Assistant",
                description:
                  "Get intelligent code suggestions and automatic error detection",
                icon: <Database className="h-6 w-6" />,
                comingSoon: false,
              },
              {
                title: "Syntax Visualizer",
                description:
                  "Visualize code execution and flow to better understand algorithms",
                icon: <Globe className="h-6 w-6" />,
                comingSoon: false,
              },
              {
                title: "Performance Analyzer",
                description:
                  "Measure and optimize your code's performance with detailed metrics",
                icon: <Server className="h-6 w-6" />,
                comingSoon: true,
              },
              {
                title: "Security Scanner",
                description:
                  "Scan your code for potential security vulnerabilities",
                icon: <Shield className="h-6 w-6" />,
                comingSoon: true,
              },
              {
                title: "API Tester",
                description:
                  "Test API endpoints and visualize responses directly in the browser",
                icon: <Search className="h-6 w-6" />,
                comingSoon: true,
              },
            ].map((feature, index) => (
              <AnimatedSection key={feature.title} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8, transition: { duration: 0.2 } }}
                  whileTap={{ scale: 0.98 }}
                  className={`${glassMorphismClass} overflow-hidden h-full`}
                >
                  <div className="p-6 h-full flex flex-col">
                    <motion.div
                      className="rounded-xl w-14 h-14 flex items-center justify-center bg-primary text-primary-foreground mb-4"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{
                        type: "spring",
                        stiffness: 400,
                        damping: 10,
                      }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-2 flex items-center">
                      {feature.title}
                      {feature.comingSoon && (
                        <span className="ml-2 text-xs bg-primary/10 text-primary px-2 py-1 rounded-full whitespace-nowrap">
                          Coming Soon
                        </span>
                      )}
                    </h3>
                    <p className="text-muted-foreground flex-grow mb-4">
                      {feature.description}
                    </p>
                    <div className="mt-auto">
                      {feature.comingSoon ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={scrollToSubscribe}
                          className="border-primary/20 text-muted-foreground hover:border-[var(--accent-color)] hover:text-[var(--accent-color)] hover:bg-background cursor-pointer"
                        >
                          Get Notified
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => navigate("/blogs")}
                          className="bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
                        >
                          Learn More
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Community Highlights Section - New Addition */}
      <section
        className="py-24 bg-background relative overflow-hidden"
        ref={statsRef}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-30">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="dots-pattern"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
              >
                <circle
                  cx="20"
                  cy="20"
                  r="1"
                  fill="currentColor"
                  className="text-[var(--accent-color)]/30"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots-pattern)" />
          </svg>
        </div>

        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <AnimatedSection>
            <div className="text-center mb-12">
              <Badge
                variant="outline"
                className="px-4 py-1 mb-4 text-sm font-medium rounded-full border-[var(--accent-color)] text-[var(--accent-color-text)]"
              >
                Our Community
              </Badge>
              <motion.h2
                initial={{ opacity: 0, y: -20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                viewport={{ once: true }}
                className="text-3xl md:text-4xl font-bold"
              >
                Join a Thriving Developer Community
              </motion.h2>
            </div>
          </AnimatedSection>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {[
              {
                label: "Active Members",
                value: "15,000+",
                icon: <Users className="h-12 w-12" />,
              },
              {
                label: "Technical Articles",
                value: "3,200+",
                icon: <BookOpen className="h-12 w-12" />,
              },
              {
                label: "Code Snippets",
                value: "8,500+",
                icon: <Code className="h-12 w-12" />,
              },
              {
                label: "Daily Conversations",
                value: "1,200+",
                icon: <Terminal className="h-12 w-12" />,
              },
            ].map((stat, index) => (
              <AnimatedSection key={stat.label} delay={index * 0.1}>
                <motion.div
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 30px -15px rgba(0, 0, 0, 0.1)",
                  }}
                  className="flex flex-col items-center p-6 rounded-xl border border-[var(--accent-color)]/10 bg-background/80 backdrop-blur-sm"
                >
                  <div className="mb-4 p-3 rounded-full bg-[var(--accent-color)]/10 text-[var(--accent-color)]">
                    {stat.icon}
                  </div>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
                    viewport={{ once: true }}
                    className="text-3xl md:text-4xl font-bold text-foreground mb-2"
                  >
                    {animateStats ? <AnimatedNumber value={stat.value} /> : "0"}
                  </motion.div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">
                    {stat.label}
                  </h3>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>

          {/* Community testimonial slider */}
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-[var(--accent-color)]/5 to-[var(--accent-color)]/10 backdrop-blur-sm p-8 rounded-2xl border border-[var(--accent-color)]/20">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className="mb-6 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-[var(--accent-color)]/10">
                <svg
                  className="w-8 h-8 text-[var(--accent-color)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
              </div>
              <blockquote className="text-lg md:text-xl italic mb-6 text-foreground">
                "Binary Blogs has transformed how I approach coding challenges.
                The community here is incredibly supportive, and the quality of
                content has helped me grow as a developer."
              </blockquote>
              <div className="flex items-center justify-center">
                <img
                  src="https://i.pravatar.cc/150?img=32"
                  alt="Sarah Chen"
                  className="w-12 h-12 rounded-full mr-4 border-2 border-[var(--accent-color)]/30"
                />
                <div className="text-left">
                  <div className="font-medium">Sarah Chen</div>
                  <div className="text-sm text-muted-foreground">
                    Senior Frontend Developer at TechCorp
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section
        id="subscribe-section"
        className="py-24 binary-gradient text-white"
        ref={subscribeRef}
      >
        <div className="container-custom text-center">
          <AnimatedSection>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Join the Conversation
            </h2>
            <p className="max-w-2xl mx-auto mb-8 text-white/90">
              {!isLoggedIn
                ? "Join thousands of developers who are already sharing and learning on Binary Blogs. It takes only a minute to sign up."
                : "Share your knowledge and insights with our growing community of developers. Start writing today!"}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {!isLoggedIn ? (
                <>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      asChild
                      size="lg"
                      variant="secondary"
                      className="gap-2"
                    >
                      <Link to="/signup">Join Binary Blogs</Link>
                    </Button>
                  </motion.div>
                </>
              ) : (
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    asChild
                    size="lg"
                    variant="secondary"
                    className="gap-2"
                  >
                    <Link to="/new-blog">
                      Write a Blog
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Index;
