import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { symptom_text } = await req.json();
    
    if (!symptom_text || typeof symptom_text !== "string") {
      return new Response(
        JSON.stringify({ error: "symptom_text is required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      console.error("LOVABLE_API_KEY not configured");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Analyzing symptoms:", symptom_text);

    const systemPrompt = `You are a medical triage assistant. Analyze the patient's symptoms and recommend the most appropriate medical specialty.

Your response must be in valid JSON format with this exact structure:
{
  "specialty": "one of: General Physician, Cardiologist, Dermatologist, Orthopedist, Neurologist, Psychiatrist, ENT Specialist, Ophthalmologist, Gastroenterologist, Pulmonologist, Endocrinologist, Rheumatologist, Urologist, Gynecologist, Pediatrician",
  "urgency": "one of: routine, soon, urgent, emergency",
  "confidence": 0.85,
  "rationale": [
    "Reason 1 for this recommendation",
    "Reason 2 for this recommendation",
    "Reason 3 for this recommendation"
  ]
}

Guidelines:
- Choose "emergency" only for life-threatening symptoms (chest pain, severe bleeding, difficulty breathing, loss of consciousness, stroke signs)
- Choose "urgent" for symptoms requiring same-day or next-day care
- Choose "soon" for symptoms needing attention within a few days
- Choose "routine" for non-urgent concerns
- Confidence should be between 0.5 and 1.0
- Provide 2-4 clear rationale points
- Be conservative - when in doubt, recommend General Physician
- Never diagnose conditions, only recommend specialty`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Symptoms: ${symptom_text}` },
        ],
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again later." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "AI service quota exceeded." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      return new Response(
        JSON.stringify({ error: "Failed to analyze symptoms" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      console.error("No content in AI response");
      return new Response(
        JSON.stringify({ error: "Invalid AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Extract JSON from markdown code blocks if present
    let jsonContent = content;
    const jsonMatch = content.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
    if (jsonMatch) {
      jsonContent = jsonMatch[1];
    }

    let triageResult;
    try {
      triageResult = JSON.parse(jsonContent);
    } catch (parseError) {
      console.error("Failed to parse AI response:", content);
      return new Response(
        JSON.stringify({ error: "Failed to parse AI response" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("Triage result:", triageResult);

    return new Response(
      JSON.stringify(triageResult),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error in triage function:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
