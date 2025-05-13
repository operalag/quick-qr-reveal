
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Stamp } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { addQrCodeScan } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ScanResultProps {
  result: string;
}

const ScanResult: React.FC<ScanResultProps> = ({ result }) => {
  const { toast } = useToast();
  const [isStamping, setIsStamping] = useState(false);

  // Check if the result is a URL
  const isUrl = (str: string) => {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  };

  const handleStamp = async () => {
    setIsStamping(true);
    
    try {
      const { success, error } = await addQrCodeScan(result);
      
      if (success) {
        toast({
          title: "Success!",
          description: "QR code has been stamped in the database",
          variant: "default",
        });
      } else {
        toast({
          title: "Error",
          description: error || "Failed to stamp QR code",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong while stamping",
        variant: "destructive",
      });
      console.error(err);
    } finally {
      setIsStamping(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="bg-green-50 rounded-lg p-4 flex items-center justify-center">
        <div className="bg-green-100 rounded-full p-2 mr-3">
          <Check className="h-6 w-6 text-green-600" />
        </div>
        <span className="text-green-800 font-medium">Scan Successful</span>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex justify-center mb-4">
              <div className="w-32 h-32">
                <QRCode 
                  value={result}
                  size={128}
                  style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                />
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500 mb-1">QR Content:</h3>
              <div className="p-3 bg-gray-50 rounded-md break-all">
                {isUrl(result) ? (
                  <a 
                    href={result} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 underline hover:text-blue-800"
                  >
                    {result}
                  </a>
                ) : (
                  <p className="text-gray-800">{result}</p>
                )}
              </div>
            </div>
            
            <div className="flex justify-center space-x-3 pt-2">
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Scan Again
              </Button>
              <Button 
                onClick={handleStamp}
                disabled={isStamping}
                className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
              >
                <Stamp className="h-4 w-4" />
                {isStamping ? "Stamping..." : "Stamp"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanResult;
