
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Stamp, Award, PartyPopper } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { addQrCodeScan } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import confetti from 'canvas-confetti';

interface ScanResultProps {
  result: string;
  isStamped: boolean;
  onStampComplete: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({ result, isStamped, onStampComplete }) => {
  const { toast } = useToast();
  const [isStamping, setIsStamping] = useState(false);
  const [maxReached, setMaxReached] = useState(false);

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const handleStamp = async () => {
    setIsStamping(true);
    
    try {
      console.log('Sending QR code to be stamped:', result);
      const response = await addQrCodeScan(result);
      console.log('Stamp response:', response);
      
      if (response.success) {
        if (response.maxReached) {
          setMaxReached(true);
          
          // Trigger confetti effect when max stamps reached
          triggerConfetti();
          
          // Custom message for bonus available
          toast({
            title: "Stempelkarte Voll",
            description: "BONUS verfügbar!",
            variant: "default",
          });
        } else {
          // Regular success toast
          toast({
            title: "Stempel Erfolgreich Hinzugefügt",
            description: response.message || "Stempel registriert",
            variant: "default",
          });
        }
        
        onStampComplete(); // Notify parent component that stamp is complete
      } else {
        toast({
          title: "Fehler",
          description: response.error || "Stempeln des QR-Codes fehlgeschlagen",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error during stamping:', err);
      toast({
        title: "Fehler",
        description: "Beim Stempeln ist ein Fehler aufgetreten",
        variant: "destructive",
      });
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
        <span className="text-green-800 font-medium">Scan Erfolgreich</span>
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
            
            {maxReached && (
              <div className="bg-amber-50 p-3 rounded-md text-amber-800 text-center font-medium">
                <div className="flex flex-col items-center">
                  <PartyPopper className="h-6 w-6 mx-auto mb-1 text-amber-600" />
                  <div>Stempelkarte ist voll!</div>
                  <div className="text-green-600 font-bold mt-1">BONUS verfügbar</div>
                </div>
              </div>
            )}
            
            <div className="flex justify-center space-x-3 pt-2">
              <Button 
                variant="outline"
                onClick={() => window.location.reload()}
              >
                Erneut Scannen
              </Button>
              <Button 
                onClick={handleStamp}
                disabled={isStamping || isStamped || maxReached}
                className={`flex items-center gap-2 ${isStamped || maxReached ? 'bg-gray-400' : 'bg-[#003180] hover:bg-[#002156]'}`}
              >
                <Stamp className="h-4 w-4" />
                {isStamping ? "Stempeln..." : maxReached ? "Karte Voll" : isStamped ? "Gestempelt" : "Stempeln"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanResult;
