
import React, { useState } from "react";
import QrReader from "react-qr-scanner";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Scan } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface QRScannerProps {
  onScanSuccess: (result: string) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanSuccess }) => {
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleScan = (data: { text: string } | null) => {
    if (data?.text) {
      toast({
        title: "QR-Code Erkannt",
        description: "Scan-Ergebnis wird verarbeitet...",
      });
      onScanSuccess(data.text);
    }
  };

  const handleError = (err: Error) => {
    console.error("QR Scanner error:", err);
    setError("Kamerazugriffsfehler. Bitte überprüfen Sie die Berechtigungen und versuchen Sie es erneut.");
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg overflow-hidden relative">
        {/* Scanner frame overlay */}
        <div className="absolute inset-0 border-2 border-[#003180] rounded-lg z-10 pointer-events-none">
          <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-[#003180] rounded-tl-lg"></div>
          <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-[#003180] rounded-tr-lg"></div>
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-[#003180] rounded-bl-lg"></div>
          <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-[#003180] rounded-br-lg"></div>
        </div>
        
        <div className="flex justify-center items-center">
          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            constraints={{
              video: { facingMode: "environment" }
            }}
            className="w-full max-w-sm mx-auto"
            style={{ width: '100%' }}
          />
        </div>
      </div>

      <div className="text-center text-sm text-gray-600">
        <div className="flex items-center justify-center mb-2">
          <Scan className="mr-2 h-4 w-4" />
          <span>QR-Code im Rahmen positionieren</span>
        </div>
      </div>

      {error && (
        <Alert variant="destructive">
          <Scan className="h-4 w-4 mr-2" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default QRScanner;
