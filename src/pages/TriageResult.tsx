import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { AlertCircle, CheckCircle2, Clock, Zap, ArrowRight } from "lucide-react";

interface TriageResult {
  specialty: string;
  urgency: "routine" | "soon" | "urgent" | "emergency";
  confidence: number;
  rationale: string[];
}

const TriageResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { triageResult, symptomText } = location.state || {};

  useEffect(() => {
    if (!triageResult) {
      navigate("/symptom");
    }
  }, [triageResult, navigate]);

  if (!triageResult) return null;

  const result = triageResult as TriageResult;

  const urgencyConfig = {
    emergency: {
      icon: AlertCircle,
      color: "text-destructive",
      bgColor: "bg-destructive/10",
      borderColor: "border-destructive",
      label: "Emergency",
      message:
        "These symptoms require immediate medical attention. Please call 911 or visit your nearest emergency room.",
    },
    urgent: {
      icon: Zap,
      color: "text-warning",
      bgColor: "bg-warning/10",
      borderColor: "border-warning",
      label: "Urgent",
      message: "We recommend seeing a doctor within the next 24 hours.",
    },
    soon: {
      icon: Clock,
      color: "text-info",
      bgColor: "bg-info/10",
      borderColor: "border-info",
      label: "Soon",
      message: "You should schedule an appointment within the next few days.",
    },
    routine: {
      icon: CheckCircle2,
      color: "text-success",
      bgColor: "bg-success/10",
      borderColor: "border-success",
      label: "Routine",
      message: "This can be addressed at your convenience with a routine appointment.",
    },
  };

  const config = urgencyConfig[result.urgency];
  const Icon = config.icon;

  const handleContinue = () => {
    if (result.urgency === "emergency") {
      return;
    }
    navigate("/preferences", { state: { specialty: result.specialty, symptomText } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container max-w-3xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate("/symptom")} className="mb-4">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Your Triage Results</h1>
          <p className="text-muted-foreground">Based on the symptoms you described</p>
        </div>

        <div className="space-y-6">
          {/* Urgency Alert */}
          <Card
            className={`p-6 border-2 ${config.borderColor} ${config.bgColor}`}
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-full ${config.bgColor}`}>
                <Icon className={`w-6 h-6 ${config.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline" className={config.color}>
                    {config.label}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(result.confidence * 100)}% confidence
                  </span>
                </div>
                <p className="text-base">{config.message}</p>
              </div>
            </div>
          </Card>

          {/* Recommended Specialty */}
          <Card className="p-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-3">Recommended Specialist</h2>
            <div className="flex items-center gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-2xl text-primary-foreground">👨‍⚕️</span>
              </div>
              <div>
                <p className="font-semibold text-lg">{result.specialty}</p>
                <p className="text-sm text-muted-foreground">
                  Based on your symptoms, this is the best match
                </p>
              </div>
            </div>
          </Card>

          {/* Rationale */}
          <Card className="p-6 shadow-lg">
            <Accordion type="single" collapsible defaultValue="rationale">
              <AccordionItem value="rationale" className="border-none">
                <AccordionTrigger className="hover:no-underline">
                  <h2 className="text-xl font-semibold">How we decided</h2>
                </AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3 mt-4">
                    {result.rationale.map((reason, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-xs font-semibold text-primary">
                            {index + 1}
                          </span>
                        </div>
                        <p className="text-muted-foreground">{reason}</p>
                      </div>
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </Card>

          {/* Action Buttons */}
          {result.urgency !== "emergency" ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <Button onClick={handleContinue} className="flex-1 h-12" size="lg">
                Find Providers
                <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate("/symptom")}
                className="h-12"
                size="lg"
              >
                Start Over
              </Button>
            </div>
          ) : (
            <div className="text-center">
              <Button
                variant="outline"
                onClick={() => navigate("/symptom")}
                className="h-12"
                size="lg"
              >
                Start Over
              </Button>
            </div>
          )}

          {/* Disclaimer */}
          <Card className="p-4 bg-muted/50">
            <p className="text-sm text-muted-foreground text-center">
              This is not a medical diagnosis. Please consult with a healthcare professional for
              proper evaluation and treatment.
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TriageResult;
