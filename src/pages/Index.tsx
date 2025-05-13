
import { useState } from "react";
import QRScanner from "@/components/QRScanner";
import ScanResult from "@/components/ScanResult";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isStamped, setIsStamped] = useState(false);

  const handleScan = (result: string) => {
    if (result) {
      setScanResult(result);
      setIsScanning(false);
      setIsStamped(false); // Reset stamped state on new scan
    }
  };

  const handleStartScan = () => {
    setScanResult(null);
    setIsScanning(true);
    setIsStamped(false);
  };

  const handleStampComplete = () => {
    setIsStamped(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center bg-[#003180] text-white rounded-t-lg relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <img 
              src="/lovable-uploads/7d9258b3-9336-40bb-a829-6b75d7b35ff3.png" 
              alt="Fürstenberg" 
              className="h-full object-contain p-1"
            />
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {isScanning ? (
            <QRScanner onScanSuccess={handleScan} />
          ) : (
            <div className="space-y-6">
              {scanResult ? (
                <ScanResult 
                  result={scanResult} 
                  isStamped={isStamped} 
                  onStampComplete={handleStampComplete}
                />
              ) : (
                <div className="text-center text-gray-600 py-8">
                  <p>Drücken Sie den Button unten, um einen QR-Code zu scannen</p>
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={handleStartScan}
                      className="bg-[#003180] hover:bg-[#00296b] text-white px-8 py-2 rounded-full transition-all"
                    >
                      Scannen Starten
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Index;
