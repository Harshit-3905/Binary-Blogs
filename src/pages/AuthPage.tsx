import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/store/useAuthStore";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import {
  AtSign,
  KeyRound,
  Lock,
  User,
  ArrowRight,
  UserPlus,
} from "lucide-react";

export default function AuthPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const { isLoggedIn, isAuthReady, login, signup, guestLogin } = useAuthStore();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const [signupForm, setSignupForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    avatarFile: null as File | null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isAuthReady) return;
    if (isLoggedIn) navigate("/");
  }, [isAuthReady, isLoggedIn, navigate]);

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoginForm({
      ...loginForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleSignupChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.name === "avatarFile") {
      setSignupForm({
        ...signupForm,
        avatarFile: e.target.files?.[0] ?? null,
      });
      return;
    }

    setSignupForm({
      ...signupForm,
      [e.target.name]: e.target.value,
    });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await login(loginForm.email, loginForm.password);

      toast({
        title: "Login successful",
        description: "Welcome back to Binary Blogs!",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Login error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (signupForm.password !== signupForm.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please ensure both passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await signup({
        name: signupForm.name,
        email: signupForm.email,
        password: signupForm.password,
        avatarFile: signupForm.avatarFile ?? undefined,
      });

      toast({
        title: "Account created!",
        description: "Welcome to Binary Blogs.",
      });
      navigate("/");
    } catch (error) {
      toast({
        title: "Signup error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGuestLogin = async () => {
    await guestLogin();
    toast({
      title: "Guest login successful",
      description: "You are now signed in as a guest user.",
    });
    navigate("/");
  };

  return (
    <div className="container flex items-center justify-center min-h-[calc(100vh-4rem)] py-8 px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center mb-6">
          <motion.h1
            className="text-3xl font-bold mb-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Binary Blogs
          </motion.h1>
          <motion.p
            className="text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            Your platform for sharing coding stories
          </motion.p>
        </div>

        <motion.div
          className="backdrop-blur-sm bg-card/90 border-2 border-[var(--accent-color)] rounded-xl shadow-xl overflow-hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Tabs
            defaultValue={isLoginPage ? "login" : "signup"}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2 p-1 bg-muted/50 mb-2">
              <TabsTrigger
                value="login"
                onClick={() => navigate("/login")}
                className="rounded-md data-[state=active]:bg-[var(--accent-color)] data-[state=active]:text-white transition-all"
              >
                <Lock className="w-4 h-4 mr-2" />
                Login
              </TabsTrigger>
              <TabsTrigger
                value="signup"
                onClick={() => navigate("/signup")}
                className="rounded-md data-[state=active]:bg-[var(--accent-color)] data-[state=active]:text-white transition-all"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Sign Up
              </TabsTrigger>
            </TabsList>

            <TabsContent value="login" className="m-0">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    Welcome Back
                  </CardTitle>
                  <CardDescription className="text-center">
                    Sign in to continue your blogging journey
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleLoginSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="login-email"
                        className="text-sm font-medium"
                      >
                        Email
                      </Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="login-email"
                          name="email"
                          type="email"
                          placeholder="Your email"
                          value={loginForm.email}
                          onChange={handleLoginChange}
                          required
                          className="pl-10 border-[var(--accent-color)]/30 focus:border-[var(--accent-color)] transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="login-password"
                        className="text-sm font-medium"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="login-password"
                          name="password"
                          type="password"
                          placeholder="Your password"
                          value={loginForm.password}
                          onChange={handleLoginChange}
                          required
                          className="pl-10 border-[var(--accent-color)]/30 focus:border-[var(--accent-color)] transition-colors"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3 pb-6">
                    <Button
                      type="submit"
                      className="w-full bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Logging in..."
                      ) : (
                        <span className="flex items-center">
                          Login <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-[var(--accent-color)]/20 text-[var(--accent-color-text)] hover:bg-[var(--accent-color)]/5 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]"
                      onClick={handleGuestLogin}
                      disabled={isSubmitting}
                    >
                      Continue as Guest
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>

            <TabsContent value="signup" className="m-0">
              <Card className="border-0 shadow-none bg-transparent">
                <CardHeader>
                  <CardTitle className="text-center text-2xl">
                    Join Us Today
                  </CardTitle>
                  <CardDescription className="text-center">
                    Create your account to start blogging
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignupSubmit}>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="signup-name"
                        className="text-sm font-medium"
                      >
                        Name
                      </Label>
                      <div className="relative">
                        <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signup-name"
                          name="name"
                          placeholder="Your name"
                          value={signupForm.name}
                          onChange={handleSignupChange}
                          required
                          className="pl-10 border-[var(--accent-color)]/30 focus:border-[var(--accent-color)] transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="signup-email"
                        className="text-sm font-medium"
                      >
                        Email
                      </Label>
                      <div className="relative">
                        <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signup-email"
                          name="email"
                          type="email"
                          placeholder="Your email"
                          value={signupForm.email}
                          onChange={handleSignupChange}
                          required
                          className="pl-10 border-[var(--accent-color)]/30 focus:border-[var(--accent-color)] transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="signup-avatar"
                        className="text-sm font-medium"
                      >
                        Avatar (optional)
                      </Label>
                      <Input
                        id="signup-avatar"
                        name="avatarFile"
                        type="file"
                        accept="image/*"
                        onChange={handleSignupChange}
                        className="border-[var(--accent-color)]/30 focus:border-[var(--accent-color)] transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="signup-password"
                        className="text-sm font-medium"
                      >
                        Password
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signup-password"
                          name="password"
                          type="password"
                          placeholder="Create a password"
                          value={signupForm.password}
                          onChange={handleSignupChange}
                          required
                          className="pl-10 border-[var(--accent-color)]/30 focus:border-[var(--accent-color)] transition-colors"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="signup-confirm-password"
                        className="text-sm font-medium"
                      >
                        Confirm Password
                      </Label>
                      <div className="relative">
                        <KeyRound className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                        <Input
                          id="signup-confirm-password"
                          name="confirmPassword"
                          type="password"
                          placeholder="Confirm your password"
                          value={signupForm.confirmPassword}
                          onChange={handleSignupChange}
                          required
                          className="pl-10 border-[var(--accent-color)]/30 focus:border-[var(--accent-color)] transition-colors"
                        />
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-3 pb-6">
                    <Button
                      type="submit"
                      className="w-full bg-[var(--accent-color)] text-white hover:bg-background hover:text-[var(--accent-color)] hover:border-[var(--accent-color)] border-2 border-transparent"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Creating account..."
                      ) : (
                        <span className="flex items-center">
                          Create Account <ArrowRight className="ml-2 h-4 w-4" />
                        </span>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full border-[var(--accent-color)]/20 text-[var(--accent-color-text)] hover:bg-[var(--accent-color)]/5 hover:text-[var(--accent-color)] hover:border-[var(--accent-color)]"
                      onClick={handleGuestLogin}
                      disabled={isSubmitting}
                    >
                      Continue as Guest
                    </Button>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>

        <motion.p
          className="text-center text-xs text-muted-foreground mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          By signing up, you agree to our Terms of Service and Privacy Policy
        </motion.p>
      </motion.div>
    </div>
  );
}
