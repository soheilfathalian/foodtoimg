import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Camera, Download, ChefHat } from "lucide-react";

const Index = () => {
  const [foodName, setFoodName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  const generateImage = async () => {
    if (!foodName.trim()) {
      toast.error("Please enter a food name");
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);

    try {
      const response = await fetch("https://n8n.urbakery.com/webhook-test/a5541400-8766-4bfc-ad0f-2607863b31f2", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ foodName: foodName.trim() }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate image");
      }

      const data = await response.text();
      console.log("Webhook response as text:", data);
      
      try {
        const jsonData = JSON.parse(data);
        console.log("Parsed JSON:", jsonData);
        
        // Handle array response with binary image data
        if (Array.isArray(jsonData) && jsonData.length > 0) {
          const firstItem = jsonData[0];
          
          // Check if backend rejected non-food input
          if (firstItem.output === false) {
            console.log("Backend rejected non-food input");
            toast.error("Please only type food names. Try something like 'Grilled Salmon' or 'Chocolate Cake'");
            setIsLoading(false);
            return;
          }
          
          // Check if the image field contains binary data
          if (firstItem.image) {
            try {
              // Convert binary data to blob
              const binaryString = firstItem.image;
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              const blob = new Blob([bytes], { type: 'image/png' });
              const imageUrl = URL.createObjectURL(blob);
              setGeneratedImage(imageUrl);
              toast.success("Image generated successfully!");
              return;
            } catch (binaryError) {
              console.error("Error processing binary data:", binaryError);
              // If binary conversion fails, try as URL
              if (typeof firstItem.image === 'string' && firstItem.image.startsWith('http')) {
                setGeneratedImage(firstItem.image);
                toast.success("Image generated successfully!");
                return;
              }
            }
          }
          
          // Fallback: check for other possible image properties
          const arrayImageUrl = firstItem.imageUrl || firstItem.url || firstItem.png || firstItem.result;
          if (arrayImageUrl) {
            setGeneratedImage(arrayImageUrl);
            toast.success("Image generated successfully!");
            return;
          }
        }
        
        // Handle base64 image data FIRST (highest priority)
        if (jsonData.image && typeof jsonData.image === 'string') {
          // Check if it's a URL
          if (jsonData.image.startsWith('http')) {
            console.log("Detected image URL");
            setGeneratedImage(jsonData.image);
            toast.success("Image generated successfully!");
            return;
          }
          
          // Otherwise treat as base64
          console.log("Detected base64 image data");
          console.log("Base64 data length:", jsonData.image.length);
          console.log("First 50 characters:", jsonData.image.substring(0, 50));
          
          let base64Data = jsonData.image;
          
          // Remove data URL prefix if present
          if (base64Data.startsWith('data:image/')) {
            base64Data = base64Data.split(',')[1];
          }
          
          // Create data URL with proper MIME type
          const base64ImageUrl = `data:image/png;base64,${base64Data}`;
          console.log("Created image URL:", base64ImageUrl.substring(0, 100) + "...");
          
          setGeneratedImage(base64ImageUrl);
          toast.success("Image generated successfully!");
          return;
        }

        // Handle other URL properties as fallback
        const imageUrl = jsonData.imageUrl || jsonData.url || jsonData.png || jsonData.result;
        if (imageUrl) {
          setGeneratedImage(imageUrl);
          toast.success("Image generated successfully!");
          return;
        }
        
        console.log("No image found in response");
        console.log("Expected format: {\"image\": \"base64-string-here\"}");
        toast.error("No image returned from webhook");
      } catch (parseError) {
        console.error("Error parsing JSON:", parseError);
        
        // If it's not JSON, check if it's a direct image URL
        if (data.startsWith('http') && (data.includes('.jpg') || data.includes('.png') || data.includes('.jpeg'))) {
          setGeneratedImage(data.trim());
          toast.success("Image generated successfully!");
        } else {
          // Try to handle as raw binary data
          try {
            const bytes = new Uint8Array(data.length);
            for (let i = 0; i < data.length; i++) {
              bytes[i] = data.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: 'image/png' });
            const imageUrl = URL.createObjectURL(blob);
            setGeneratedImage(imageUrl);
            toast.success("Image generated successfully!");
          } catch (rawError) {
            console.error("Error processing raw binary data:", rawError);
            toast.error("Failed to process webhook response");
          }
        }
      }
    } catch (error) {
      console.error("Error generating image:", error);
      toast.error("Failed to generate image: " + (error instanceof Error ? error.message : "Unknown error"));
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = () => {
    if (!generatedImage) return;

    const link = document.createElement("a");
    link.href = generatedImage;
    link.download = `${foodName.replace(/\s+/g, "-").toLowerCase()}-menusnap.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Image downloaded!");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border/40">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <ChefHat className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">MenuSnap</h1>
              <p className="text-sm text-muted-foreground">Generate stunning food photos instantly</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto">
          {/* Hero Section */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              Transform Food Names into 
              <span className="text-primary"> Stunning Photos</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-lg mx-auto">
              Generate high-quality, professional food images for your restaurant menu in seconds
            </p>
          </div>

          {/* Input Form */}
          <Card className="mb-8">
            <CardContent className="p-8">
              <div className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="food-name" className="text-sm font-medium text-foreground">
                    Food Name
                  </label>
                  <Input
                    id="food-name"
                    placeholder="e.g., Grilled Salmon with Lemon"
                    value={foodName}
                    onChange={(e) => setFoodName(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && generateImage()}
                    className="text-lg py-6"
                    disabled={isLoading}
                  />
                </div>
                
                <Button 
                  onClick={generateImage}
                  disabled={isLoading || !foodName.trim()}
                  className="w-full py-6 text-lg font-medium"
                  size="lg"
                >
                  <Camera className="w-5 h-5 mr-2" />
                  {isLoading ? "Generating..." : "Generate Photo"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Loading Animation */}
          {isLoading && (
            <Card className="mb-8">
              <CardContent className="p-12">
                <div className="flex flex-col items-center space-y-6">
                  <div className="w-20 h-20 bg-primary rounded-2xl loader-3d"></div>
                  <div className="text-center">
                    <p className="text-lg font-medium text-foreground">Creating your perfect food photo...</p>
                    <p className="text-sm text-muted-foreground mt-1">This usually takes 10-15 seconds</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Generated Image */}
          {generatedImage && !isLoading && (
            <Card>
              <CardContent className="p-8">
                <div className="space-y-6">
                  <div className="text-center">
                    <h3 className="text-xl font-semibold text-foreground mb-2">
                      Generated Photo: {foodName}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      High-resolution image ready for your menu
                    </p>
                  </div>
                  
                  <div className="relative">
                    <img
                      src={generatedImage}
                      alt={`Generated photo of ${foodName}`}
                      className="w-full h-auto rounded-lg shadow-lg"
                    />
                  </div>
                  
                  <Button 
                    onClick={downloadImage}
                    variant="outline"
                    className="w-full py-6 text-lg font-medium"
                    size="lg"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Image
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Feature Cards */}
          {!generatedImage && !isLoading && (
            <div className="grid md:grid-cols-3 gap-6 mt-16">
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">High Quality</h3>
                  <p className="text-sm text-muted-foreground">Professional-grade images perfect for menus and marketing</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <ChefHat className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Food Focused</h3>
                  <p className="text-sm text-muted-foreground">AI trained specifically on appetizing food photography</p>
                </CardContent>
              </Card>
              
              <Card className="text-center">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-4">
                    <Download className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">Instant Download</h3>
                  <p className="text-sm text-muted-foreground">Get your images immediately in high resolution</p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 mt-20">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center text-sm text-muted-foreground">
            <p>© 2025 Food to IMG. Generate stunning food photos for your restaurant.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
