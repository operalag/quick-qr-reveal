
import { useState } from "react";
import QRScanner from "@/components/QRScanner";
import ScanResult from "@/components/ScanResult";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const Index = () => {
  const [scanResult, setScanResult] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState(false);

  const handleScan = (result: string) => {
    if (result) {
      setScanResult(result);
      setIsScanning(false);
    }
  };

  const handleStartScan = () => {
    setScanResult(null);
    setIsScanning(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="text-center bg-blue-600 text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">QR Code Scanner</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {isScanning ? (
            <QRScanner onScanSuccess={handleScan} />
          ) : (
            <div className="space-y-6">
              {scanResult ? (
                <ScanResult result={scanResult} />
              ) : (
                <div className="text-center text-gray-600 py-8">
                  <p>Press the button below to scan a QR code</p>
                  
                  <div className="flex justify-center mt-4">
                    <Button 
                      onClick={handleStartScan}
                      className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2 rounded-full transition-all"
                    >
                      Start Scanning
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
