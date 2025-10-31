import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Stethoscope, Sparkles, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const commonSymptoms = [
  "Headache",
  "Fever",
  "Cough",
  "Sore throat",
  "Back pain",
  "Stomach pain",
  "Dizziness",
  "Fatigue",
];

const Symptom = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [symptomText, setSymptomText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleSymptomChip = (symptom: string) => {
    setSymptomText((prev) => (prev ? `${prev}, ${symptom.toLowerCase()}` : symptom.toLowerCase()));
  };

  const handleAnalyze = async () => {
    if (!symptomText.trim()) {
      toast({
        variant: "destructive",
        title: "Missing information",
        description: "Please describe your symptoms",
      });
      return;
    }

    setIsAnalyzing(true);

    try {
      const { data, error } = await supabase.functions.invoke("triage", {
        body: { symptom_text: symptomText },
      });

      if (error) throw error;

      // Navigate to results with triage data
      navigate("/triage-result", { state: { triageResult: data, symptomText } });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Analysis failed",
        description: error.message || "Failed to analyze symptoms",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4">
            <Activity className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-4xl font-bold mb-2">How can we help today?</h1>
          <p className="text-muted-foreground text-lg">
            Describe your symptoms and we'll recommend the right specialist
          </p>
        </div>

        <Card className="p-6 md:p-8 shadow-lg border-0 bg-card/80 backdrop-blur">
          <div className="space-y-6">
            <div>
              <label htmlFor="symptoms" className="block text-sm font-medium mb-3">
                What's going on?
              </label>
              <Textarea
                id="symptoms"
                placeholder="I've been experiencing..."
                value={symptomText}
                onChange={(e) => setSymptomText(e.target.value)}
                className="min-h-[150px] text-base resize-none"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Be as specific as possible. Include when symptoms started and any relevant details.
              </p>
            </div>

            <div>
              <p className="text-sm font-medium mb-3">Quick select common symptoms:</p>
              <div className="flex flex-wrap gap-2">
                {commonSymptoms.map((symptom) => (
                  <Badge
                    key={symptom}
                    variant="outline"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleSymptomChip(symptom)}
                  >
                    {symptom}
                  </Badge>
                ))}
              </div>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 border border-border">
              <div className="flex items-start gap-3">
                <Stethoscope className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <div className="text-sm text-muted-foreground">
                  <p className="font-medium text-foreground mb-1">Your privacy is protected</p>
                  <p>
                    This information is used only to help match you with the right healthcare
                    provider. We don't diagnose conditions.
                  </p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleAnalyze}
              disabled={isAnalyzing || !symptomText.trim()}
              className="w-full h-12 text-base"
              size="lg"
            >
              {isAnalyzing ? (
                <>
                  <Sparkles className="w-5 h-5 mr-2 animate-pulse" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  Find the Right Doctor
                </>
              )}
            </Button>
          </div>
        </Card>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-destructive">Emergency?</span> Call 911 or visit your
            nearest emergency room
          </p>
        </div>
      </div>
    </div>
  );
};

export default Symptom;
