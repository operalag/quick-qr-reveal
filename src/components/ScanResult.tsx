
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Check, Stamp, Award, RefreshCcw, Gift } from "lucide-react";
import QRCode from "react-qr-code";
import { Button } from "@/components/ui/button";
import { addQrCodeScan, resetStampCount, distributeGoodie } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface ScanResultProps {
  result: string;
  isStamped: boolean;
  onStampComplete: () => void;
}

const ScanResult: React.FC<ScanResultProps> = ({ result, isStamped, onStampComplete }) => {
  const { toast } = useToast();
  const [isStamping, setIsStamping] = useState(false);
  const [maxReached, setMaxReached] = useState(false);
  const [goodieStatus, setGoodieStatus] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const [isDistributing, setIsDistributing] = useState(false);

  const handleStamp = async () => {
    setIsStamping(true);
    
    try {
      console.log('Sending QR code to be stamped:', result);
      const response = await addQrCodeScan(result);
      console.log('Stamp response:', response);
      
      if (response.success) {
        if (response.maxReached) {
          setMaxReached(true);
        }
        
        // Set goodie status if available in response
        if (response.goodieStatus !== undefined) {
          setGoodieStatus(response.goodieStatus);
        }
        
        // Set the message from the response for the toast only
        const message = response.message || "Stempel registriert";
        
        toast({
          title: response.maxReached ? "Stempelkarte Voll" : "Stempel Erfolgreich Hinzugefügt",
          description: message,
          variant: "default",
        });
        
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

  const handleResetCard = async () => {
    setIsResetting(true);
    try {
      const response = await resetStampCount(result);
      if (response.success) {
        setMaxReached(false);
        
        toast({
          title: "Karte Zurückgesetzt",
          description: "Stempelkarte wurde erfolgreich zurückgesetzt",
          variant: "default",
        });
        
        // Force refresh to update the UI
        window.location.reload();
      } else {
        toast({
          title: "Fehler",
          description: response.error || "Zurücksetzen fehlgeschlagen",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error resetting card:', err);
      toast({
        title: "Fehler",
        description: "Beim Zurücksetzen ist ein Fehler aufgetreten",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleDistributeBonus = async () => {
    setIsDistributing(true);
    try {
      const response = await distributeGoodie(result);
      if (response.success) {
        setGoodieStatus(prev => Math.max(0, prev - 1));
        
        toast({
          title: "Bonus Ausgeteilt",
          description: "Bonus wurde erfolgreich ausgeteilt",
          variant: "default",
        });
        
        if (response.goodieStatus !== undefined) {
          setGoodieStatus(response.goodieStatus);
        }
      } else {
        toast({
          title: "Fehler",
          description: response.error || "Bonus konnte nicht ausgeteilt werden",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error('Error distributing bonus:', err);
      toast({
        title: "Fehler",
        description: "Beim Austeilen des Bonus ist ein Fehler aufgetreten",
        variant: "destructive",
      });
    } finally {
      setIsDistributing(false);
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
                <Award className="h-5 w-5 mx-auto mb-1" />
                <div>Stempelkarte ist voll!</div>
                <div className="text-amber-600 font-bold mt-1">BONUS verfügbar</div>
                <div className="text-amber-700 font-bold mt-2">
                  Verfügbare Bonus: <span className="text-xl">{goodieStatus}</span>
                </div>
              </div>
            )}
            
            <div className="flex flex-col justify-center space-y-3 pt-2">
              <div className="flex justify-center space-x-3">
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
              
              {maxReached && (
                <div className="flex justify-center space-x-3 mt-3">
                  <Button
                    variant="secondary"
                    onClick={handleResetCard}
                    disabled={isResetting}
                    className="bg-blue-500 hover:bg-blue-600 text-white"
                  >
                    <RefreshCcw className="h-4 w-4 mr-2" />
                    {isResetting ? "Wird zurückgesetzt..." : "Neue Karte"}
                  </Button>
                  
                  <Button
                    variant="secondary"
                    onClick={handleDistributeBonus}
                    disabled={isDistributing || goodieStatus <= 0}
                    className="bg-amber-500 hover:bg-amber-600 text-white"
                  >
                    <Gift className="h-4 w-4 mr-2" />
                    {isDistributing ? "Wird ausgeteilt..." : "Bonus ausgeteilt"}
                  </Button>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ScanResult;
