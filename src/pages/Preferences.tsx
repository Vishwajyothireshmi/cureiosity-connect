import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search } from "lucide-react";

const Preferences = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { specialty } = location.state || {};
  
  const [zipCode, setZipCode] = useState("");
  const [radius, setRadius] = useState("10");
  const [visitType, setVisitType] = useState<string>("in-person");

  const handleContinue = () => {
    navigate("/providers", {
      state: {
        specialty,
        zipCode,
        radius,
        visitType,
      },
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-secondary/5">
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" onClick={() => navigate(-1)} className="mb-4">
            ← Back
          </Button>
          <h1 className="text-3xl font-bold mb-2">Set Your Preferences</h1>
          <p className="text-muted-foreground">
            Help us find the best providers for you
          </p>
        </div>

        <Card className="p-6 md:p-8 shadow-lg">
          <div className="space-y-6">
            {/* Specialty Display */}
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
              <Label className="text-sm text-muted-foreground">Looking for</Label>
              <p className="text-lg font-semibold mt-1">{specialty}</p>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="zipCode">
                <MapPin className="w-4 h-4 inline mr-2" />
                Location (ZIP Code)
              </Label>
              <Input
                id="zipCode"
                placeholder="e.g., 46204"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                maxLength={5}
              />
            </div>

            {/* Radius */}
            <div className="space-y-2">
              <Label htmlFor="radius">Travel Distance</Label>
              <div className="flex items-center gap-4">
                <input
                  type="range"
                  id="radius"
                  min="5"
                  max="50"
                  step="5"
                  value={radius}
                  onChange={(e) => setRadius(e.target.value)}
                  className="flex-1"
                />
                <Badge variant="secondary" className="w-20 justify-center">
                  {radius} mi
                </Badge>
              </div>
            </div>

            {/* Visit Type */}
            <div className="space-y-2">
              <Label htmlFor="visitType">Visit Type</Label>
              <Select value={visitType} onValueChange={setVisitType}>
                <SelectTrigger id="visitType">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="in-person">In-Person</SelectItem>
                  <SelectItem value="telehealth">Telehealth</SelectItem>
                  <SelectItem value="both">No Preference</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="pt-4">
              <Button
                onClick={handleContinue}
                disabled={!zipCode || zipCode.length !== 5}
                className="w-full h-12"
                size="lg"
              >
                <Search className="w-5 h-5 mr-2" />
                Find Providers
              </Button>
            </div>
          </div>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            We'll match you with providers based on your location and preferences
          </p>
        </div>
      </div>
    </div>
  );
};

export default Preferences;
