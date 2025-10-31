import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Heart, Sparkles, MapPin, Shield, Clock } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/10 to-secondary/10">
      {/* Header */}
      <header className="border-b bg-card/80 backdrop-blur">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">Cureiosity</span>
          </div>
          {user ? (
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted-foreground hidden sm:inline">
                {user.email}
              </span>
              <Button variant="outline" onClick={handleSignOut}>
                Sign Out
              </Button>
            </div>
          ) : (
            <Button variant="outline" onClick={() => navigate("/auth")}>
              Sign In
            </Button>
          )}
        </div>
      </header>

      {/* Hero */}
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-sm font-medium text-primary mb-4">
            <Sparkles className="w-4 h-4" />
            AI-Powered Healthcare
          </div>
          
          <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
            Find the Right Doctor
            <br />
            <span className="text-primary">In Minutes</span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Describe your symptoms, get matched with the perfect specialist, and book an
            appointment—all in one seamless experience.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Button
              size="lg"
              className="h-14 text-lg px-8"
              onClick={() => navigate(user ? "/symptom" : "/auth")}
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Get Started
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="h-14 text-lg px-8"
            >
              Learn More
            </Button>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-6 pt-16">
            <div className="p-6 rounded-2xl bg-card shadow-md border border-border">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">AI-Powered Triage</h3>
              <p className="text-muted-foreground text-sm">
                Intelligent symptom analysis recommends the right specialist for your needs
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card shadow-md border border-border">
              <div className="w-12 h-12 bg-secondary/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <MapPin className="w-6 h-6 text-secondary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Location-Based</h3>
              <p className="text-muted-foreground text-sm">
                Find providers near you who accept your insurance and match your preferences
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-card shadow-md border border-border">
              <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 mx-auto">
                <Clock className="w-6 h-6 text-accent" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-Time Booking</h3>
              <p className="text-muted-foreground text-sm">
                See available appointments and book instantly with confirmation
              </p>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              HIPAA Compliant
            </div>
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4" />
              Privacy Protected
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
